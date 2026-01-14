<script lang="ts">
    import { Container, Col, Row, Button, FormGroup, Input, Progress, Form, Icon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Image } from "@sveltestrap/sveltestrap";
    import Linecompare from "../apps/codeConversion/linecompare.svelte";
    import JSZip from "jszip";
	import type { LlmOption } from "$lib/commontypes";
    export let llmSel: LlmOption = 'Mistral Large';

    let availableLanguages: string[] = ['MS SQL Server', 'Oracle', 'PostgreSQL', 'Sybase'];
    let input_sql_language: string = 'Oracle';
    let target_sql_language: string = 'MS SQL Server';

    // Running mode ENV
    const mode = import.meta.env.VITE_MODE;
    //Set URL based on mode
    let url_base = import.meta.env.VITE_PROD_URL;
    if (mode === "dev"){
        url_base = import.meta.env.VITE_DEV_URL;
    }
    let url = url_base + '/api/codeinsights';
    url = 'http://127.0.0.1:8000/api/codeinsights';
    let apiKey = 'my_api_key';

    let removedColor: string = 'lightcoral';
    let addedColor: string = 'lightgreen';
    let replacedColor: string = '#FFFF70';
    let emptyColor: string = 'lightsteelblue';
    let backgroundColor: string = 'white';

    let editMode: boolean = false;
    let processing: boolean = false;
    let progress: number | undefined = undefined;

    let sqlFileInput: FileList;
    let sqlContent: {
        [name: string]: {
            inputContent: string | undefined,
            outputContent: string | undefined, 
            editedContent: string | undefined,
            selected: boolean
        }
    };
    let reportContent: string[][] | undefined;
    let selectedFileName: string;

    let input_tokens: number | undefined;
    let output_tokens: number | undefined;
    let price: string | undefined;

    let controller = new AbortController();

    async function convert() {
        processing = true;
        let response = await fetch(`${url}/single/convert`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'X-API-KEY': `${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'code': sqlContent[selectedFileName].inputContent,
                'debug': false,
                'llm': llmSel,
                'input_language': input_sql_language,
                'target_language': target_sql_language,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })

        input_tokens = response['tokens']['input'];
        output_tokens = response['tokens']['output'];
        price = ((input_tokens as number * 0.004)/1000  + (output_tokens as number * 0.012)/1000).toFixed(4);

        sqlContent[selectedFileName] = {
            inputContent: sqlContent[selectedFileName].inputContent,
            outputContent: response['code'],
            editedContent: response['code'],
            selected: true
        }
        processing = false;
    }

    function getSelectionText() {
        var text = "";
        if (window) {
            let selection = window.getSelection();
            if (selection) {
                text = selection.toString();
            } else {
                throw new Error('No selection object');
            }
        } else {
            throw new Error('No window object');
        }
        console.log(text);
        return text;
    }

    async function convertSelected() {
        let text = getSelectionText();

        let code = sqlContent[selectedFileName].inputContent;
        if (sqlContent[selectedFileName].outputContent && sqlContent[selectedFileName].outputContent !== '') {
            code = sqlContent[selectedFileName].outputContent;
        }
        if (!code) {
            throw new Error('No code to convert');
        }
        let start = code.indexOf(text);
        let end = start + text.length;

        if (text) {
            processing = true;
            let response = await fetch(`${url}/single/convert`, {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'X-API-KEY': `${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'code': text,
                    'debug': false,
                    'llm': llmSel,
                    'input_language': input_sql_language,
                    'target_language': target_sql_language,
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })

            //replace content at start and end of code
            let newCode = code.slice(0, start) + response['code'] + code.slice(end);

            sqlContent[selectedFileName] = {
                inputContent: sqlContent[selectedFileName].inputContent,
                outputContent: newCode,
                editedContent: response['code'],
                selected: true
            }
            processing = false;
        }
    }

    async function download() {
        //Create sql file from sqlContent[selectedFileName].outputContent
        if (!sqlContent[selectedFileName].outputContent) {
            throw new Error('No output content to download');
        }
        let file = new File([sqlContent[selectedFileName].outputContent as string], 'output.sql', {type: 'text/plain'});
        let url = URL.createObjectURL(file);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'output.sql';
        a.click();
        a.remove();
    }

    async function cancel() {
        controller.abort();
        controller = new AbortController();
        progress = undefined;
        processing = false;
    }

    async function onChangeSqlFileInput() {
        if (!sqlFileInput) {
            throw new Error('No zip file selected');
        }
        let sqlFile = sqlFileInput[0];
        if (!sqlFile || !sqlFile.name.endsWith('.sql')) {
            throw new Error('Invalid file type for sql file');
        }
        if (!sqlContent) {
            sqlContent = {};
        }
        sqlContent[sqlFile.name] = {
            inputContent: await (sqlFile.text()),
            outputContent: undefined,
            editedContent: undefined,
            selected: false
        };

        input_tokens = undefined;
        let response = await fetch(`${url}/single/getTokens`, {
            method: 'POST',
            headers: {
                'X-API-KEY': `${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'code': sqlContent[sqlFile.name].inputContent,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        input_tokens = response['num_tokens'];
        output_tokens = response['num_tokens'];
        price = ((input_tokens as number * 0.004)/1000  + (output_tokens as number * 0.012)/1000).toFixed(4);
    }

    $: if(sqlFileInput){
        onChangeSqlFileInput();
    }
</script>

<Container fluid>
    <Row>
        <Col xs="2">
            <br>
            <Row>
                <FormGroup>
                    <span>Upload a Sql file:</span>
                    <div class="input-group">
                        <input class="form-control" type="file" bind:files={sqlFileInput}/>
                    </div>
                    <br>
                    <label for="input_sql_language">Select Initial SQL Language:</label>
                    <Dropdown direction="down">
                        <DropdownToggle caret style="background-color:white; color: black;">
                            {input_sql_language}
                        </DropdownToggle>
                        <DropdownMenu>
                            {#each availableLanguages as language}
                                <DropdownItem on:click={() => input_sql_language = language}>{language}</DropdownItem>
                            {/each}
                        </DropdownMenu>
                    </Dropdown>
                    <label for="target_sql_language">Select Target SQL Language:</label>
                    <Dropdown direction="down">
                        <DropdownToggle caret style="background-color:white; color: black;">
                            {target_sql_language}
                        </DropdownToggle>
                        <DropdownMenu>
                            {#each availableLanguages as language}
                                <DropdownItem on:click={() => target_sql_language = language}>{language}</DropdownItem>
                            {/each}
                        </DropdownMenu>
                    </Dropdown>
                    <br>
                    {#if input_tokens}
                        <div>Estimated Input Tokens: {input_tokens}</div>
                    {/if}
                    {#if output_tokens}
                        <div>Estimated Output Tokens: {output_tokens}</div>
                    {/if}
                    {#if price}
                        <div>Estimated Price: {price} USD</div>
                    {/if}
                    {#if !processing}
                        <button class="btn btn-secondary" on:click={convert}>Convert All</button>
                        <button class="btn btn-secondary" on:click={convertSelected}>Convert Highlighted</button>
                    {:else}
                        <button class="btn btn-secondary" on:click={cancel}>Cancel</button>
                    {/if}
                    {#if sqlContent && sqlContent[selectedFileName] && sqlContent[selectedFileName].outputContent}
                        <button class="btn btn-secondary" on:click={download}>Download</button>
                    {/if}
                </FormGroup>
            </Row>
            {#if progress}
                <Progress value={progress}>{progress}%</Progress>
            {/if}
            {#if sqlContent}
                <hr>
                <Row>
                    <div>
                        <div class="col">
                            <span>View File:</span>
                        </div>
                        <div class="file-select-container">
                            {#if reportContent}
                                <div class='file-select px-2' title="Report">
                                    <span on:click={() => selectedFileName = 'Report'} aria-label="Select file" role="button">
                                        Report
                                    </span>
                                </div>
                            {/if}
                            {#if sqlContent}
                                {#each Object.keys(sqlContent) as fileName}
                                    <div class='file-select px-2 d-flex {selectedFileName === fileName ? "active" : ""}' title="{fileName}">
                                        <input type="checkbox" bind:checked={sqlContent[fileName].selected} />
                                        <span class="ms-1" style="overflow-x: hidden;" on:click={() => selectedFileName = fileName} aria-label="Select file" role="button">
                                            {fileName}
                                        </span>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </div>
                </Row>
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


            <hr>
            <button class="btn btn-secondary" on:click={()=>{editMode=!editMode}}>{editMode ? 'Finish Edit' : 'Edit'}</button>
        </Col>
        <Col xs="10">
            {#if selectedFileName == ''}
                <div class="text-center">
                    <h1>Select a file to view</h1>
                </div>
            {:else if selectedFileName
                && sqlContent
                && sqlContent[selectedFileName] 
                && sqlContent[selectedFileName].inputContent 
                && sqlContent[selectedFileName].outputContent 
                && sqlContent[selectedFileName].editedContent
            }
                <Linecompare 
                    oldText={sqlContent[selectedFileName].inputContent}
                    bind:newText={sqlContent[selectedFileName].outputContent}
                    removedColor={removedColor}
                    addedColor={addedColor}
                    replacedColor={replacedColor}
                    emptyColor={emptyColor}
                    backgroundColor={backgroundColor}
                />
            {:else if sqlContent && sqlContent[selectedFileName] && sqlContent[selectedFileName].inputContent}
                <div class="">
                    <h1 class="text-center">{selectedFileName}</h1>
                    <div style="overflow-x:auto;" class="ms-5">
                        <pre>{sqlContent[selectedFileName].inputContent}</pre>
                    </div>
                </div>
            {:else}
                <div></div>
            {/if}

        </Col>
    </Row>

</Container>


<style>
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
        overflow-y: auto;
        max-height: 300px;
        border: 1px solid lightgrey;
        border-radius: 5px;
    }
    footer {
        height: 50px;
    }
</style>