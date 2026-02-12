<script lang="ts">
    import { Container, Col, Row, Icon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner, Input, FormGroup, Label, Modal, ModalHeader, ModalBody } from "@sveltestrap/sveltestrap";
    import LineCompare from "./LineCompare.svelte";
    import CostEstimationModal from "../../../components/common/CostEstimationModal.svelte";
    import { onMount } from "svelte";
    import { 
        availableLanguages,
        createLanguageConfigPromptStore,
        type LanguageConfigPromptStore
    } from "../../data/codeConversion";
    import { CodeConversionService, type CodeConversionRequest, type CodeConversionResponse, type SqlWorkflowRequestBody } from "$lib/services/codeConversionService";
    import { llmConfigStore, type LlmConfig } from "../../stores/llmConfigStore";
    import { toasts } from "../../stores/toastStore";
    import LlmConfigSelector from "../llm-config/LlmConfigSelector.svelte";

    // Props
    export let urlBase: string;
    export let onUnauthorized: () => void = () => {};

    // Color management
    const removedColor: string = '#e8a095';
    const addedColor: string = 'lightgreen';
    const replacedColor: string = '#e2e895';
    const emptyColor: string = 'lightsteelblue';
    const backgroundColor: string = 'white';

    // Header icon (dummy logo)
    const codeConversionLogo = 'file-code';

    // LLM management - now using configuration store
    let selectedLlmConfig: LlmConfig | null
    llmConfigStore.activeConfig.subscribe(
        (config) => {
            selectedLlmConfig = config;
        }
    );

    // Backend API access key (still needed for the backend service)
    let backendAccessKey: string = 'gAAAAABpaq1KvYRhAAf1vOIIDYztdJd8VStSsAn2uERRiWsUHEXVAdjxQX5EP79q_YY-Pin68xpNcuIcoDrmVjKNfEsMgoLaUw==';

    // Language management
    let inputSqlLanguage: string = 'Oracle';
    let targetSqlLanguage: string = 'SQL Server';

    // Endpoint selection
    type ConversionEndpoint = 'stream' | 'workflow';
    let selectedEndpoint: ConversionEndpoint = 'stream';
    
    const endpointOptions: Array<{value: ConversionEndpoint, label: string, description: string}> = [
        { value: 'stream', label: 'Stream Conversion', description: 'Real-time streaming response' },
        { value: 'workflow', label: 'Workflow Conversion', description: 'Workflow-based processing' }
    ];

    // View management
    let processing: boolean = false;
    let view: "input_only" | "input_output" | "output_only" = "input_only";

    // Resizable left panel
    let leftPanelWidth = 400;
    const minPanelWidth = 240;
    const maxPanelWidth = 520;
    let isResizing = false;

    // SQL input/output management and storage
    let sqlFileInput: FileList;
    let sqlContent: {
        inputContent: string,
        outputContent: string,
    } = {
        inputContent: "",
        outputContent: "",
    };

    // Explanation management
    let addExplanation: boolean = false;
    let explanation = '';

    // Prompt bind management and storage per language pair
    let customPrompt: string = '';
    let languageConfigPromptStore: LanguageConfigPromptStore = createLanguageConfigPromptStore();

    $: if (customPrompt) {
        languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].current = customPrompt;
    }

    // Token
    let input_tokens: number | undefined;
    let output_tokens: number | undefined;
    let price: string | undefined;

    // Time record
    let time_taken: number | null = null;
    let processingStartTime: number | null = null;
    let displayTime: number = 0;
    let timerInterval: number | null = null;

    // Cost Estimation Modal state
    let showCostModal: boolean = false;
    let costModalLoading: boolean = false;
    let costModalMode: 'estimation' | 'results' = 'estimation';
    let costEstimation: {
        inputTokens: number | null;
        promptTokens: number | null;
        sqlCodeTokens: number | null;
        projectedOutputTokens: number | null;
        projectedCost: string | null;
        costPerInputToken: number;
        costPerOutputToken: number;
    } = {
        inputTokens: null,
        promptTokens: null,
        sqlCodeTokens: null,
        projectedOutputTokens: null,
        projectedCost: null,
        costPerInputToken: 0,
        costPerOutputToken: 0,
    };
    let costEstimationError: string | null = null;
    let pendingConversionRequest: CodeConversionRequest | null = null;

    // Fetch controller management
    let controller = new AbortController();

    onMount(() => {
        document.body.classList.add('code-conversion-page');
        const updateNavbarHeight = () => {
            const navbar = document.querySelector('.navbar') as HTMLElement | null;
            const height = navbar?.offsetHeight ?? 0;
            document.documentElement.style.setProperty('--cc-navbar-height', `${height}px`);
        };

        updateNavbarHeight();
        window.addEventListener('resize', updateNavbarHeight);
        if (languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`]) {
            customPrompt = Object.entries(languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].original)[0][1];
        }

        return () => {
            window.removeEventListener('resize', updateNavbarHeight);
            document.documentElement.style.removeProperty('--cc-navbar-height');
            document.body.classList.remove('code-conversion-page');
        };
    });

    function startResize(event: MouseEvent): void {
        event.preventDefault();
        isResizing = true;
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', stopResize);
    }

    function handleResize(event: MouseEvent): void {
        if (!isResizing) return;
        const nextWidth = Math.min(maxPanelWidth, Math.max(minPanelWidth, event.clientX));
        leftPanelWidth = nextWidth;
    }

    function stopResize(): void {
        isResizing = false;
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', stopResize);
    }

    /**
     * Configuration management utilities
     * Updated to use LLM configuration store
     */
    function getLlmNameFromConfig(config: LlmConfig | null): string {
        //TODO: Rewrite this to handle all types of LLM options.
        if (!config) return 'GPT4o';
        
        if (config.provider === 'AzureOpenAI') {
            const azureConfig = config as typeof config & { provider: 'AzureOpenAI' };
            const model = azureConfig.config.model;
            // Map common Azure model names to LLMS dictionary keys
            if (model.includes('gpt-4o') || model.includes('gpt4o')) return 'GPT4o';
            if (model.includes('gpt-5') || model.includes('gpt5')) return 'GPT5';
            return 'GPT4o'; // Default fallback
        }
        
        return 'GPT4o'; // Default fallback for other providers
    }

    function validateLlmConfig(): { isValid: boolean; message: string } {
        if (!backendAccessKey) {
            return { isValid: false, message: 'Backend Access Key is required' };
        }
        
        if (!selectedLlmConfig) {
            return { isValid: false, message: 'LLM configuration is required' };
        }
        
        return { isValid: true, message: '' };
    }

    /**
     * Calculates cost estimation based on input tokens and pricing
     * Uses a smooth formula that scales with SQL code size:
     * - Small SQL (< 50 tokens): ~15x expansion (lots of explanation/formatting overhead)
     * - Large SQL (> 1000 tokens): ~1.2x expansion (mostly 1:1 conversion)
     */
    function calculateProjectedCost(sqlCodeTokens: number, costPerInputToken: number, costPerOutputToken: number): { projectedOutputTokens: number; projectedCost: string } {
        // Smooth scaling formula: starts at ~15x for tiny SQL, approaches 1.2x for large SQL
        // Formula: 1.2 + (14 / (1 + sqlTokens / 100))
        const multiplier = 1.2 + (14 / (1 + sqlCodeTokens / 100));
        const projectedOutputTokens = Math.ceil(sqlCodeTokens * multiplier);
        
        const inputCost = (sqlCodeTokens * costPerInputToken);
        const outputCost = (projectedOutputTokens * costPerOutputToken);
        const totalCost = inputCost + outputCost;
        
        return {
            projectedOutputTokens,
            projectedCost: totalCost.toFixed(6)
        };
    }

    /**
     * Gets token count and pricing information for cost estimation
     * Minimum loading duration ensures a consistent UX (prevents spinner flash)
     */
    async function estimateCost(): Promise<void> {
        if (!selectedLlmConfig) {
            costEstimationError = 'LLM configuration is required';
            return;
        }

        costModalLoading = true;
        costEstimationError = null;
        const minLoadingDuration = 1000; // milliseconds
        const loadingStartTime = Date.now();

        try {
            // Get LLM name from config
            const llmName = getLlmNameFromConfig(selectedLlmConfig);

            //TODO: Resolve the discrepancy between input tokens on the cost estimation modal and input tokens on the page. Modal has 2-3 more tokens for input.
            
            // Construct the EXACT prompt template that the backend uses in sql_convert.py
            // Python's triple-quoted string starts with a newline
            let fullInput = `\nYou are an expert SQL developer with deep knowledge of different SQL dialects.\nConvert the following SQL code from ${inputSqlLanguage} to ${targetSqlLanguage}.\n\n`;
            
            // specific_instructions gets its own line even if empty
            fullInput += `${customPrompt || ''}\n\n`;
            
            fullInput += `Source SQL Code (${inputSqlLanguage}):\n\`\`\`sql\n${sqlContent.inputContent}\n\`\`\`\n\n`;
            fullInput += `Provide the fully converted SQL code in ${targetSqlLanguage} dialect.\n`;
            fullInput += `Ensure all logic, operations, and functionality are preserved in the output.\n`;
            fullInput += `Focus on correctness, completeness, and adherence to ${targetSqlLanguage} best practices.\n`;
            fullInput += `Do NOT provide placeholder text or comments like 'code will be provided here'.`;
            
            // Get input token count (includes prompt + SQL code)
            const inputTokens = await CodeConversionService.getTokenCount(
                fullInput,
                llmName
            );

            // Get token count for JUST the SQL code to estimate output size
            const sqlCodeTokens = await CodeConversionService.getTokenCount(
                sqlContent.inputContent,
                llmName
            );

            // Get LLM pricing
            const pricing = await CodeConversionService.getLlmPrice(
                llmName
            );

            // Calculate projected output tokens based on SQL code only, not full prompt
            const { projectedOutputTokens, projectedCost } = calculateProjectedCost(
                sqlCodeTokens,  // Use SQL code tokens for output estimation
                pricing.cost_per_input_token,
                pricing.cost_per_output_token
            );

            // Calculate prompt tokens (full input minus SQL code)
            const promptTokens = inputTokens - sqlCodeTokens;
            
            // But use actual input tokens (with prompt) for cost calculation
            const actualInputCost = inputTokens * pricing.cost_per_input_token;
            const estimatedOutputCost = projectedOutputTokens * pricing.cost_per_output_token;
            const actualProjectedCost = (actualInputCost + estimatedOutputCost).toFixed(6);

            costEstimation = {
                inputTokens,
                promptTokens,
                sqlCodeTokens,
                projectedOutputTokens,
                projectedCost: actualProjectedCost,  // Use the corrected cost calculation
                costPerInputToken: pricing.cost_per_input_token,
                costPerOutputToken: pricing.cost_per_output_token,
            };
        } catch (error) {
            console.error('Error estimating cost:', error);
            costEstimationError = error instanceof Error ? error.message : 'Failed to estimate cost';
        } finally {
            // Ensure minimum loading duration for consistent UX
            const elapsedTime = Date.now() - loadingStartTime;
            const remainingDelay = Math.max(0, minLoadingDuration - elapsedTime);
            
            if (remainingDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingDelay));
            }
            
            costModalLoading = false;
        }
    }

    /**
     * Opens the cost estimation modal and calculates costs
     */
    async function openCostModal(): Promise<void> {
        costModalMode = 'estimation';
        showCostModal = true;
        await estimateCost();
    }

    /**
     * Opens the results modal with actual conversion data
     */
    function openResultsModal(): void {
        costModalMode = 'results';
        showCostModal = true;
    }

    /**
     * Closes the cost modal
     */
    function closeCostModal(): void {
        showCostModal = false;
        costEstimationError = null;
        pendingConversionRequest = null;
    }

    /**
     * Proceeds with conversion after cost modal confirmation
     */
    async function proceedWithConversion(): Promise<void> {
        const request = pendingConversionRequest;  // Save request before closing modal
        closeCostModal();
        
        if (!request) {
            toasts.push({ message: 'Conversion request was lost', color: 'danger' });
            return;
        }

        try {
            time_taken = 0;
            displayTime = 0;
            processingStartTime = Date.now();
            processing = true;
            resetSqlContent();
            view = "output_only";
            
            // Update display time every 100ms for smooth updates
            timerInterval = window.setInterval(() => {
                if (processingStartTime) {
                    displayTime = (Date.now() - processingStartTime) / 1000;
                }
            }, 100);
            
            await ConversionManager.execute(
                request, backendAccessKey, urlBase, selectedLlmConfig!.id, controller, selectedEndpoint,
                {
                    onChunk: handleChunk,
                    onComplete: handleComplete,
                    onError: handleError
                }
            );
        } catch (error) {
            console.error('Conversion error:', error);
            if (error instanceof Error && error.message.includes('401')) {
                onUnauthorized();
            }
            toasts.push({ 
                message: error instanceof Error ? error.message : 'Conversion failed', 
                color: 'danger' 
            });
        } finally {
            if (timerInterval !== null) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            processingStartTime = null;
            processing = false;
            
            // Show results modal after successful conversion
            if (output_tokens && input_tokens && price) {
                openResultsModal();
            }
        }
    }

    class ConversionManager {
        static async execute(
            request: CodeConversionRequest,
            backendKey: string,
            urlBase: string,
            configId: string,
            controller: AbortController,
            endpoint: ConversionEndpoint,
            callbacks: {
                onChunk: (data: CodeConversionResponse & { explanation?: string }) => void;
                onComplete: () => void;
                onError: (reason: string) => void;
            }
        ): Promise<void> {
            let response: Response;
            if (endpoint === 'stream') {
                response = await CodeConversionService.convertCodeStream(
                    request, backendKey, configId, controller
                );
                
                const validation = CodeConversionService.validateResponse(response);
                if (!validation.isValid) {
                    throw new Error(validation.errorMessage!);
                }

                await CodeConversionService.processStreamResponse(
                    response.body!,
                    callbacks.onChunk,
                    callbacks.onComplete,
                    callbacks.onError
                );
            } else {
                // Convert CodeConversionRequest to SqlWorkflowRequestBody
                const workflowRequest: SqlWorkflowRequestBody = {
                    sql_code: request.code,
                    source_dialect: request.input_language,
                    target_dialect: request.target_language,
                    specific_instructions: request.prompt
                };
                
                response = await CodeConversionService.convertCodeWorkflow(
                    workflowRequest, backendKey, configId, controller
                );
                
                const validation = CodeConversionService.validateResponse(response);
                if (!validation.isValid) {
                    throw new Error(validation.errorMessage!);
                }

                await CodeConversionService.processWorkflowResponse(
                    response.body!,
                    callbacks.onChunk,
                    callbacks.onComplete,
                    callbacks.onError
                );
            }
        }

        static buildRequest(
            content: string,
            inputLang: string,
            targetLang: string,
            prompt: string,
            explanation: boolean
        ): CodeConversionRequest {
            return {
                code: content,
                debug: false,
                input_language: inputLang,
                target_language: targetLang,
                prompt: prompt,
                add_explanation: explanation,
            };
        }
    }

    async function convertStream(): Promise<void> {
        const validation = validateLlmConfig();
        if (!validation.isValid) {
            toasts.push({ message: validation.message, color: 'danger' });
            return;
        }
        
        if (!sqlContent.inputContent.trim()) {
            toasts.push({ message: 'Please enter SQL code to convert', color: 'danger' });
            return;
        }

        // Create the conversion request and store it for later execution
        pendingConversionRequest = ConversionManager.buildRequest(
            sqlContent.inputContent, inputSqlLanguage, 
            targetSqlLanguage, customPrompt, addExplanation
        );

        // Open the cost estimation modal
        await openCostModal();
    }

    class ResponseHandler {
        static updateResults(
            data: CodeConversionResponse & { explanation?: string },
            outputSetter: (content: string) => void,
            explanationSetter: (explanation: string) => void
        ): void {
            outputSetter(data.output);
            if (data.explanation) {
                explanationSetter(data.explanation);
            }
        }

        static updateTokens(
            data: CodeConversionResponse,
            inputTokenSetter: (tokens: number) => void,
            outputTokenSetter: (tokens: number) => void
        ): void {
            inputTokenSetter(data.tokens.input);
            outputTokenSetter(data.tokens.output);
        }

        static updateTiming(data: CodeConversionResponse, timeSetter: (time: number) => void): void {
            timeSetter(data.time);
        }
    }

    /**
     * Handles streaming response chunks with simplified processing
     */
    function handleChunk(data: CodeConversionResponse & { explanation?: string }): void {
        ResponseHandler.updateResults(
            data,
            (content) => { sqlContent.outputContent = content; },
            (exp) => { explanation = exp; }
        );
        
        ResponseHandler.updateTokens(
            data,
            (tokens) => { input_tokens = tokens; },
            (tokens) => { output_tokens = tokens; },
        );
        
        ResponseHandler.updateTiming(data, (time) => { time_taken = time; });

        // Calculate actual cost if we have output tokens
        if (output_tokens && input_tokens) {
            const actualInputCost = input_tokens * costEstimation.costPerInputToken;
            const actualOutputCost = output_tokens * costEstimation.costPerOutputToken;
            const actualTotalCost = actualInputCost + actualOutputCost;
            price = actualTotalCost.toFixed(6);
        }
    }

    /**
     * Handles completion of the conversion process
     */
    function handleComplete(): void {
    }

    /**
     * Handles errors during the conversion process
     */
    function handleError(reason: string): void {
        toasts.push({ 
            message: `Conversion failed: ${reason}`, 
            color: 'danger' 
        });
    }

    async function cancel(): Promise<void> {
        controller.abort();
        controller = new AbortController();
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        processingStartTime = null;
        processing = false;
    }

    function resetSqlContent(): void {
        sqlContent = {
            inputContent: sqlContent.inputContent,
            outputContent: "",
        };
        explanation = '';
    }

    async function onChangeSqlInput(value: string): Promise<void> {
        sqlContent = {
            inputContent: value,
            outputContent: "",
        };
    }

    async function onChangeCustomPrompt(value: string): Promise<void> {
        customPrompt = value;
    }

    async function onChangeSqlFileInput(): Promise<void> {
        if (!sqlFileInput) {
            throw new Error('No sql file input');
        }

        try {
            const content = await CodeConversionService.readFileAsText(sqlFileInput[0]);
            await onChangeSqlInput(content);
        } catch (error) {
            console.error('Error reading file:', error);
            toasts.push({ message: 'Error reading file', color: 'danger' });
        }
    }

    function onChangeInputSqlLanguage(language: string): void {
        inputSqlLanguage = language;
        customPrompt = languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].current;
    }

    function onChangeTargetSqlLanguage(language: string): void {
        targetSqlLanguage = language;
        customPrompt = languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].current;
    }

    function getValueFromEvent(event: Event): string {
        return (event.target as HTMLInputElement).value;
    }

    async function download(): Promise<void> {
        try {
            CodeConversionService.downloadAsFile(sqlContent.outputContent, 'output.sql');
        } catch (error) {
            console.error('Error downloading file:', error);
            toasts.push({ message: 'Error downloading file', color: 'danger' });
        }
    }

    async function copyToClipboard(): Promise<void> {
        try {
            await CodeConversionService.copyToClipboard(sqlContent.outputContent);
            toasts.push({ message: 'Copied to clipboard', color: 'success' });
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toasts.push({ message: 'Error copying to clipboard', color: 'danger' });
        }
    }

    function getAvailableLanguagesExcept(except: string) {
        return availableLanguages.filter(lang => lang.name !== except);
    }
</script>

<Container fluid class="conversion-container">
    <CostEstimationModal
        isOpen={showCostModal}
        isLoading={costModalLoading}
        mode={costModalMode}
        inputTokens={costEstimation.inputTokens}
        promptTokens={costEstimation.promptTokens}
        sqlCodeTokens={costEstimation.sqlCodeTokens}
        projectedOutputTokens={costEstimation.projectedOutputTokens}
        projectedCost={costEstimation.projectedCost}
        actualOutputTokens={output_tokens}
        actualCost={price}
        timeTaken={displayTime}
        estimationError={costEstimationError}
        onConfirm={proceedWithConversion}
        onCancel={closeCostModal}
    />

    <div class="conversion-layout" class:resizing={isResizing}>
        <div class="panel-group">
            <div class="conversion-panel" style={`width: ${leftPanelWidth}px;`}>
                <div class="conversion-panel-content">
                    <FormGroup>
                        <Label for="input_sql_file">Upload SQL file:</Label>
                        <Input type="file" id="input_sql_file" bind:files={sqlFileInput} on:change={onChangeSqlFileInput}/>
                    </FormGroup>

                    <!-- LLM Configuration Selection -->
                    <div class="mb-3">
                        <Label for="llmConfigSelect">
                            LLM Configuration
                            <span class="text-danger">*</span>
                        </Label>
                        <div class="llm-config-wrapper">
                            <LlmConfigSelector
                                placeholder="Select LLM configuration"
                            />
                        </div>
                    </div>

                    <!-- Backend Access Key -->
                    <FormGroup>
                        <Label for="backendAccessKey">Access Key:</Label>
                        <span class="text-danger">*</span>
                        <Input type="password" id="backendAccessKey" bind:value={backendAccessKey}/>
                    </FormGroup>

                    <!-- Endpoint Selection -->
                    <FormGroup>
                        <Label for="endpointSelect">Conversion Endpoint:</Label>
                        <Dropdown direction="down" class="mb-2" id="endpointSelect">
                            <DropdownToggle caret class="btn btn-styled btn-styled-primary w-100">
                                {endpointOptions.find(opt => opt.value === selectedEndpoint)?.label || 'Select Endpoint'}
                            </DropdownToggle>
                            <DropdownMenu style="width: 100%;">
                                {#each endpointOptions as option}
                                    <DropdownItem on:click={() => {selectedEndpoint = option.value}}>
                                        <div>
                                            <strong>{option.label}</strong>
                                            <br>
                                            <small class="text-muted">{option.description}</small>
                                        </div>
                                    </DropdownItem>
                                {/each}
                            </DropdownMenu>
                        </Dropdown>
                    </FormGroup>
                    <hr>
                    
                    <label class="mb-2">Select Initial and Target SQL Language:</label>
                    <span class="text-danger">*</span>
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <Dropdown direction="down" class="flex-grow-1" id="sql-dropdown">
                            <DropdownToggle caret class="btn btn-styled btn-styled-primary w-100">
                                {inputSqlLanguage}
                            </DropdownToggle>
                            <DropdownMenu>
                                {#each getAvailableLanguagesExcept(targetSqlLanguage) as language}
                                    <DropdownItem on:click={() => {onChangeInputSqlLanguage(language.name)}}>{language.displayName}</DropdownItem>
                                {/each}
                            </DropdownMenu>
                        </Dropdown>

                        <Icon name="arrow-right" />
                        
                        <Dropdown direction="down" class="flex-grow-1">
                            <DropdownToggle caret class="btn btn-styled btn-styled-primary w-100">
                                {targetSqlLanguage}
                            </DropdownToggle>
                            <DropdownMenu>
                                {#each getAvailableLanguagesExcept(inputSqlLanguage) as language}
                                    <DropdownItem on:click={() => {onChangeTargetSqlLanguage(language.name)}}>{language.displayName}</DropdownItem>
                                {/each}
                            </DropdownMenu>
                        </Dropdown>
                    </div>        
                    <hr>
                    
                    {#if input_tokens || output_tokens || price || time_taken}
                        {#if input_tokens}
                            <div>Input Tokens: <b>{input_tokens}</b></div>
                        {/if}
                        {#if output_tokens}
                            <div>Output Tokens: <b>{output_tokens}</b></div>
                        {/if}
                        {#if price} <!-- TODO: Configure this for the Workflow Converion as well. -->
                            <div>{output_tokens ? 'Actual' : 'Estimated'} Price: <b>${price}</b> USD</div>
                        {/if}
                        {#if displayTime}
                            <div>Time taken: <b>{displayTime.toFixed(2)}</b> seconds</div>
                        {/if}
                        <hr>
                    {/if}
                    
                    <div>
                        {#if processing}
                            <button class="panel-button panel-button-danger w-100" on:click={cancel}>Cancel</button>
                        {:else if view === "input_only"}
                            {#if sqlContent && sqlContent.inputContent && sqlContent.inputContent !== '' && sqlContent.outputContent && sqlContent.outputContent !== ''}
                                <button class="panel-button panel-button-secondary w-100" on:click={()=>{view = "output_only"}}>View Output</button>
                            {/if}
                        {:else if view === "output_only"}
                            <div class="action-grid">
                                <button class="panel-button panel-button-primary" on:click={convertStream}>Retry Conversion</button>
                                <button class="panel-button panel-button-secondary" on:click={()=>{view = "input_only"}}>Change Input</button>
                                <button class="panel-button panel-button-secondary" on:click={copyToClipboard}>Copy Output</button>
                                <button class="panel-button panel-button-secondary" on:click={download}>Download Output</button>
                            </div>                    
                        {:else}
                            <div>Unexpected Error</div>
                        {/if}
                    </div>
                    <hr>
                    
                    <Row>
                        <span>Legend:</span>
                        <span><span style="color:{removedColor};"><Icon name="square-fill"/></span> - Removed</span>
                        <span><span style="color:{addedColor};"><Icon name="square-fill"/></span> - Added</span>
                        <span><span style="color:{replacedColor};"><Icon name="square-fill"/></span> - Replaced</span>
                        <span><span style="color:{emptyColor};"><Icon name="square-fill"/></span> - Empty</span>
                        <span><span style="color:{backgroundColor};"><Icon name="square-fill"/></span> - Background</span>
                    </Row>
                    <hr>
                </div>
            </div>
            <div class="resize-handle" on:mousedown={startResize} title="Drag to resize">
                <Icon name="grip-vertical" />
            </div>
        </div>
        <div class="conversion-main">
            <div class="header-section">
                <h2><Icon name={codeConversionLogo} /> SQL Code Conversion</h2>
                <p class="text-muted">Convert between SQL dialects using AI.</p>
            </div>
            <hr class="my-4"/>
            {#if sqlContent
                && sqlContent.inputContent 
                && sqlContent.outputContent 
                && sqlContent.inputContent !== ''
                && sqlContent.outputContent !== ''
                && view === "output_only"
            }
                <br>
                <Row>
                    <Col>
                        <LineCompare 
                            bind:oldText={sqlContent.inputContent}
                            bind:newText={sqlContent.outputContent}
                            {removedColor}
                            {addedColor}
                            {replacedColor}
                            {emptyColor}
                            {backgroundColor}
                            input={inputSqlLanguage}
                            output={targetSqlLanguage}
                        />
                    </Col>
                    {#if explanation}
                        <Col xs="3">
                            <h2 class="fs-2 fw-bold">Explanation</h2>
                            <p>{explanation}</p>
                        </Col>
                    {/if}
                </Row>
            {:else if view === "input_only"}
                <br>
                <Row>
                    <Col></Col>
                    <Col style="display: flex; align-items: center;">
                        <Dropdown direction="down" class="mb-3">
                            <DropdownToggle caret class="btn btn-styled btn-styled-primary">
                                Select Prompt
                            </DropdownToggle>
                            <DropdownMenu>
                                {#each Object.entries(languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].original) as [key, value]}
                                    <DropdownItem on:click={() => {onChangeCustomPrompt(value)}}>{key}</DropdownItem>
                                {/each}
                            </DropdownMenu>
                        </Dropdown>
                        <div class="form-check mx-2 mb-3">
                            <input class="form-check-input" type="checkbox" bind:checked={addExplanation} id="addExplanation"/>
                            <label class="form-check-label" for="addExplanation">Add Explanation</label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <textarea bind:value={sqlContent.inputContent} placeholder="Enter SQL code here" rows="20" style="width: 100%" on:input={(e) => {onChangeSqlInput(getValueFromEvent(e))}}></textarea>
                    </Col>
                    <Col>
                        <textarea bind:value={customPrompt} placeholder="Enter custom prompt here" rows="20" style="width: 100%" on:input={(e) => {onChangeCustomPrompt(getValueFromEvent(e))}}></textarea>
                    </Col>
                </Row>
                <div class="d-flex justify-content-center mt-3">
                    <button class="btn btn-styled btn-convert-main w-25 py-2" on:click={convertStream}>Convert</button>
                </div>
            {:else if processing}
                {#if displayTime !== null}
                    <div class="d-flex justify-content-center align-items-center mt-5">
                        <Spinner color="primary" />
                        <h4 class="m-0 ms-3">{displayTime.toFixed(2)}s</h4>
                    </div>
                {/if}
            {:else}
                <div>Unexpected Error</div>
            {/if}
        </div>
    </div>
</Container>

<style>
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .header-section {
        text-align: center;
        margin: 22px 0 10px;
    }

    .header-section h2 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }

    .conversion-layout {
        display: flex;
        align-items: flex-start;
        gap: 0;
        margin-top: 0;
        min-height: calc(100vh - var(--cc-navbar-height, 0px));
        padding: 0;
    }

    :global(.conversion-container) {
        padding-top: 0;
    }

    .conversion-panel {
        min-width: 240px;
        max-width: 520px;
        border: 1px solid #cfd4da;
        border-radius: 8px;
        background-color: #ffffff;
        height: auto;
        overflow: hidden;
    }

    .conversion-panel-content {
        padding: 20px 12px 16px;
        max-height: calc(100vh - var(--cc-navbar-height, 0px) - 28px);
        overflow: auto;
    }

    .panel-group {
        display: flex;
        align-items: stretch;
        height: fit-content;
        position: sticky;
        top: calc(var(--cc-navbar-height, 0px) + 20px);
        align-self: flex-start;
    }

    :global(body.code-conversion-page .navbar) {
        position: sticky;
        top: 0;
        z-index: 1030;
    }

    .conversion-main {
        flex: 1;
        padding: 10px 0 0 10px;
        min-height: 100%;
    }

    .resize-handle {
        width: 16px;
        cursor: col-resize;
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6c757d;
        background: transparent;
    }

    .conversion-layout.resizing {
        user-select: none;
    }

    .main-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-top: 2px;
    }

    .panel-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 10px;
        border: 1px solid transparent;
        font-weight: 600;
        line-height: 1.2;
        background: #e9ecef;
        color: #212529;
    }

    .panel-button-primary {
        background: #0d6efd;
        border-color: #0d6efd;
        color: #ffffff;
    }

    .panel-button-secondary {
        background: #e9ecef;
        border-color: #ced4da;
        color: #212529;
    }

    .panel-button-danger {
        background: #dc3545;
        border-color: #dc3545;
        color: #ffffff;
    }

    :global(.panel-button:disabled) {
        opacity: 0.65;
        cursor: not-allowed;
    }

    :global(.conversion-panel .form-control),
    :global(.conversion-panel .dropdown),
    :global(.conversion-panel .dropdown-toggle) {
        width: 100%;
    }

    .llm-config-wrapper {
        width: 100%;
        max-width: 100%;
    }

    :global(.llm-config-wrapper *),
    :global(.llm-config-wrapper .form-control),
    :global(.llm-config-wrapper .dropdown),
    :global(.llm-config-wrapper .dropdown-toggle) {
        max-width: 100%;
    }
    
    :global(.badge-sm) {
        font-size: 0.7em;
    }

    @media (min-width: 768px) {
        :global(.sidebar-col) {
            border-right: 1px solid #dee2e6;
            min-height: 80vh;
        }
    }

    @media (max-width: 767.98px) {
        :global(.sidebar-col) {
            border-bottom: 1px solid #dee2e6;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
        }
    }

    /* Styled Buttons */
    :global(.btn-styled) {
        border-radius: 6px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: none;
    }

    :global(.btn-styled-primary) {
        background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
        color: white;
    }

    :global(.btn-styled-primary:hover:not(:disabled)) {
        background: linear-gradient(135deg, #388bff 0%, #0d6efd 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(13, 110, 253, 0.3);
        color: white;
    }
    
    :global(.btn-styled-primary:active:not(:disabled)) {
        transform: translateY(1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    :global(.btn-styled-secondary) {
        background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        color: white;
    }

    :global(.btn-styled-secondary:hover:not(:disabled)) {
        background: linear-gradient(135deg, #868e96 0%, #6c757d 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(108, 117, 125, 0.3);
    }

    :global(.btn-styled-danger) {
        background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%);
        color: white;
    }

    :global(.btn-styled-danger:hover:not(:disabled)) {
        background: linear-gradient(135deg, #ff4d5e 0%, #dc3545 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(220, 53, 69, 0.3);
    }

    :global(.btn-styled:disabled) {
        background: #e9ecef;
        color: #6c757d;
        box-shadow: none;
        cursor: not-allowed;
    }

    /* Helper for full width buttons in sidebar */
    .w-100-btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    /* Custom File Input Styling */
    :global(.form-control[type="file"]::file-selector-button) {
        background: #ffffff;
        color: #0d6efd;
        border: 1px solid #0d6efd;
        padding: 0.375rem 0.75rem;
        margin-right: 1rem;
        border-radius: 4px;
        transition: all 0.3s ease;
        font-weight: 600;
        cursor: pointer;
    }

    :global(.form-control[type="file"]::file-selector-button:hover) {
        background: #f8f9fa;
        box-shadow: 0 4px 6px rgba(13, 110, 253, 0.15);
    }

    /* Custom Dropdown Button Styling */
    :global(.dropdown-toggle.btn-styled-primary) {
        background: #ffffff;
        color: #0d6efd;
        border: 1px solid #0d6efd;
    }

    :global(.dropdown-toggle.btn-styled-primary:hover) {
        background: #f8f9fa;
        color: #0d6efd;
        box-shadow: 0 4px 6px rgba(13, 110, 253, 0.15);
        transform: translateY(-2px);
    }

    .action-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        width: 100%;
    }
    
    .action-grid button {
        width: 100%;
        height: 100%;
        margin: 0;
        white-space: normal;
        line-height: 1.2;
        padding: 8px 4px;
        font-size: 0.9em;
    }

    /* Main Convert Button (Special Styling) */
    .btn-convert-main {
        background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%) padding-box,
                    linear-gradient(45deg, #0dcaf0 0%, #6610f2 100%) border-box;
        border: 2px solid transparent;
        color: white;
        border-radius: 8px;
        font-weight: 700;
        letter-spacing: 1px;
    }

    .btn-convert-main:hover {
        background: linear-gradient(135deg, #388bff 0%, #0d6efd 100%) padding-box,
                    linear-gradient(45deg, #00f2ff 0%, #9d50bb 100%) border-box;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
        color: white;
    }
</style>
