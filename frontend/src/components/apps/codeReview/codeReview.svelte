<script lang="ts">
    import { Modal, Icon, Input, Button, Spinner, Progress, Card, CardBody, CardTitle, Badge, Table, Collapse } from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';
    import Toastwrapper from '../../common/toastwrapper.svelte';
    import Timer from '../../common/timer.svelte';
    import ToastNotifications from '../../common/ToastNotifications.svelte';
    import { toasts } from '../../../lib/stores/toastStore';
    import { userStore } from '../../../lib/stores/userStore';
	import runtimeConfig from '$lib/runtime-config';

    let user = $userStore;
    let api_base = runtimeConfig.CODE_REVIEW_URL;

    // Review options
    let reviewMode: 'upload' | 'url' = 'url';
    let repoPath = "";
    let repoUrl = "https://github.com/pallets/click.git";
    let branch = "main";
    let maxCommits: number | null = 10;
    let outputFormat: 'json' | 'text' = 'json';

    // Date range filtering
    let sinceDate: string = "";
    let untilDate: string = "";

    // File upload
    let fileInput: HTMLInputElement;
    let selectedFile: File | null = null;
    let guidelinesInput: HTMLInputElement;
    let selectedGuidelinesFile: File | null = null;

    // Results
    let loading = false;
    let progress: number = 0;
    let progressTotal: number = 0;
    let progressCurrent: number = 0;
    let progressStatus: string = "";
    let currentCommit: string = "";
    let myTimer: Timer;
    let reviews: any[] = [];
    let failedCommits: string[] = [];
    let textOutput = "";
    let error = "";

    // Expandable commit details
    let expandedCommits: Set<string> = new Set();

    // Expandable solutions
    let expandedSolutions: Set<string> = new Set();

    function toggleCommit(commitHash: string) {
        if (expandedCommits.has(commitHash)) {
            expandedCommits.delete(commitHash);
        } else {
            expandedCommits.add(commitHash);
        }
        expandedCommits = expandedCommits;
    }

    function toggleSolution(findingId: string) {
        if (expandedSolutions.has(findingId)) {
            expandedSolutions.delete(findingId);
        } else {
            expandedSolutions.add(findingId);
        }
        expandedSolutions = expandedSolutions;
    }

    function getSeverityColor(severity: string): string {
        switch(severity) {
            case 'critical': return 'danger';
            case 'warn': return 'warning';
            case 'nit': return 'info';
            case 'info': return 'secondary';
            default: return 'secondary';
        }
    }

    function getSecuritySeverityColor(severity: string): string {
        switch(severity.toLowerCase()) {
            case 'critical': return 'danger';
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'secondary';
        }
    }

    function getRiskLevelColor(riskLevel: string): string {
        switch(riskLevel.toLowerCase()) {
            case 'critical': return 'danger';
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            case 'none': return 'success';
            default: return 'secondary';
        }
    }

    async function handleReview() {
        loading = true;
        error = "";
        reviews = [];
        failedCommits = [];
        textOutput = "";
        progress = 0;
        progressTotal = 0;
        progressCurrent = 0;
        progressStatus = "Connecting...";
        currentCommit = "";
        myTimer?.start();

        try {
            if (reviewMode === 'upload') {
                // Upload zip file (non-streaming)
                if (!selectedFile) {
                    toasts.push({ message: "Please select a file", color: 'warning' });
                    loading = false;
                    return;
                }

                const formData = new FormData();
                formData.append('file', selectedFile);

                // Add guidelines file if provided
                if (selectedGuidelinesFile) {
                    formData.append('guidelines_file', selectedGuidelinesFile);
                }

                // Add form parameters
                formData.append('format', outputFormat);
                if (maxCommits) formData.append('max_commits', maxCommits.toString());
                if (sinceDate) formData.append('since', sinceDate);
                if (untilDate) formData.append('until', untilDate);

                progressStatus = "Uploading and analyzing...";
                const response = await fetch(`${api_base}/review/upload`, {
                    method: 'POST',
                    body: formData
                });

                progress = 100;

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.detail || 'Review failed');
                }

                const data = await response.json();

                if (outputFormat === 'json' && data.reviews) {
                    reviews = data.reviews;
                    toasts.push({
                        message: `Review completed! ${data.commit_count} commit(s) analyzed.`,
                        color: 'success'
                    });
                } else if (outputFormat === 'text' && data.output) {
                    textOutput = data.output;
                    toasts.push({
                        message: `Review completed! ${data.commit_count} commit(s) analyzed.`,
                        color: 'success'
                    });
                }
            } else {
                // URL review with streaming progress
                const formData = new FormData();
                formData.append('repo_url', repoUrl);
                if (maxCommits) formData.append('max_commits', maxCommits.toString());
                if (sinceDate) formData.append('since', sinceDate);
                if (untilDate) formData.append('until', untilDate);
                if (branch) formData.append('branch', branch);

                // Add guidelines file if provided
                if (selectedGuidelinesFile) {
                    formData.append('guidelines_file', selectedGuidelinesFile);
                }

                // Use streaming endpoint for real-time progress
                const response = await fetch(`${api_base}/review/url/stream`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.detail || 'Review failed');
                }

                // Handle Server-Sent Events stream
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    throw new Error('Failed to get response stream');
                }

                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                handleStreamEvent(data);
                            } catch (e) {
                                // Skip invalid JSON
                            }
                        }
                    }
                }

                // Process any remaining data in buffer
                if (buffer.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(buffer.slice(6));
                        handleStreamEvent(data);
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }

                if (reviews.length > 0) {
                    toasts.push({
                        message: `Review completed! ${reviews.length} commit(s) analyzed.`,
                        color: 'success'
                    });
                }
            }

        } catch (err: any) {
            error = err.message || 'An error occurred';
            toasts.push({ message: error, color: 'danger' });
        } finally {
            loading = false;
            progressStatus = "";
            myTimer?.stop();
        }
    }

    function handleStreamEvent(data: any) {
        switch (data.type) {
            case 'status':
                progressStatus = data.message;
                break;
            case 'total':
                progressTotal = data.total;
                progressStatus = `Found ${data.total} commit(s) to analyze`;
                break;
            case 'progress':
                progressCurrent = data.current;
                progressTotal = data.total;
                currentCommit = data.commit;
                progress = Math.round((data.current / data.total) * 100);
                progressStatus = `Analyzing commit ${data.current}/${data.total}: ${data.commit}`;
                break;
            case 'review':
                // Add review as it comes in
                reviews = [...reviews, data.review];
                break;
            case 'complete':
                progress = 100;
                progressStatus = "Complete!";
                // Final reviews are already added incrementally
                break;
            case 'rate_limit':
                // Show rate limit warning but continue
                progressStatus = data.message;
                toasts.push({ message: 'Rate limit reached. Waiting before retrying...', color: 'warning' });
                break;
            case 'error':
                // Track failed commits and show toast
                if (data.message.includes('commit')) {
                    // Extract commit hash from error message
                    const match = data.message.match(/commit\s+([a-f0-9]+)/i);
                    if (match) {
                        failedCommits = [...failedCommits, match[1]];
                    }
                }
                if (!data.message.includes('Rate limit')) {
                    toasts.push({ message: data.message, color: 'danger' });
                }
                break;
        }
    }

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        selectedFile = target.files?.[0] || null;
    }

    function handleGuidelinesSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        selectedGuidelinesFile = target.files?.[0] || null;
    }

    function clearResults() {
        reviews = [];
        textOutput = "";
        error = "";
        selectedGuidelinesFile = null;
        sinceDate = "";
        untilDate = "";
    }

    async function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" && !loading) {
            await handleReview();
        }
    }
</script>

<ToastNotifications position="top-right" maxToasts={5} />

<div id="main" class="main">
    <div class="header-section">
        <h2><Icon name="file-code" /> Code Review Assistant</h2>
        <p class="text-muted">Analyze Git commits with AI-powered insights</p>
    </div>

    <!-- Configuration Panel -->
    <Card class="mb-4 config-card">
        <CardBody>
            <CardTitle><Icon name="gear" /> Review Configuration</CardTitle>
            
            <!-- Review Mode Selection -->
            <div class="mb-3">
                <label class="form-label fw-bold">Review Source</label>
                <div class="btn-group w-100" role="group">
                    <input 
                        type="radio" 
                        class="btn-check" 
                        bind:group={reviewMode} 
                        value="url" 
                        id="mode-url"
                        on:change={clearResults}
                    />
                    <label class="btn btn-outline-primary" for="mode-url">
                        <Icon name="link-45deg" /> Git Repository URL
                    </label>

                    <input 
                        type="radio" 
                        class="btn-check" 
                        bind:group={reviewMode} 
                        value="upload" 
                        id="mode-upload"
                        on:change={clearResults}
                    />
                    <label class="btn btn-outline-primary" for="mode-upload">
                        <Icon name="upload" /> Upload ZIP File
                    </label>
                </div>
            </div>

            <!-- Conditional Inputs Based on Mode -->
            {#if reviewMode === 'url'}
                <div class="row mb-3">
                    <div class="col-md-8">
                        <label class="form-label">Repository URL</label>
                        <Input
                            placeholder="https://github.com/username/repo.git"
                            bind:value={repoUrl}
                            on:keypress={handleKeyDown}
                        />
                        <small class="text-muted">Enter the Git repository URL (GitHub, GitLab, etc.)</small>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Branch Name</label>
                        <Input
                            placeholder="main"
                            bind:value={branch}
                            on:keypress={handleKeyDown}
                        />
                        <small class="text-muted">e.g., main, master, develop</small>
                    </div>
                </div>
            {:else}
                <div class="mb-3">
                    <label class="form-label">Upload Repository ZIP</label>
                    <input
                        type="file"
                        class="form-control"
                        accept=".zip"
                        bind:this={fileInput}
                        on:change={handleFileSelect}
                    />
                    {#if selectedFile}
                        <small class="text-success"><Icon name="check-circle" /> Selected: {selectedFile.name}</small>
                    {:else}
                        <small class="text-muted">Upload a .zip file containing your Git repository (must include .git folder)</small>
                    {/if}
                </div>
            {/if}

            <!-- Max Commits Option -->
            <div class="row mb-3">
                <div class="col-md-12">
                    <label class="form-label">Maximum Commits to Review</label>
                    <Input
                        type="number"
                        placeholder="10"
                        bind:value={maxCommits}
                        min="1"
                        max="100"
                        on:keypress={handleKeyDown}
                    />
                    <small class="text-muted">Number of most recent commits to analyze. Leave dates empty to get the latest commits.</small>
                </div>
            </div>

            <!-- Date Range Options (Optional) -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Start Date (Optional)</label>
                    <Input
                        type="date"
                        bind:value={sinceDate}
                        on:keypress={handleKeyDown}
                    />
                    <small class="text-muted">Filter commits from this date onwards</small>
                </div>
                <div class="col-md-6">
                    <label class="form-label">End Date (Optional)</label>
                    <Input
                        type="date"
                        bind:value={untilDate}
                        on:keypress={handleKeyDown}
                    />
                    <small class="text-muted">Filter commits up to this date</small>
                </div>
            </div>

            <!-- Optional Guidelines Document -->
            <div class="mb-3">
                <label class="form-label">
                    <Icon name="file-earmark-text" /> Review Guidelines (Optional)
                </label>
                <input
                    type="file"
                    class="form-control"
                    accept=".pdf,.docx,.txt"
                    bind:this={guidelinesInput}
                    on:change={handleGuidelinesSelect}
                />
                {#if selectedGuidelinesFile}
                    <div class="mt-2 d-flex align-items-center gap-2">
                        <Badge color="success">
                            <Icon name="check-circle-fill" /> {selectedGuidelinesFile.name}
                        </Badge>
                        <Button 
                            size="sm"
                            color="danger"
                            outline
                            on:click={() => {
                                selectedGuidelinesFile = null;
                                if (guidelinesInput) guidelinesInput.value = '';
                            }}
                        >
                            <Icon name="x-circle" /> Remove
                        </Button>
                    </div>
                {:else}
                    <small class="text-muted d-block mt-1">
                        <Icon name="info-circle" /> Upload a PDF, DOCX, or TXT file with custom review guidelines to guide the AI's analysis (e.g., security standards, coding conventions, specific focus areas)
                    </small>
                {/if}
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Output Format</label>
                <div class="btn-group w-100" role="group">
                    <input 
                        type="radio" 
                        class="btn-check" 
                        bind:group={outputFormat} 
                        value="json" 
                        id="format-json"
                    />
                    <label class="btn btn-outline-secondary" for="format-json">
                        <Icon name="braces" /> Structured View
                    </label>

                    <input 
                        type="radio" 
                        class="btn-check" 
                        bind:group={outputFormat} 
                        value="text" 
                        id="format-text"
                    />
                    <label class="btn btn-outline-secondary" for="format-text">
                        <Icon name="file-text" /> Plain Text
                    </label>
                </div>
            </div>

            <div class="d-flex gap-2">
                <Button color="primary" on:click={handleReview} disabled={loading} class="flex-grow-1">
                    <Icon name="play-fill" /> Start Review
                </Button>
                <Button color="secondary" on:click={clearResults} disabled={loading}>
                    <Icon name="x-circle" /> Clear
                </Button>
            </div>
        </CardBody>
    </Card>

    <!-- Results Section -->
    {#if loading}
        <Card class="mb-4 progress-card">
            <CardBody>
                <div class="d-flex align-items-center mb-3">
                    <Spinner color="primary" size="sm" class="me-3" />
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>{progressStatus || 'Initializing...'}</strong>
                            <span class="text-muted"><Timer bind:this={myTimer}/>s</span>
                        </div>
                        {#if progressTotal > 0}
                            <small class="text-muted">
                                {progressCurrent} of {progressTotal} commits
                                {#if currentCommit}
                                    - <code>{currentCommit}</code>
                                {/if}
                            </small>
                        {/if}
                    </div>
                </div>
                <Progress value={progress} class="progress-animated">
                    {progress}%
                </Progress>
                {#if (reviews.length > 0 || failedCommits.length > 0) && loading}
                    <div class="mt-3 d-flex gap-3">
                        {#if reviews.length > 0}
                            <small class="text-success">
                                <Icon name="check-circle-fill" /> {reviews.length} commit{reviews.length !== 1 ? 's' : ''} reviewed
                            </small>
                        {/if}
                        {#if failedCommits.length > 0}
                            <small class="text-danger">
                                <Icon name="exclamation-triangle-fill" /> {failedCommits.length} failed
                            </small>
                        {/if}
                    </div>
                {/if}
            </CardBody>
        </Card>
    {/if}

    {#if error}
        <Card class="mb-4 border-danger">
            <CardBody>
                <div class="text-danger">
                    <Icon name="exclamation-triangle-fill" /> <strong>Error:</strong> {error}
                </div>
            </CardBody>
        </Card>
    {/if}

    {#if !loading && failedCommits.length > 0}
        <Card class="mb-4 border-warning">
            <CardBody>
                <div class="text-warning">
                    <Icon name="exclamation-triangle-fill" />
                    <strong>{failedCommits.length} commit{failedCommits.length !== 1 ? 's' : ''} failed to analyze</strong>
                    (likely due to rate limiting)
                </div>
                <small class="text-muted">
                    Failed commits: {failedCommits.join(', ')}
                </small>
                <div class="mt-2">
                    <small>Try reducing the number of commits or wait a few minutes before retrying.</small>
                </div>
            </CardBody>
        </Card>
    {/if}

    <!-- JSON Results -->
    {#if outputFormat === 'json' && reviews.length > 0}
        <div class="reviews-container">
            {#each reviews as review}
                <Card class="mb-3 review-card">
                    <CardBody>
                        <div class="commit-header" on:click={() => toggleCommit(review.commit_hash)} on:keypress={() => toggleCommit(review.commit_hash)} role="button" tabindex="0">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h5 class="mb-1">
                                        <Icon name={expandedCommits.has(review.commit_hash) ? "chevron-down" : "chevron-right"} />
                                        <code class="commit-hash">{review.commit_hash}</code>
                                    </h5>
                                    <p class="commit-message mb-2">{review.commit_message}</p>
                                </div>
                                <Badge color="secondary">{review.findings.length} finding{review.findings.length !== 1 ? 's' : ''}</Badge>
                            </div>
                        </div>

                        <Collapse isOpen={expandedCommits.has(review.commit_hash)}>
                            <div class="mt-3">
                                <p class="text-muted summary-text">{review.summary}</p>
                                
                                {#if review.findings.length > 0}
                                    <h6 class="mt-3 mb-2"><Icon name="code-slash" /> Code Review Findings</h6>
                                    <Table bordered striped hover size="sm" class="findings-table">
                                        <thead>
                                            <tr>
                                                <th style="width: 100px">Severity</th>
                                                <th style="width: 200px">File</th>
                                                <th>Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {#each review.findings as finding, findingIdx}
                                                {@const findingId = `finding-${review.commit_hash}-${findingIdx}`}
                                                <tr>
                                                    <td>
                                                        <Badge color={getSeverityColor(finding.severity)}>
                                                            {finding.severity}
                                                        </Badge>
                                                    </td>
                                                    <td><code class="file-path">{finding.file}</code></td>
                                                    <td>
                                                        <div>{finding.message}</div>
                                                        {#if finding.solution}
                                                            <div class="mt-2">
                                                                <Button
                                                                    size="sm"
                                                                    color="info"
                                                                    outline
                                                                    on:click={() => toggleSolution(findingId)}
                                                                >
                                                                    <Icon name={expandedSolutions.has(findingId) ? "chevron-up" : "chevron-down"} />
                                                                    {expandedSolutions.has(findingId) ? "Hide" : "View"} Solution
                                                                </Button>
                                                            </div>
                                                            <Collapse isOpen={expandedSolutions.has(findingId)}>
                                                                <div class="solution-box mt-2">
                                                                    {#if finding.original_code}
                                                                        <div class="code-comparison">
                                                                            <div class="code-column">
                                                                                <div class="code-header original">
                                                                                    <Icon name="x-circle" /> Original Code
                                                                                </div>
                                                                                <pre class="solution-code original-code">{finding.original_code}</pre>
                                                                            </div>
                                                                            <div class="code-column">
                                                                                <div class="code-header fixed">
                                                                                    <Icon name="check-circle" /> Fixed Code
                                                                                </div>
                                                                                <pre class="solution-code fixed-code">{finding.solution}</pre>
                                                                            </div>
                                                                        </div>
                                                                    {:else}
                                                                        <div class="solution-label">
                                                                            <Icon name="lightbulb-fill" /> Suggested Fix:
                                                                        </div>
                                                                        <pre class="solution-code">{finding.solution}</pre>
                                                                    {/if}
                                                                </div>
                                                            </Collapse>
                                                        {/if}
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </Table>
                                {:else}
                                    <p class="text-success"><Icon name="check-circle" /> No code review issues found!</p>
                                {/if}

                                <!-- Security Summary Section -->
                                {#if review.security_summary}
                                    <div class="security-section mt-4">
                                        <h6 class="mb-2">
                                            <Icon name="shield-exclamation" /> Security Analysis
                                            <Badge color={getRiskLevelColor(review.security_summary.risk_level)} class="ms-2">
                                                {review.security_summary.risk_level} Risk
                                            </Badge>
                                        </h6>

                                        <!-- Security Stats -->
                                        <div class="security-stats mb-3">
                                            <span class="stat-item">
                                                <Badge color="danger">{review.security_summary.critical_count}</Badge> Critical
                                            </span>
                                            <span class="stat-item">
                                                <Badge color="danger">{review.security_summary.high_count}</Badge> High
                                            </span>
                                            <span class="stat-item">
                                                <Badge color="warning">{review.security_summary.medium_count}</Badge> Medium
                                            </span>
                                            <span class="stat-item">
                                                <Badge color="info">{review.security_summary.low_count}</Badge> Low
                                            </span>
                                        </div>

                                        {#if review.security_summary.findings && review.security_summary.findings.length > 0}
                                            <Table bordered striped hover size="sm" class="security-table">
                                                <thead>
                                                    <tr>
                                                        <th style="width: 90px">Severity</th>
                                                        <th style="width: 120px">Type</th>
                                                        <th style="width: 180px">File</th>
                                                        <th>Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {#each review.security_summary.findings as secFinding, secIdx}
                                                        {@const secFindingId = `sec-finding-${review.commit_hash}-${secIdx}`}
                                                        <tr>
                                                            <td>
                                                                <Badge color={getSecuritySeverityColor(secFinding.severity)}>
                                                                    {secFinding.severity}
                                                                </Badge>
                                                            </td>
                                                            <td><span class="finding-type">{secFinding.finding_type}</span></td>
                                                            <td>
                                                                <code class="file-path">{secFinding.file_path}</code>
                                                                {#if secFinding.line_number}
                                                                    <span class="line-number">:{secFinding.line_number}</span>
                                                                {/if}
                                                            </td>
                                                            <td>
                                                                <strong>{secFinding.title}</strong>
                                                                {#if secFinding.cve_id}
                                                                    <Badge color="dark" class="ms-1">{secFinding.cve_id}</Badge>
                                                                {/if}
                                                                <p class="mb-1 mt-1 security-description">{secFinding.description}</p>
                                                                <small class="text-muted"><Icon name="lightbulb" /> {secFinding.recommendation}</small>
                                                                {#if secFinding.solution}
                                                                    <div class="mt-2">
                                                                        <Button
                                                                            size="sm"
                                                                            color="info"
                                                                            outline
                                                                            on:click={() => toggleSolution(secFindingId)}
                                                                        >
                                                                            <Icon name={expandedSolutions.has(secFindingId) ? "chevron-up" : "chevron-down"} />
                                                                            {expandedSolutions.has(secFindingId) ? "Hide" : "View"} Solution
                                                                        </Button>
                                                                    </div>
                                                                    <Collapse isOpen={expandedSolutions.has(secFindingId)}>
                                                                        <div class="solution-box mt-2">
                                                                            {#if secFinding.original_code}
                                                                                <div class="code-comparison">
                                                                                    <div class="code-column">
                                                                                        <div class="code-header original">
                                                                                            <Icon name="x-circle" /> Original Code
                                                                                        </div>
                                                                                        <pre class="solution-code original-code">{secFinding.original_code}</pre>
                                                                                    </div>
                                                                                    <div class="code-column">
                                                                                        <div class="code-header fixed">
                                                                                            <Icon name="check-circle" /> Fixed Code
                                                                                        </div>
                                                                                        <pre class="solution-code fixed-code">{secFinding.solution}</pre>
                                                                                    </div>
                                                                                </div>
                                                                            {:else}
                                                                                <div class="solution-label">
                                                                                    <Icon name="lightbulb-fill" /> Suggested Fix:
                                                                                </div>
                                                                                <pre class="solution-code">{secFinding.solution}</pre>
                                                                            {/if}
                                                                        </div>
                                                                    </Collapse>
                                                                {/if}
                                                            </td>
                                                        </tr>
                                                    {/each}
                                                </tbody>
                                            </Table>
                                        {:else}
                                            <p class="text-success"><Icon name="shield-check" /> No security vulnerabilities detected!</p>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </Collapse>
                    </CardBody>
                </Card>
            {/each}
        </div>
    {/if}

    <!-- Text Output -->
    {#if outputFormat === 'text' && textOutput}
        <Card class="mb-4">
            <CardBody>
                <CardTitle>Review Output</CardTitle>
                <pre class="text-output">{textOutput}</pre>
            </CardBody>
        </Card>
    {/if}
</div>

<style>
    .main {
        height: 100%;
        padding: 25px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .header-section {
        text-align: center;
        margin-bottom: 2rem;
    }

    .header-section h2 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }

    .config-card {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .review-card {
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        transition: box-shadow 0.2s ease;
    }

    .review-card:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .commit-header {
        cursor: pointer;
        user-select: none;
    }

    .commit-hash {
        font-size: 0.9rem;
        background-color: #f8f9fa;
        padding: 2px 6px;
        border-radius: 3px;
        color: #495057;
    }

    .commit-message {
        color: #495057;
        font-size: 0.95rem;
    }

    .summary-text {
        font-size: 0.9rem;
        line-height: 1.6;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        border-left: 3px solid #007bff;
    }

    .file-path {
        font-size: 0.85rem;
        background-color: #f8f9fa;
        padding: 2px 4px;
        border-radius: 2px;
        color: #d63384;
    }

    .findings-table {
        font-size: 0.9rem;
        margin-top: 1rem;
    }

    .security-section {
        padding: 15px;
        background-color: #fff8f8;
        border-radius: 6px;
        border-left: 4px solid #dc3545;
    }

    .security-stats {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    .stat-item {
        font-size: 0.9rem;
        color: #495057;
    }

    .security-table {
        font-size: 0.85rem;
        margin-top: 0.5rem;
    }

    .finding-type {
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: 500;
        color: #6c757d;
    }

    .line-number {
        font-size: 0.8rem;
        color: #6c757d;
    }

    .security-description {
        font-size: 0.85rem;
        color: #495057;
    }

    .text-output {
        background-color: #1e1e1e;
        color: #d4d4d4;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.85rem;
        line-height: 1.5;
    }

    .reviews-container {
        animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    :global(.btn-group .btn) {
        flex: 1;
    }

    .solution-box {
        background-color: #f8f9fa;
        border-left: 3px solid #17a2b8;
        padding: 10px;
        border-radius: 4px;
        margin-top: 8px;
    }

    .solution-label {
        font-weight: 600;
        color: #17a2b8;
        margin-bottom: 8px;
        font-size: 0.9rem;
    }

    .solution-code {
        background-color: #1e1e1e;
        color: #d4d4d4;
        padding: 10px;
        border-radius: 4px;
        font-size: 0.85rem;
        line-height: 1.5;
        margin: 0;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .code-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 8px;
    }

    @media (max-width: 768px) {
        .code-comparison {
            grid-template-columns: 1fr;
        }
    }

    .code-column {
        display: flex;
        flex-direction: column;
    }

    .code-header {
        font-weight: 600;
        padding: 8px 10px;
        border-radius: 4px 4px 0 0;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .code-header.original {
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffc107;
        border-bottom: none;
    }

    .code-header.fixed {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #28a745;
        border-bottom: none;
    }

    .original-code {
        border: 1px solid #ffc107;
        border-top: none;
        border-radius: 0 0 4px 4px;
        background-color: #2d2d2d;
    }

    .fixed-code {
        border: 1px solid #28a745;
        border-top: none;
        border-radius: 0 0 4px 4px;
        background-color: #1e3a1e;
    }

    .progress-card {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-left: 4px solid #007bff;
    }

    :global(.progress-animated .progress-bar) {
        transition: width 0.3s ease-in-out;
    }
</style>