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

    onMount(async () => {
        if (languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`]) {
            customPrompt = Object.entries(languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].original)[0][1];
        }
    });

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

<Container fluid>
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
    
    <Row>
        <Col xs="2">
            <br>
            <h3 class="fs-3 fw-bold">SQL Code Conversion</h3>
            <hr>
            
            <!-- LLM Configuration Selection -->
            <div class="mb-3">
                <Label for="llmConfigSelect">
                    LLM Configuration
                    <span class="text-danger">*</span>
                </Label>
                <LlmConfigSelector
                    placeholder="Select LLM configuration"
                />
            </div>

            <!-- Backend Access Key -->
            <FormGroup>
                <Label for="backendAccessKey">Backend Access Key:</Label>
                <Input type="password" id="backendAccessKey" bind:value={backendAccessKey}/>
            </FormGroup>

            <!-- Endpoint Selection -->
            <FormGroup>
                <Label for="endpointSelect">Conversion Endpoint:</Label>
                <Dropdown direction="down" class="mb-2" id="endpointSelect">
                    <DropdownToggle caret style="background-color:white; color: black; width: 100%;">
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
            
            <label for="input_sql_language">Select Initial SQL Language:</label>
            <Dropdown direction="down" class="" id="sql-dropdown">
                <DropdownToggle caret style="background-color:white; color: black;">
                    {inputSqlLanguage}
                </DropdownToggle>
                <DropdownMenu>
                    {#each getAvailableLanguagesExcept(targetSqlLanguage) as language}
                        <DropdownItem on:click={() => {onChangeInputSqlLanguage(language.name)}}>{language.displayName}</DropdownItem>
                    {/each}
                </DropdownMenu>
            </Dropdown>
            
            <label for="target_sql_language">Select Target SQL Language:</label>
            <Dropdown direction="down" class="mb-3">
                <DropdownToggle caret style="background-color:white; color: black;">
                    {targetSqlLanguage}
                </DropdownToggle>
                <DropdownMenu>
                    {#each getAvailableLanguagesExcept(inputSqlLanguage) as language}
                        <DropdownItem on:click={() => {onChangeTargetSqlLanguage(language.name)}}>{language.displayName}</DropdownItem>
                    {/each}
                </DropdownMenu>
            </Dropdown>        
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
            
            <div class="input-group">
                {#if processing}
                    <div class="me-1 my-1">
                        <button class="btn btn-secondary" on:click={cancel}>Cancel</button>
                    </div>
                {:else if view === "input_only"}
                    <div class="me-1 my-1">
                        <button class="btn btn-secondary" on:click={convertStream}>Convert</button>
                    </div>
                    {#if sqlContent && sqlContent.inputContent && sqlContent.inputContent !== '' && sqlContent.outputContent && sqlContent.outputContent !== ''}
                        <div class="me-1 my-1">
                            <button class="btn btn-secondary" on:click={()=>{view = "output_only"}}>View Output</button>
                        </div>
                    {/if}
                {:else if view === "output_only"}
                    <div class="me-1 my-1">
                        <button class="btn btn-secondary" on:click={convertStream}>Retry Conversion</button>
                    </div>
                    <div class="me-1 my-1">
                        <button class="btn btn-secondary" on:click={()=>{view = "input_only"}}>Change Input</button>
                    </div>
                    <div class="me-1 my-1">
                        <button class="btn btn-secondary" on:click={copyToClipboard}>Copy Output</button>
                    </div>
                    <div class="me-1 my-1">
                        <button class="btn btn-secondary" on:click={download}>Download Output</button>
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
            
        </Col>
        <Col xs="10">
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
                    <Col>
                        <FormGroup style="max-width: 350px;">
                            <Input type="file" id="input_sql_file" bind:files={sqlFileInput} on:change={onChangeSqlFileInput}/>
                        </FormGroup>
                    </Col>
                    <Col style="display: flex; align-items: center;">
                        <Dropdown direction="down" class="mb-3">
                            <DropdownToggle caret style="background-color:white; color: black;">
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
        </Col>
    </Row>
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
    
    :global(.badge-sm) {
        font-size: 0.7em;
    }
</style>
