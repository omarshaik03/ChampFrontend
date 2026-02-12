<script lang="ts">
    import { Container, Col, Row, Button, FormGroup, Icon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "@sveltestrap/sveltestrap";
    import { LLMS, type Llm } from "$lib/commontypes";
    import Linecompare from "./linecompare.svelte";
    import JSZip from "jszip";
	import Toastwrapper from "../../common/toastwrapper.svelte";
	import type { User } from "../../../lib/stores/userStore";
    import { userStore } from "../../../lib/stores/userStore";
    import { toasts } from "$lib/stores/toastStore";
    // LLM config integration
    import { llmConfigStore, modelSupportsTemperature } from "$lib/stores/llmConfigStore";
    import type { LlmConfig } from "$lib/stores/llmConfigStore";
    import LlmConfigSelector from "$lib/components/llm-config/LlmConfigSelector.svelte";
    import runtimeConfig from "$lib/runtime-config";
    import { onMount } from "svelte";

    const codeInsightsLogo = 'clipboard-data';

    let llm: Llm = 'GPT4o';
    let sql_language: string = 'MS SQL Server';    // data management
    let user = $userStore as User | null;
    let url_base: string = runtimeConfig.CODE_INSIGHTS_URL;

    // Resizable left panel
    let leftPanelWidth = 400;
    const minPanelWidth = 240;
    const maxPanelWidth = 520;
    let isResizing = false;

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

    onMount(() => {
        document.body.classList.add('code-insights-page');
        const updateNavbarHeight = () => {
            const navbar = document.querySelector('.navbar') as HTMLElement | null;
            const height = navbar?.offsetHeight ?? 0;
            document.documentElement.style.setProperty('--ci-navbar-height', `${height}px`);
        };

        updateNavbarHeight();
        window.addEventListener('resize', updateNavbarHeight);

        return () => {
            window.removeEventListener('resize', updateNavbarHeight);
            document.documentElement.style.removeProperty('--ci-navbar-height');
            document.body.classList.remove('code-insights-page');
        };
    });

    // Access key for new CodeInsights microservice (required as form field)
    let accessKey: string = '';
    $: if (user && !accessKey) {
        accessKey = "gAAAAABpaq1KvYRhAAf1vOIIDYztdJd8VStSsAn2uERRiWsUHEXVAdjxQX5EP79q_YY-Pin68xpNcuIcoDrmVjKNfEsMgoLaUw==";
    }

    let removedColor: string = 'lightcoral';
    let addedColor: string = 'lightgreen';
    let replacedColor: string = '#FFFF70';
    let emptyColor: string = 'lightsteelblue';
    let backgroundColor: string = 'white';

    let watch_process: boolean = false;
    let processing: boolean = false;

    let zipFileInput: FileList | null = null;
    let reportFileInput: FileList | null = null;
    let zipContent: {
        [name: string]: {
            inputContent: string | undefined,
            outputContent: string | undefined,
            selected: boolean,
            status: "complete" | "incomplete" | "processing",
        }
    } = {};
    let reportContent: string[][] | undefined;
    let inputZip: JSZip|undefined;
    let selectedFileName: string = '';

    // token and price management
    let input_tokens: number | undefined;
    let output_tokens: number | undefined;
    let price: string | undefined;

    //time record
    let time_taken: number | null = null;
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    let controller = new AbortController();
    // Active LLM config store
    const activeConfig = llmConfigStore.activeConfig;

    function getPrice(_input_tokens?: number, _output_tokens?: number): string {
        return (
            ((_input_tokens??0) * LLMS[llm].token_cost.input) +
            ((_output_tokens??0) * LLMS[llm].token_cost.output)
        ).toFixed(3);
    }

    async function processFiles(zipFile?: File, reportFile?: File) {
        if (!user) {
            console.log("User not logged in");
            toasts.push({ message: "User not logged in", color: "danger" });
            return;
        }
        if (!zipFile || !reportFile) {
            console.log("Zip file or report file not provided");
            toasts.push({ message: "Zip file and report file are required", color: "danger" });
            return;
        }

        controller = new AbortController();
        const signal = controller.signal;

        time_taken = 0;
        processing = true;
        input_tokens = undefined;
        output_tokens = undefined;
        price = undefined;

        if (timerInterval) {
            clearInterval(timerInterval);
        }
        const startTime = Date.now();
        timerInterval = setInterval(() => {
            time_taken = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
        }, 200);

    const formData = new FormData();
        formData.append("report_file", reportFile);
        formData.append("zip_file", zipFile);
        formData.append("access_key", accessKey ?? "");
        formData.append("dialect", sql_language);

        const cfg: LlmConfig | null = $activeConfig;
        if (cfg) {
            const defaultTemp = 0.2;
            if (cfg.provider === 'AzureOpenAI') {
                formData.append('llm_provider', 'Azure OpenAI');
                // @ts-ignore - types known from store data structure
                formData.append('llm_key', cfg.config.api_key || '');
                // @ts-ignore
                formData.append('llm_endpoint', cfg.config.azure_endpoint || '');
                // @ts-ignore
                formData.append('llm_deployment_name', cfg.config.azure_deployment || '');
                // @ts-ignore
                formData.append('llm_api_version', cfg.config.api_version || '');
                // @ts-ignore
                if (cfg.config.model) formData.append('llm_model_id', cfg.config.model);
                // @ts-ignore
                const modelName = cfg.config.model;
                // @ts-ignore
                const deploymentName = (cfg.config.azure_deployment || '').toString();
                let supportsTemp = modelSupportsTemperature(modelName || '');
                if (supportsTemp && /^(gpt-5|o1)/i.test(deploymentName)) {
                    supportsTemp = false;
                }
                if (supportsTemp) {
                    // @ts-ignore
                    const t = (cfg.config.temperature ?? defaultTemp);
                    formData.append('llm_temperture', String(t));
                }
            } else if (cfg.provider === 'AWSBedrock') {
                formData.append('llm_provider', 'AWS Bedrock');
                // @ts-ignore
                formData.append('llm_key', cfg.config.accessKeyId || '');
                // @ts-ignore
                formData.append('llm_secret_key', cfg.config.secretAccessKey || '');
                // @ts-ignore
                formData.append('llm_region', cfg.config.region || '');
                // @ts-ignore
                if (cfg.config.model) formData.append('llm_model_id', cfg.config.model);
                // @ts-ignore
                const modelName = cfg.config.model;
                const supportsTemp = modelSupportsTemperature(modelName || '');
                if (supportsTemp) {
                    // @ts-ignore
                    const t = (cfg.config.temperature ?? defaultTemp);
                    formData.append('llm_temperture', String(t));
                }
            }
        }

        if (zipContent) {
            const entries = Object.keys(zipContent);
            if (entries.length) {
                for (const name of entries) {
                    zipContent[name].status = "processing";
                }
                zipContent = { ...zipContent };
            }
        }

        function joinUrl(base: string, path: string) {
            return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
        }

    const zipPaths = ["/input-zip-download", "/api/code-insights/input-zip-download"];
        let response: Response | null = null;
        let aborted = false;

        try {
            for (const p of zipPaths) {
                try {
                    const r = await fetch(joinUrl(url_base, p), {
                        method: "POST",
                        signal,
                        headers: {
                            "Authorization": "Bearer " + (user.token ?? '')
                        },
                        body: formData,
                    });
                    if (r.ok) {
                        response = r;
                        break;
                    }
                    if (r.status === 404) {
                        continue;
                    }
                    console.log(`Zip request failed for ${p}: ${r.status} ${r.statusText}`);
                } catch (error) {
                    if ((error as DOMException)?.name === "AbortError") {
                        console.log("Zip request aborted");
                        aborted = true;
                        break;
                    }
                    console.log(`Error calling ${p}:`, error);
                }
            }

            if (!response || !response.ok) {
                if (!aborted) {
                    console.log("Unable to download zip: no valid endpoint responded OK.");
                    toasts.push({ message: "Unable to process files. Please check access key and try again.", color: "danger" });
                }
                return;
            }

            const arrayBuffer = await response.arrayBuffer();
            const outputZip = await JSZip.loadAsync(arrayBuffer);

            const updatedContent = { ...zipContent } as typeof zipContent;
            const outputFiles: string[] = [];

            outputZip.forEach((relativePath, file) => {
                if (!file.dir) {
                    outputFiles.push(relativePath);
                }
            });

            for (const name of outputFiles) {
                const file = outputZip.file(name);
                if (!file) continue;
                const content = await file.async('string');
                let key = name;
                if (!updatedContent[key]) {
                    const normalized = name.replace(/_remediated(\.[^/.]+)$/i, '$1');
                    if (updatedContent[normalized]) {
                        key = normalized;
                    } else {
                        updatedContent[key] = {
                            inputContent: undefined,
                            outputContent: undefined,
                            selected: false,
                            status: "incomplete",
                        };
                    }
                }
                if (!updatedContent[key].inputContent && inputZip && inputZip.files[key]) {
                    try {
                        updatedContent[key].inputContent = await inputZip.files[key].async('string');
                    } catch (err) {
                        console.log(`Failed to hydrate input content for ${key}:`, err);
                    }
                }
                updatedContent[key].outputContent = content;
                updatedContent[key].status = "complete";
            }

            for (const name of Object.keys(updatedContent)) {
                if (!updatedContent[name].outputContent) {
                    updatedContent[name].status = "incomplete";
                }
            }

            zipContent = { ...updatedContent };

            const firstComplete = Object.keys(zipContent).find((key) => zipContent[key].outputContent);
            if (firstComplete && (watch_process || !selectedFileName || !zipContent[selectedFileName]?.outputContent)) {
                selectedFileName = firstComplete;
            }
        } catch (error) {
            if ((error as DOMException)?.name === "AbortError") {
                console.log("Zip processing aborted");
                aborted = true;
                toasts.push({ message: "Processing aborted.", color: "warning" });
            } else {
                console.log("Zip processing error:", error);
                toasts.push({ message: `An error occurred: ${error}`, color: "danger" });
            }
        } finally {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            if (aborted) {
                time_taken = null;
            } else {
                const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
                time_taken = elapsedSeconds;
            }
            processing = false;
        }
    }

    function triggerProcessing() {
        processFiles(zipFileInput ? zipFileInput[0] : undefined, reportFileInput ? reportFileInput[0] : undefined);
    }
    
    //doenload output zip file
    async function download() {
        if (!user || !zipContent) {
            console.log("User not logged in or no zip content");
            toasts.push({ message: "Nothing to download.", color: "info" });
            return;
        }
        // Collect selected files
        let files = Object.keys(zipContent)
        let outputZipSelected = new JSZip();
        for (let fileName of files) {
            let filestring = "";
            if (zipContent[fileName].selected) {
                filestring = zipContent[fileName].outputContent as string;
                fileName = fileName.replace('.sql', '_remediated.sql');
            } else {
                filestring = zipContent[fileName].inputContent as string;
                fileName = fileName.replace('.sql', '_original.sql');
            }
            outputZipSelected.file(fileName, filestring);
        }

        let outputBlob = await outputZipSelected.generateAsync({type:"blob"});
        let url = URL.createObjectURL(outputBlob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'output.zip';
        a.click();
        a.remove();
    }

    async function cancel() {
        if (!user) {
            console.log("User not logged in");
            return;
        }
        controller.abort();
        controller = new AbortController();
        processing = false;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        time_taken = null;
    }

    async function onChangeZipFileInput() {
        try {
            if (!zipFileInput) {
                return;
            }
            const fileList = zipFileInput;
            let zipFile = fileList[0];
            if (!zipFile || !zipFile.name.endsWith('.zip')) {
                toasts.push({ message: 'Invalid file type. Please select a .zip file.', color: 'danger' });
                zipFileInput = null;
                return;
            }
            inputZip = new JSZip();
            await inputZip.loadAsync(zipFile);
            zipContent = {};
            let inputFiles = inputZip.files;
            for (let inputFileName in inputFiles) {
                // Skip directory entries
                if (inputFiles[inputFileName].dir) continue;
                let inputContent = await inputFiles[inputFileName].async('string');
                zipContent[inputFileName] = {
                    inputContent: inputContent,
                    outputContent: undefined,
                    selected: false,
                    status: "incomplete",
                };
            }
            // Default selection: first file
            const names = Object.keys(zipContent);
            if (names.length) {
                selectedFileName = names[0];
            } else {
                selectedFileName = '';
            }
            zipContent = { ...zipContent };
            input_tokens = undefined;
            output_tokens = undefined;
            price = undefined;
        } catch (error) {
            console.error("Error loading zip file:", error);
            toasts.push({ message: "Failed to load zip file.", color: "danger" });
        }
    }

    async function onChangeReportFileInput() {
        try {
            if (!reportFileInput) {
                return;
            }
            let reportFile = reportFileInput[0];
            if (!reportFile || !reportFile.name.endsWith('.txt')) {
                toasts.push({ message: 'Invalid file type. Please select a .txt file.', color: 'danger' });
                reportFileInput = null;
                return;
            }
            let reader = new FileReader();
            reader.onload = function(e) {
                try {
                    let reportText = reader.result as string;
                    // Parse report to table
                    if (!reportText) {
                        toasts.push({ message: 'Report file is empty.', color: 'warning' });
                        return;
                    }
                    let lines = reportText.split('\n');
                    if (lines.length < 2) {
                        toasts.push({ message: 'Report file format invalid (too short).', color: 'danger' });
                        return;
                    }
                    let columnLengths = lines[1].split(' ').map(x => x.length+1);
                    console.log(lines);
                    console.log(columnLengths);
                    for (let i = 0; i < columnLengths.length; i++) {
                        if (i == 1) {
                            continue;
                        }
                        let row = [];
                        let line = lines[i]
                        for (let j = 0; j < columnLengths.length; j++) {
                            // Check if line is long enough
                            if (!line) { 
                                row.push('');
                                continue; 
                            }
                            row.push(line.substring(0, columnLengths[j]));
                            line = line.substring(columnLengths[j]);
                        }
                        if (!reportContent) {
                            reportContent = [];
                        }
                        reportContent.push(row);
                    }
                    console.log(reportContent);
                } catch (err) {
                    console.error("Error parsing report:", err);
                    toasts.push({ message: "Failed to parse report file.", color: "danger" });
                }
            }
            reader.readAsText(reportFile);
        } catch (error) {
            console.error("Error reading report file:", error);
            toasts.push({ message: "Failed to read report file.", color: "danger" });
        }
    }

    // Initialize selected file name
    if (selectedFileName === undefined) selectedFileName = '';

    $: if(zipFileInput){
        onChangeZipFileInput();
    }
    $: if(reportFileInput){
        onChangeReportFileInput();
    }
</script>

{#if user === null}
    <Container fluid class="d-flex justify-content-center align-items-center" style="height: 80vh;">
        <div class="text-center">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h4 class="mt-3">Loading user data...</h4>
        </div>
    </Container>
{:else}
    {#if processing && time_taken !== null}
        <Toastwrapper open={true} width="200px">
            <div class="d-flex justify-content-between align-items-center" slot="body">
                <div class="ms-1 spinner-border text-primary">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4 class="m-0">{time_taken}s</h4>
            </div>
        </Toastwrapper>
    {/if}
<Container fluid class="insights-container">
    <div class="insights-layout" class:resizing={isResizing}>
        <div class="panel-group">
            <div class="insights-panel" style={`width: ${leftPanelWidth}px;`}>
                <div class="insights-panel-content">
                    <FormGroup>
                        <div class="mb-3">
                            <span>Upload a zip file:</span>
                            <span class="text-danger">*</span>
                            <div class="input-group">
                                <input class="form-control" type="file" bind:files={zipFileInput}/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <span>Upload a report file:</span><span class="text-danger"> *</span>
                            <div class="input-group">
                                <input class="form-control" type="file" bind:files={reportFileInput}/>
                            </div>
                        </div>
                        
                        <h6 class="mb-2">LLM Configuration</h6>
                        <LlmConfigSelector />
                        
                        <div class="mt-3 mb-3">
                            <span>Access Key:</span>
                            <div class="input-group">
                                <input class="form-control" type="password" bind:value={accessKey} placeholder="Enter access key" />
                            </div>
                        </div>

                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <label for="sql_language" class="me-2 mb-0">SQL Language:</label>
                            <Dropdown direction="down">
                                <DropdownToggle caret class="btn btn-styled btn-styled-primary">
                                    {sql_language}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem on:click={() => sql_language = 'MS SQL Server'}>MS SQL Server</DropdownItem>
                                    <DropdownItem on:click={() => sql_language = 'Oracle'}>Oracle</DropdownItem>
                                    <DropdownItem on:click={() => sql_language = 'PostgreSQL'}>PostgreSQL</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div class="d-flex align-items-center gap-2 mb-2">
                            <button class="btn btn-styled btn-styled-primary flex-grow-1 py-2" on:click={triggerProcessing}>Process Files</button>
                            {#if processing}
                                <button class="btn btn-styled btn-styled-danger py-2" on:click={cancel}>Cancel</button>
                            {/if}
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" id="watch_process" type="checkbox" bind:checked={watch_process} />
                            <label class="form-check-label" for="watch_process">Watch Process</label>
                        </div>
                    </FormGroup>
                    {#if input_tokens || output_tokens || price || time_taken}
                        <div class="mt-3">
                            {#if input_tokens}
                                <div>Input Tokens: {input_tokens}</div>
                            {/if}
                            {#if output_tokens}
                                <div>Output Tokens: {output_tokens}</div>
                            {/if}
                            {#if price}
                                <div>Estimated Price: {price} USD</div>
                            {/if}
                            {#if time_taken}
                                <div>Time taken: {time_taken} seconds</div>
                            {/if}
                        </div>
                        <hr>
                    {/if}
                    
                    {#if zipContent || reportContent}
                        <hr>
                        <div>
                            <div class="col">
                                <span>Approve/View a File:</span>
                            </div>
                            <div class="file-select-container">
                                {#if reportContent}
                                    <div class='file-select px-2' title="Report">
                                        <button type="button" class="btn btn-link p-0" on:click={() => selectedFileName = 'Report'} aria-label="Select file">
                                            Report
                                        </button>
                                    </div>
                                {/if}
                                {#if zipContent}
                                    {#each Object.keys(zipContent) as fileName}
                                        <div class='file-select px-2 d-inline-flex {selectedFileName === fileName ? "active" : ""}' title="{fileName}">
                                            <input type="checkbox" bind:checked={zipContent[fileName].selected} />
                                            <button type="button" class="btn btn-link p-0 ms-1" style="overflow: hidden;" on:click={() => selectedFileName = fileName} aria-label="Select file">
                                                {`${fileName.substring(0, 35)}...`}
                                            </button>
                                            {#if zipContent[fileName].status == "incomplete"}
                                                <span style="color: red;"><Icon name="x-lg"/></span>
                                            {:else if zipContent[fileName].status == "processing"}
                                                <div class="ms-1 spinner-border spinner-border-sm text-primary">
                                                    <span class="visually-hidden">Loading...</span>
                                                </div>
                                            {:else if zipContent[fileName].status == "complete"}
                                                <span style="color: green;"><Icon name="check-lg"/></span>
                                            {/if}
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                        <hr>
                        <FormGroup>
                            <Button 
                                class="btn-styled btn-styled-primary w-100 py-2"
                                on:click={download} 
                                disabled={!Object.values(zipContent || {}).some(f => f.status === 'complete')}
                            >
                            Approve and Download
                            </Button>
                        </FormGroup>
                    {/if}
                    <hr>
                    <Row>
                        <span>Legend:</span>
                        <span><span style="color:{removedColor};"><Icon name="square-fill"/></span> - Removed</span>
                        <span><span style="color:{addedColor};"><Icon name="square-fill"/></span> - Added</span>
                        <span><span style="color:{replacedColor};"><Icon name="square-fill"/></span> - Replaced</span>
                        <span><span style="color:{emptyColor};"><Icon name="square-fill"/></span> - Empty</span>
                        <span><span style="color:{backgroundColor};"><Icon name="square-fill"/></span> - Background</span>
                    </Row>
                </div>
            </div>
             <div class="resize-handle" on:mousedown={startResize} title="Drag to resize">
                <Icon name="grip-vertical" />
            </div>
        </div>
        <div class="insights-main">
            <div class="header-section">
                <h2><Icon name={codeInsightsLogo} /> Code Insights</h2>
                <p class="text-muted">Analyze and remediate code using AI.</p>
            </div>
            <hr class="my-4"/>
            {#if selectedFileName == ''}
                <div class="text-center mt-4">
                    <h3>Select a file to view</h3>
                </div>
            {:else if selectedFileName == 'Report' && reportContent}
                <div class="text-center">
                    <h1>Report</h1>
                    <div style="overflow-x:auto;">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    {#each reportContent[0] as header}
                                        <th>{header}</th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody>
                                {#each reportContent.slice(1) as row}
                                    <tr>
                                        {#each row as cell}
                                            <td>{cell}</td>
                                        {/each}
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {:else if selectedFileName && zipContent && zipContent[selectedFileName]}
                <Row class="mx-2">
                    <Col>
                        <h5 class="text-muted text-center mb-2">Input Code</h5>
                        <textarea 
                            bind:value={zipContent[selectedFileName].inputContent} 
                            rows="25" 
                            style="width: 100%; border-color: #dee2e6; border-radius: 6px; padding: 10px; font-family: monospace; resize: vertical;"
                            readonly
                        ></textarea>
                    </Col>
                    <Col>
                        <h5 class="text-muted text-center mb-2">Output Code</h5>
                        <textarea 
                            bind:value={zipContent[selectedFileName].outputContent} 
                            rows="25" 
                            style="width: 100%; border-color: #dee2e6; border-radius: 6px; padding: 10px; font-family: monospace; resize: vertical;" 
                            placeholder="Output will appear here..." 
                            readonly
                        ></textarea>
                    </Col>
                </Row>
            {:else}
                <div></div>            {/if}
        </div>
    </div>
</Container>
{/if}

<style>
    .insights-layout {
        display: flex;
        align-items: flex-start;
        gap: 0;
        margin-top: 0;
        min-height: calc(100vh - var(--ci-navbar-height, 0px));
        padding: 0;
    }

    :global(.insights-container) {
        padding-top: 0;
    }

    .insights-panel {
        min-width: 240px;
        max-width: 520px;
        border: 1px solid #cfd4da;
        border-radius: 8px;
        background-color: #ffffff;
        height: auto;
        overflow: hidden;
    }

    .insights-panel-content {
        padding: 20px 12px 16px;
        max-height: calc(100vh - var(--ci-navbar-height, 0px) - 28px);
        overflow: auto;
    }

    .panel-group {
        display: flex;
        align-items: stretch;
        height: fit-content;
        position: sticky;
        top: calc(var(--ci-navbar-height, 0px) + 20px);
        align-self: flex-start;
    }

    :global(body.code-insights-page .navbar) {
        position: sticky;
        top: 0;
        z-index: 1030;
    }

    .insights-main {
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

    .insights-layout.resizing {
        user-select: none;
    }

    .header-section {
        text-align: center;
        margin: 22px 0 10px;
    }

    .header-section h2 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }

    .active {
        background-color: lightgrey;
    }
    .file-select {
        cursor: pointer;
    }
    .file-select:hover {
        background-color: lightgrey;
    }
    .file-select-container {
        overflow-y: scroll;
        max-height: 300px;
        border: 1px solid lightgrey;
        border-radius: 5px;
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
        background: linear-gradient(135deg, #388bff 0%, #0d6efd 100%); /* Slightly lighter on hover */
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(13, 110, 253, 0.3);
        color: white;
    }
    
    :global(.btn-styled-primary:active:not(:disabled)) {
        transform: translateY(1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>