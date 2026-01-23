<script lang="ts">
    import { TESTING_ENDPOINTS, type TestEndpoint } from '$lib/data/testingEndpoints';
    import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Row, Input, Label, FormGroup, Icon, Spinner } from '@sveltestrap/sveltestrap';
    import { userStore } from '../../../lib/stores/userStore';
    import runtimeConfig from '$lib/runtime-config';
    import { get } from 'svelte/store';

    let selectedEndpoint: TestEndpoint | null = null;
    let response: any = null;
    let loading = false;
    let errorMessage = '';

    // Subscribe to user token
    let token = '';
    $: token = $userStore?.token || '';
    
    // Batch Testing State
    let batchResults: Record<string, 'pass' | 'fail' | 'running' | 'pending'> = {};
    let batchLoading = false;
    let selectedTests: Set<string> = new Set(TESTING_ENDPOINTS.filter(ep => ep.critical).map(ep => ep.id));
    
    // Default values for edition
    let editUrl = '';
    let editMethod: string = 'GET';
    let editBody = '';
    let editBodyType: 'json' | 'form-data' = 'json';
    let editHeaders = '';
    let editFormFields: Record<string, string> = {};
    let formFiles: Record<string, FileList> = {};

    function toggleTestSelection(id: string, event: Event) {
        event.stopPropagation();
        if (selectedTests.has(id)) {
            selectedTests.delete(id);
        } else {
            selectedTests.add(id);
        }
        selectedTests = new Set(selectedTests); // force reactivity
    }

    function toggleAllTests(event: Event) {
        if ((event.target as HTMLInputElement).checked) {
            TESTING_ENDPOINTS.forEach(ep => selectedTests.add(ep.id));
        } else {
            selectedTests.clear();
        }
        selectedTests = new Set(selectedTests);
    }

    function prepareRequest(ep: TestEndpoint) {
        let url = ep.url;
        let headers = ep.headers ? JSON.stringify(ep.headers) : '';
        let body = ep.body ? JSON.stringify(ep.body) : '';

        // Replace placeholders
        
        // URL replacements
        url = url.replace('{{API_BASE_URL}}', runtimeConfig.API_BASE_URL || '');
        url = url.replace('{{DOC_INSIGHTS_URL}}', runtimeConfig.DOC_INSIGHTS_URL || '');
        url = url.replace('{{CODE_INSIGHTS_URL}}', runtimeConfig.CODE_INSIGHTS_URL || '');
        url = url.replace('{{CODE_REVIEW_URL}}', runtimeConfig.CODE_REVIEW_URL || '');
        url = url.replace('{{AI_AGENTIC_URL}}', runtimeConfig.AI_AGENTIC_URL || '');
        url = url.replace('{{CODE_CONVERSION_URL}}', runtimeConfig.CODE_CONVERSION_URL || '');
        
        // Header replacements
        if (headers) {
             if (headers.includes('{{TOKEN}}') && !token) {
                 console.warn("Token placeholder found but no user token available.");
             }
            headers = headers.replace('{{TOKEN}}', token);
        }

        return { url, method: ep.method, headers, body };
    }

    function selectEndpoint(ep: TestEndpoint) {
        selectedEndpoint = ep;
        response = null;
        errorMessage = '';
        
        const req = prepareRequest(ep); // Use helper to get initial autofill values
        
        editUrl = req.url;
        editMethod = req.method;
        editBody = ep.body ? JSON.stringify(ep.body, null, 2) : ''; // Keep pretty print for editor
        editHeaders = req.headers; // Use prepared headers
        editBodyType = ep.bodyType || 'json';
        
        editFormFields = {};
        formFiles = {};
        if (ep.formFields) {
            ep.formFields.forEach(f => {
                editFormFields[f.name] = f.defaultValue || '';
            });
        }
    }

    async function runTest() {
        if (!selectedEndpoint) return;
        loading = true;
        batchResults[selectedEndpoint.id] = 'running';
        batchResults = { ...batchResults };

        response = null;
        errorMessage = '';
        
        try {
            const headers = editHeaders ? JSON.parse(editHeaders) : {};
            const options: RequestInit = {
                method: editMethod,
                headers: {
                    ...headers
                }
            };
            
            if (editMethod !== 'GET' && editMethod !== 'HEAD') {
                if (editBodyType === 'form-data') {
                    const formData = new FormData();
                    
                    // Append text fields
                    Object.entries(editFormFields).forEach(([key, value]) => {
                        formData.append(key, value);
                    });
                    
                    // Append files
                    Object.entries(formFiles).forEach(([key, fileList]) => {
                        if (fileList && fileList.length > 0) {
                            formData.append(key, fileList[0]);
                        }
                    });
                    
                    options.body = formData;
                    // Note: Do NOT set Content-Type for multipart/form-data, browser does it
                    
                } else {
                     // Default JSON
                    options.headers = {
                        'Content-Type': 'application/json',
                        ...headers
                    };
                    if (editBody) options.body = editBody;
                }
            }

            const res = await fetch(editUrl, options);
            
            if (res.ok) {
                if (selectedEndpoint) batchResults[selectedEndpoint.id] = 'pass';
            } else {
                if (selectedEndpoint) batchResults[selectedEndpoint.id] = 'fail';
            }
            batchResults = { ...batchResults };
            
            // Try to parse JSON, fall back to text if it fails
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = await res.text();
            }
            
            response = {
                status: res.status,
                statusText: res.statusText,
                headers: {}, 
                data: data
            };

             res.headers.forEach((val, key) => {
                 response.headers[key] = val;
             });

        } catch (e: any) {
            errorMessage = e.message;
            if (selectedEndpoint) {
                batchResults[selectedEndpoint.id] = 'fail';
                batchResults = { ...batchResults };
            }
        } finally {
            loading = false;
        }
    }

    async function runBatchTests() {
        if (batchLoading) return;
        
        const testsToRun = TESTING_ENDPOINTS.filter(ep => selectedTests.has(ep.id));
        if (testsToRun.length === 0) return;

        batchLoading = true;
        batchResults = {};
        
        // Initialize status
        testsToRun.forEach(ep => {
            batchResults[ep.id] = 'pending';
        });
        
        for (const ep of testsToRun) {
            batchResults[ep.id] = 'running';
            // Force UI update
            batchResults = { ...batchResults };
            
            try {
                const req = prepareRequest(ep);
                const headers = req.headers ? JSON.parse(req.headers) : {};
                
                const options: RequestInit = {
                    method: req.method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    }
                };
                
                if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
                    options.body = req.body;
                }
                
                // Handle form-data if defined for batch too (simple text fields only for now, as files can't be auto-filled easily without user input per test)
                // For critical batch tests, we assume params are sufficient or pre-filled.
                // If a test requires file upload, it might fail in batch unless default file is handled (which logic is limited).
                // Existing logic for endpoints with bodies seems to rely on prepareRequest using default values.

                const res = await fetch(req.url, options);
                
                if (res.ok) {
                    batchResults[ep.id] = 'pass';
                } else {
                    batchResults[ep.id] = 'fail';
                }
            } catch (e) {
                console.error(e);
                batchResults[ep.id] = 'fail';
            }
             // Force UI update
             batchResults = { ...batchResults };
        }
        
        batchLoading = false;
    }
    
    // Group endpoints by App
    $: endpointsByApp = TESTING_ENDPOINTS.reduce((acc, ep) => {
        if (!acc[ep.app]) acc[ep.app] = [];
        acc[ep.app].push(ep);
        return acc;
    }, {} as Record<string, TestEndpoint[]>);
</script>

<Container fluid class="p-4">
    <Row>
        <Col md="4">
            <Card class="mb-3">
                <CardHeader class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <input 
                            type="checkbox" 
                            class="form-check-input me-2" 
                            on:change={toggleAllTests}
                            checked={TESTING_ENDPOINTS.length > 0 && selectedTests.size === TESTING_ENDPOINTS.length}
                            title="Select All"
                        />
                        <CardTitle class="mb-0">Available Endpoints</CardTitle>
                    </div>
                    <Button color="success" size="sm" on:click={runBatchTests} disabled={batchLoading || selectedTests.size === 0}>
                        {#if batchLoading}
                            <Spinner size="sm" class="me-1" /> Running...
                        {:else}
                            Run Batch Tests ({selectedTests.size})
                        {/if}
                    </Button>
                </CardHeader>
                <div class="list-group list-group-flush" style="max-height: 80vh; overflow-y: auto;">
                    {#each Object.entries(endpointsByApp) as [appName, endpoints]}
                        <div class="list-group-item bg-light fw-bold">{appName}</div>
                        {#each endpoints as ep}
                            <div 
                                class="list-group-item list-group-item-action d-flex align-items-center {selectedEndpoint?.id === ep.id ? 'active' : ''}"
                                role="button"
                                tabindex="0"
                                on:click={() => selectEndpoint(ep)}
                                on:keydown={(e) => e.key === 'Enter' && selectEndpoint(ep)}
                            >
                                <div class="me-3" on:click|stopPropagation={ () => {} } on:keydown|stopPropagation={ () => {} } role="none">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input"
                                        checked={selectedTests.has(ep.id)} 
                                        on:change={(e) => toggleTestSelection(ep.id, e)}
                                    />
                                </div>
                                <div class="flex-grow-1 overflow-hidden">
                                    <div class="d-flex w-100 justify-content-between align-items-center">
                                        <div class="d-flex align-items-center text-truncate">
                                            {#if batchResults[ep.id] === 'pass'}
                                                <Icon name="check-circle-fill" class="text-success me-2" />
                                            {:else if batchResults[ep.id] === 'fail'}
                                                <Icon name="x-circle-fill" class="text-danger me-2" />
                                            {:else if batchResults[ep.id] === 'running'}
                                                <Spinner size="sm" color="warning" class="me-2" />
                                            {/if}
                                            <h6 class="mb-1 text-truncate" title={ep.name}>{ep.name}</h6>
                                        </div>
                                        <small class="ms-2 text-nowrap">{ep.method}</small>
                                    </div>
                                    <small class="text-truncate d-block" title={ep.url}>{ep.url}</small>
                                </div>
                            </div>
                        {/each}
                    {/each}
                </div>
            </Card>
        </Col>
        
        <Col md="8">
            {#if selectedEndpoint}
                <Card class="mb-3">
                    <CardHeader>
                        <CardTitle>Test: {selectedEndpoint.name}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <p class="text-muted">{selectedEndpoint.description}</p>
                        
                        <Row>
                            <Col md="2">
                                <FormGroup>
                                    <Label>Method</Label>
                                    <Input type="select" bind:value={editMethod}>
                                        <option>GET</option>
                                        <option>POST</option>
                                        <option>PUT</option>
                                        <option>DELETE</option>
                                        <option>PATCH</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="10">
                                <FormGroup>
                                    <Label>URL</Label>
                                    <Input type="text" bind:value={editUrl} />
                                </FormGroup>
                            </Col>
                        </Row>
                        
                        <FormGroup>
                            <Label>Headers (JSON)</Label>
                            <Input type="textarea" rows="3" bind:value={editHeaders} placeholder={`{"Authorization": "Bearer token"}`} />
                        </FormGroup>
                        
                        {#if editBodyType === 'form-data'}
                            <div class="border p-3 rounded mb-3">
                                <h6>Multipart Form Data</h6>
                                {#if selectedEndpoint.formFields}
                                    {#each selectedEndpoint.formFields as field}
                                        <FormGroup>
                                            <Label>{field.name}{field.required ? ' *' : ''}</Label>
                                            {#if field.type === 'file'}
                                                <Input type="file" on:change={(e) => formFiles[field.name] = e.target.files} />
                                            {:else}
                                                <Input type="text" bind:value={editFormFields[field.name]} placeholder={field.defaultValue} />
                                            {/if}
                                        </FormGroup>
                                    {/each}
                                {:else}
                                    <p class="text-muted">No form fields defined.</p>
                                {/if}
                            </div>
                        {:else}
                            <FormGroup>
                                <Label>Body (JSON)</Label>
                                <Input type="textarea" rows="5" bind:value={editBody} placeholder={`{"key": "value"}`} disabled={editMethod === 'GET'} />
                            </FormGroup>
                        {/if}
                        
                        <div class="mt-3">
                            <Button color="primary" on:click={runTest} disabled={loading}>
                                {#if loading}
                                    <Spinner size="sm" class="me-1" /> Running...
                                {:else}
                                    Run Request
                                {/if}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
                
                {#if response || errorMessage}
                    <Card>
                        <CardHeader>Response</CardHeader>
                        <CardBody>
                            {#if errorMessage}
                                <div class="alert alert-danger">{errorMessage}</div>
                            {/if}
                            
                            {#if response}
                                <div class="mb-2">
                                    <strong>Status:</strong> 
                                    <span class={response.status >= 200 && response.status < 300 ? 'text-success' : 'text-danger'}>
                                        {response.status} {response.statusText}
                                    </span>
                                </div>
                                
                                <h6>Response Body:</h6>
                                <pre class="bg-light p-3 border rounded" style="max-height: 400px; overflow: auto;">{JSON.stringify(response.data, null, 2)}</pre>
                            {/if}
                        </CardBody>
                    </Card>
                {/if}
            {:else}
                <div class="text-center p-5 text-muted">
                    <h4>Select an endpoint to test</h4>
                </div>
            {/if}
        </Col>
    </Row>
</Container>
