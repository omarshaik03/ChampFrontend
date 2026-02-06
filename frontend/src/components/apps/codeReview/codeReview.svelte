<script lang="ts">
    import { Modal, Icon, Input, Button, Spinner, Progress, Card, CardBody, CardTitle, Badge, Table, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';
    import Toastwrapper from '../../common/toastwrapper.svelte';
    import Timer from '../../common/timer.svelte';
    import ToastNotifications from '../../common/ToastNotifications.svelte';
    import { toasts } from '../../../lib/stores/toastStore';
    import { userStore } from '../../../lib/stores/userStore';
	import runtimeConfig from '$lib/runtime-config';

    let user = $userStore;
    let api_base = runtimeConfig.CODE_REVIEW_URL;

    // GitHub authentication state
    let githubAuth = {
        authenticated: false,
        username: '',
        avatar_url: ''
    };
    let githubRepos: any[] = [];
    let loadingRepos = false;
    let repoDropdownOpen = false;
    let repoSearchQuery = '';

    // Azure DevOps authentication state
    let azureDevOpsAuth = {
        authenticated: false,
        display_name: '',
        email: '',
        organization: ''
    };
    let azdoRepos: any[] = [];
    let loadingAzdoRepos = false;
    let azdoRepoDropdownOpen = false;
    let azdoRepoSearchQuery = '';
    let azdoOrgInput = '';
    let settingOrg = false;
    let selectedAzdoRepo: any = null;

    // Review options
    let reviewMode: 'upload' | 'url' | 'github' | 'azuredevops' = 'url';
    let repoPath = "";
    let repoUrl = "https://github.com/pallets/click.git";
    let selectedGithubRepo: any = null;
    let branch = "main";
    let maxCommits: number = 1;
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

    // Validation state
    let validationErrors: {[key: string]: string} = {};
    let resultsSection: HTMLElement;

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

    // Validation functions
    function validateMaxCommits(value: number | string): string | null {
        if (value === null || value === undefined || value === '') {
            return 'Please enter the number of commits to review';
        }
        const num = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(num)) {
            return 'Please enter a valid whole number';
        }
        if (num < 1) {
            return 'Number of commits must be at least 1';
        }
        if (num > 100) {
            return 'Maximum 100 commits allowed';
        }
        if (!Number.isInteger(num)) {
            return 'Please enter a whole number (no decimals)';
        }
        return null;
    }

    function normalizeMaxCommits() {
        if (maxCommits !== null && maxCommits !== undefined) {
            // Normalize inputs like "000001" to 1
            const normalized = Math.floor(Math.abs(Number(maxCommits)));
            if (!isNaN(normalized) && normalized >= 1) {
                maxCommits = Math.min(normalized, 100);
            } else {
                maxCommits = 1;
            }
        } else {
            maxCommits = 1;
        }
        validateField('maxCommits');
    }

    function validateDates(): string | null {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        if (sinceDate) {
            const startDate = new Date(sinceDate);
            if (isNaN(startDate.getTime())) {
                return 'Invalid start date format';
            }
            if (startDate > today) {
                return 'Start date cannot be in the future';
            }
        }

        if (untilDate) {
            const endDate = new Date(untilDate);
            if (isNaN(endDate.getTime())) {
                return 'Invalid end date format';
            }
            if (endDate > today) {
                return 'End date cannot be in the future';
            }
        }

        if (sinceDate && untilDate) {
            const startDate = new Date(sinceDate);
            const endDate = new Date(untilDate);
            if (startDate > endDate) {
                return 'Start date must be earlier than or equal to end date';
            }
        }

        return null;
    }

    function validateField(field: string) {
        const newErrors = { ...validationErrors };

        switch (field) {
            case 'maxCommits':
                const maxCommitsError = validateMaxCommits(maxCommits);
                if (maxCommitsError) {
                    newErrors.maxCommits = maxCommitsError;
                } else {
                    delete newErrors.maxCommits;
                }
                break;
            case 'sinceDate':
            case 'untilDate':
                const dateError = validateDates();
                if (dateError) {
                    newErrors.dates = dateError;
                } else {
                    delete newErrors.dates;
                }
                break;
            case 'repoUrl':
                if (reviewMode === 'url' && !repoUrl.trim()) {
                    newErrors.repoUrl = 'Please enter a repository URL';
                } else if (reviewMode === 'url' && !repoUrl.match(/^https?:\/\/.+/)) {
                    newErrors.repoUrl = 'Please enter a valid URL starting with http:// or https://';
                } else {
                    delete newErrors.repoUrl;
                }
                break;
        }

        validationErrors = newErrors;
    }

    function validateAllFields(): boolean {
        validationErrors = {};

        // Validate based on review mode
        if (reviewMode === 'github') {
            if (!selectedGithubRepo) {
                validationErrors.repo = 'Please select a repository';
            }
        } else if (reviewMode === 'azuredevops') {
            if (!selectedAzdoRepo) {
                validationErrors.repo = 'Please select a repository';
            }
            if (!azureDevOpsAuth.organization) {
                validationErrors.org = 'Please set your Azure DevOps organization';
            }
        } else if (reviewMode === 'url') {
            if (!repoUrl.trim()) {
                validationErrors.repoUrl = 'Please enter a repository URL';
            } else if (!repoUrl.match(/^https?:\/\/.+/)) {
                validationErrors.repoUrl = 'Please enter a valid URL starting with http:// or https://';
            }
        } else if (reviewMode === 'upload' && !selectedFile) {
            validationErrors.file = 'Please select a ZIP file to upload';
        }

        // Validate max commits
        const maxCommitsError = validateMaxCommits(maxCommits);
        if (maxCommitsError) {
            validationErrors.maxCommits = maxCommitsError;
        }

        // Validate dates
        const dateError = validateDates();
        if (dateError) {
            validationErrors.dates = dateError;
        }

        return Object.keys(validationErrors).length === 0;
    }

    function scrollToResults() {
        // Use setTimeout to ensure the DOM has updated
        setTimeout(() => {
            if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    async function handleReview() {
        // Normalize max commits before validation
        normalizeMaxCommits();

        // Validate all fields before proceeding
        if (!validateAllFields()) {
            const errorMessages = Object.values(validationErrors);
            toasts.push({
                message: `Please fix the following issues: ${errorMessages.join('. ')}`,
                color: 'danger'
            });
            return;
        }

        loading = true;
        error = "";
        reviews = [];
        failedCommits = [];
        textOutput = "";
        progress = 0;
        progressTotal = 0;
        progressCurrent = 0;
        progressStatus = "Connecting to repository...";
        currentCommit = "";
        myTimer?.start();

        // Auto-scroll to results section
        scrollToResults();

        try {
            if (reviewMode === 'upload') {
                // Upload zip file (non-streaming)
                if (!selectedFile) {
                    toasts.push({ message: "Please select a ZIP file containing your repository", color: 'warning' });
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
                    body: formData,
                    credentials: 'include'
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
                // URL or GitHub review with streaming progress
                const formData = new FormData();

                // Determine the clone URL based on review mode
                let urlToUse: string;
                if (reviewMode === 'github' && selectedGithubRepo) {
                    urlToUse = selectedGithubRepo.clone_url;
                } else if (reviewMode === 'azuredevops' && selectedAzdoRepo) {
                    urlToUse = selectedAzdoRepo.remote_url;
                } else {
                    urlToUse = repoUrl;
                }
                formData.append('repo_url', urlToUse);

                if (maxCommits) formData.append('max_commits', maxCommits.toString());
                if (sinceDate) formData.append('since', sinceDate);
                if (untilDate) formData.append('until', untilDate);
                if (branch) formData.append('branch', branch);

                // Add guidelines file if provided
                if (selectedGuidelinesFile) {
                    formData.append('guidelines_file', selectedGuidelinesFile);
                }

                // Use streaming endpoint for real-time progress
                // Include credentials to send auth cookies for private repo access
                const response = await fetch(`${api_base}/review/url/stream`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
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
            const errorMessage = err.message || 'An error occurred';
            // Provide user-friendly error messages
            if (errorMessage.includes('clone') || errorMessage.includes('Clone')) {
                error = 'Unable to access the repository. Please verify the URL is correct and the repository is public.';
            } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
                error = 'The operation took too long. This may happen with large repositories. Please try again with fewer commits.';
            } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
                error = 'Too many requests. Please wait a few minutes before trying again.';
            } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
                error = 'Network error. Please check your internet connection and try again.';
            } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                error = 'Repository not found. Please verify the URL is correct.';
            } else {
                error = `Review failed: ${errorMessage}`;
            }
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
                progressStatus = "Rate limit reached - waiting to retry...";
                toasts.push({
                    message: 'The AI service is temporarily busy. Automatically waiting and will retry. Please be patient.',
                    color: 'warning'
                });
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
                if (!data.message.includes('Rate limit') && !data.message.includes('rate limit')) {
                    // Provide user-friendly error message
                    let userMessage = data.message;
                    if (data.message.includes('clone') || data.message.includes('Clone')) {
                        userMessage = 'Unable to access the repository. Please verify the URL is correct and the repository is public.';
                    } else if (data.message.includes('timeout')) {
                        userMessage = 'The operation took too long. Please try with fewer commits.';
                    }
                    toasts.push({ message: userMessage, color: 'danger' });
                }
                break;
        }
    }

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        selectedFile = target.files?.[0] || null;
        // Clear file validation error when a file is selected
        if (selectedFile) {
            const newErrors = { ...validationErrors };
            delete newErrors.file;
            validationErrors = newErrors;
        }
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
        validationErrors = {};
        failedCommits = [];
        // Don't clear selectedGithubRepo to preserve user's selection
    }

    async function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" && !loading) {
            await handleReview();
        }
    }

    // GitHub Authentication Functions
    async function checkGitHubAuth() {
        try {
            const response = await fetch(`${api_base}/auth/github/status`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                githubAuth = {
                    authenticated: data.authenticated,
                    username: data.username || '',
                    avatar_url: data.avatar_url || ''
                };
                if (githubAuth.authenticated) {
                    await loadGitHubRepos();
                }
            }
        } catch (err) {
            console.error('Failed to check GitHub auth status:', err);
        }
    }

    function handleGitHubLogin() {
        // Open GitHub OAuth in a popup window
        const width = 600;
        const height = 700;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            `${api_base}/auth/github/login`,
            'github-oauth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        // Poll for popup close and then check auth status
        const pollTimer = setInterval(async () => {
            if (popup?.closed) {
                clearInterval(pollTimer);
                await checkGitHubAuth();
                if (githubAuth.authenticated) {
                    toasts.push({
                        message: `Signed in as ${githubAuth.username}`,
                        color: 'success'
                    });
                    // Auto-switch to github mode if authenticated
                    reviewMode = 'github';
                }
            }
        }, 500);
    }

    async function handleGitHubLogout() {
        try {
            const response = await fetch(`${api_base}/auth/github/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                githubAuth = { authenticated: false, username: '', avatar_url: '' };
                githubRepos = [];
                selectedGithubRepo = null;
                if (reviewMode === 'github') {
                    reviewMode = 'url';
                }
                toasts.push({
                    message: 'Signed out from GitHub',
                    color: 'info'
                });
            }
        } catch (err) {
            console.error('Failed to logout:', err);
            toasts.push({
                message: 'Failed to sign out',
                color: 'danger'
            });
        }
    }

    async function loadGitHubRepos() {
        loadingRepos = true;
        try {
            const response = await fetch(`${api_base}/auth/github/repos?per_page=100&sort=updated`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                githubRepos = data.repos;
            } else if (response.status === 401) {
                // Token expired
                githubAuth = { authenticated: false, username: '', avatar_url: '' };
                githubRepos = [];
                toasts.push({
                    message: 'GitHub session expired. Please sign in again.',
                    color: 'warning'
                });
            }
        } catch (err) {
            console.error('Failed to load repos:', err);
            toasts.push({
                message: 'Failed to load repositories',
                color: 'danger'
            });
        } finally {
            loadingRepos = false;
        }
    }

    function selectGitHubRepo(repo: any) {
        selectedGithubRepo = repo;
        repoUrl = repo.clone_url;
        branch = repo.default_branch;
        repoDropdownOpen = false;
        repoSearchQuery = '';
    }

    $: filteredRepos = githubRepos.filter(repo =>
        repo.full_name.toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(repoSearchQuery.toLowerCase()))
    );

    // Azure DevOps Authentication Functions
    async function checkAzureDevOpsAuth() {
        try {
            const response = await fetch(`${api_base}/auth/azuredevops/status`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                azureDevOpsAuth = {
                    authenticated: data.authenticated,
                    display_name: data.display_name || '',
                    email: data.email || '',
                    organization: data.organization || ''
                };
                if (azureDevOpsAuth.authenticated && azureDevOpsAuth.organization) {
                    azdoOrgInput = azureDevOpsAuth.organization;
                    await loadAzdoRepos();
                }
            }
        } catch (err) {
            console.error('Failed to check Azure DevOps auth status:', err);
        }
    }

    function handleAzureDevOpsLogin() {
        const width = 600;
        const height = 700;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            `${api_base}/auth/azuredevops/login`,
            'azuredevops-oauth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        const pollTimer = setInterval(async () => {
            if (popup?.closed) {
                clearInterval(pollTimer);
                await checkAzureDevOpsAuth();
                if (azureDevOpsAuth.authenticated) {
                    toasts.push({
                        message: `Signed in to Azure DevOps as ${azureDevOpsAuth.display_name}`,
                        color: 'success'
                    });
                    reviewMode = 'azuredevops';
                }
            }
        }, 500);
    }

    async function handleAzureDevOpsLogout() {
        try {
            const response = await fetch(`${api_base}/auth/azuredevops/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                azureDevOpsAuth = { authenticated: false, display_name: '', email: '', organization: '' };
                azdoRepos = [];
                selectedAzdoRepo = null;
                azdoOrgInput = '';
                if (reviewMode === 'azuredevops') {
                    reviewMode = 'url';
                }
                toasts.push({ message: 'Signed out from Azure DevOps', color: 'info' });
            }
        } catch (err) {
            console.error('Failed to logout from Azure DevOps:', err);
        }
    }

    async function setAzdoOrganization() {
        if (!azdoOrgInput.trim()) {
            toasts.push({ message: 'Please enter an organization name', color: 'warning' });
            return;
        }
        settingOrg = true;
        try {
            const response = await fetch(`${api_base}/auth/azuredevops/organization`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ organization: azdoOrgInput.trim() })
            });
            if (response.ok) {
                azureDevOpsAuth.organization = azdoOrgInput.trim();
                toasts.push({ message: `Organization set to "${azdoOrgInput.trim()}"`, color: 'success' });
                await loadAzdoRepos();
            } else {
                const errData = await response.json();
                toasts.push({ message: errData.detail || 'Failed to set organization', color: 'danger' });
            }
        } catch (err) {
            toasts.push({ message: 'Failed to connect to Azure DevOps', color: 'danger' });
        } finally {
            settingOrg = false;
        }
    }

    async function loadAzdoRepos() {
        loadingAzdoRepos = true;
        try {
            const response = await fetch(`${api_base}/auth/azuredevops/repos`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                azdoRepos = data.repos;
            } else if (response.status === 401) {
                azureDevOpsAuth = { authenticated: false, display_name: '', email: '', organization: '' };
                azdoRepos = [];
                toasts.push({ message: 'Azure DevOps session expired. Please sign in again.', color: 'warning' });
            } else {
                const errData = await response.json();
                toasts.push({ message: errData.detail || 'Failed to load repositories', color: 'danger' });
            }
        } catch (err) {
            console.error('Failed to load Azure DevOps repos:', err);
        } finally {
            loadingAzdoRepos = false;
        }
    }

    function selectAzdoRepo(repo: any) {
        selectedAzdoRepo = repo;
        repoUrl = repo.remote_url;
        branch = repo.default_branch || 'main';
        azdoRepoDropdownOpen = false;
        azdoRepoSearchQuery = '';
    }

    $: filteredAzdoRepos = azdoRepos.filter(repo =>
        repo.full_name.toLowerCase().includes(azdoRepoSearchQuery.toLowerCase()) ||
        repo.name.toLowerCase().includes(azdoRepoSearchQuery.toLowerCase())
    );

    onMount(() => {
        checkGitHubAuth();
        checkAzureDevOpsAuth();
    });
</script>

<ToastNotifications position="top-right" maxToasts={5} />

<div id="main" class="main">
    <div class="header-section">
        <h2><Icon name="file-code" /> Code Review Assistant</h2>
        <p class="text-muted">Analyze Git commits with AI-powered insights</p>

        <!-- Authentication Status -->
        <div class="auth-section mt-3 d-flex justify-content-center gap-3 flex-wrap">
            <!-- GitHub Auth -->
            <div class="auth-provider-card">
                {#if githubAuth.authenticated}
                    <div class="d-flex align-items-center gap-2">
                        {#if githubAuth.avatar_url}
                            <img src={githubAuth.avatar_url} alt={githubAuth.username} class="github-avatar" />
                        {/if}
                        <span class="text-success">
                            <Icon name="check-circle-fill" /> <strong>{githubAuth.username}</strong>
                        </span>
                        <Button size="sm" color="secondary" outline on:click={handleGitHubLogout}>
                            Sign Out
                        </Button>
                    </div>
                {:else}
                    <Button color="dark" on:click={handleGitHubLogin}>
                        <Icon name="github" /> Sign in with GitHub
                    </Button>
                {/if}
            </div>

            <!-- Azure DevOps Auth -->
            <div class="auth-provider-card">
                {#if azureDevOpsAuth.authenticated}
                    <div class="d-flex align-items-center gap-2">
                        <span class="text-primary">
                            <Icon name="check-circle-fill" /> <strong>{azureDevOpsAuth.display_name}</strong>
                        </span>
                        {#if azureDevOpsAuth.organization}
                            <Badge color="info">{azureDevOpsAuth.organization}</Badge>
                        {/if}
                        <Button size="sm" color="secondary" outline on:click={handleAzureDevOpsLogout}>
                            Sign Out
                        </Button>
                    </div>
                {:else}
                    <Button color="primary" on:click={handleAzureDevOpsLogin}>
                        <Icon name="cloud" /> Sign in with Azure DevOps
                    </Button>
                {/if}
            </div>
        </div>
        <p class="text-muted mt-2 mb-0">
            <small>Sign in to access your private repositories</small>
        </p>
    </div>

    <!-- Configuration Panel -->
    <Card class="mb-4 config-card">
        <CardBody>
            <CardTitle><Icon name="gear" /> Review Configuration</CardTitle>
            
            <!-- Review Mode Selection -->
            <div class="mb-3">
                <label class="form-label fw-bold">Review Source</label>
                <div class="btn-group w-100" role="group">
                    {#if githubAuth.authenticated}
                        <input
                            type="radio"
                            class="btn-check"
                            bind:group={reviewMode}
                            value="github"
                            id="mode-github"
                            on:change={clearResults}
                        />
                        <label class="btn btn-outline-primary" for="mode-github">
                            <Icon name="github" /> My Repositories
                        </label>
                    {/if}

                    <input
                        type="radio"
                        class="btn-check"
                        bind:group={reviewMode}
                        value="url"
                        id="mode-url"
                        on:change={clearResults}
                    />
                    <label class="btn btn-outline-primary" for="mode-url">
                        <Icon name="link-45deg" /> Repository URL
                    </label>

                    {#if azureDevOpsAuth.authenticated}
                        <input
                            type="radio"
                            class="btn-check"
                            bind:group={reviewMode}
                            value="azuredevops"
                            id="mode-azuredevops"
                            on:change={clearResults}
                        />
                        <label class="btn btn-outline-primary" for="mode-azuredevops">
                            <Icon name="cloud" /> Azure DevOps
                        </label>
                    {/if}

                    <input
                        type="radio"
                        class="btn-check"
                        bind:group={reviewMode}
                        value="upload"
                        id="mode-upload"
                        on:change={clearResults}
                    />
                    <label class="btn btn-outline-primary" for="mode-upload">
                        <Icon name="upload" /> Upload ZIP
                    </label>
                </div>
            </div>

            <!-- Conditional Inputs Based on Mode -->
            {#if reviewMode === 'github'}
                <!-- GitHub Repository Selector -->
                <div class="row mb-3">
                    <div class="col-md-8">
                        <label class="form-label">Select Repository</label>
                        <div class="repo-selector">
                            {#if loadingRepos}
                                <div class="d-flex align-items-center gap-2 p-2 border rounded">
                                    <Spinner size="sm" /> Loading repositories...
                                </div>
                            {:else}
                                <Dropdown isOpen={repoDropdownOpen} toggle={() => repoDropdownOpen = !repoDropdownOpen} class="w-100">
                                    <DropdownToggle caret class="w-100 text-start d-flex justify-content-between align-items-center">
                                        {#if selectedGithubRepo}
                                            <span>
                                                {#if selectedGithubRepo.private}
                                                    <Icon name="lock-fill" class="text-warning" />
                                                {:else}
                                                    <Icon name="unlock" class="text-muted" />
                                                {/if}
                                                {selectedGithubRepo.full_name}
                                            </span>
                                        {:else}
                                            <span class="text-muted">Choose a repository...</span>
                                        {/if}
                                    </DropdownToggle>
                                    <DropdownMenu class="w-100 repo-dropdown-menu">
                                        <div class="p-2">
                                            <Input
                                                placeholder="Search repositories..."
                                                bind:value={repoSearchQuery}
                                                size="sm"
                                            />
                                        </div>
                                        <div class="repo-list">
                                            {#each filteredRepos as repo}
                                                <DropdownItem on:click={() => selectGitHubRepo(repo)}>
                                                    <div class="d-flex align-items-center gap-2">
                                                        {#if repo.private}
                                                            <Icon name="lock-fill" class="text-warning" />
                                                        {:else}
                                                            <Icon name="unlock" class="text-muted" />
                                                        {/if}
                                                        <div class="flex-grow-1">
                                                            <div class="fw-bold">{repo.full_name}</div>
                                                            {#if repo.description}
                                                                <small class="text-muted">{repo.description.substring(0, 60)}{repo.description.length > 60 ? '...' : ''}</small>
                                                            {/if}
                                                        </div>
                                                    </div>
                                                </DropdownItem>
                                            {:else}
                                                <DropdownItem disabled>No repositories found</DropdownItem>
                                            {/each}
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                            {/if}
                        </div>
                        <small class="text-muted">Select from your public and private repositories</small>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Branch Name</label>
                        <Input
                            placeholder="main"
                            bind:value={branch}
                            on:keypress={handleKeyDown}
                        />
                        <small class="text-muted">Default: {selectedGithubRepo?.default_branch || 'main'}</small>
                    </div>
                </div>
            {:else if reviewMode === 'azuredevops'}
                <!-- Azure DevOps Organization + Repository Selector -->
                <div class="mb-3">
                    <label class="form-label">Organization Name</label>
                    <div class="d-flex gap-2">
                        <Input
                            placeholder="my-organization"
                            bind:value={azdoOrgInput}
                            on:keypress={(e) => { if (e.key === 'Enter') setAzdoOrganization(); }}
                            class="flex-grow-1"
                        />
                        <Button color="primary" on:click={setAzdoOrganization} disabled={settingOrg}>
                            {#if settingOrg}
                                <Spinner size="sm" />
                            {:else}
                                Load Repos
                            {/if}
                        </Button>
                    </div>
                    <small class="text-muted">Enter your Azure DevOps organization name (the part after dev.azure.com/)</small>
                </div>

                {#if azureDevOpsAuth.organization}
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <label class="form-label">Select Repository</label>
                            <div class="repo-selector">
                                {#if loadingAzdoRepos}
                                    <div class="d-flex align-items-center gap-2 p-2 border rounded">
                                        <Spinner size="sm" /> Loading repositories...
                                    </div>
                                {:else}
                                    <Dropdown isOpen={azdoRepoDropdownOpen} toggle={() => azdoRepoDropdownOpen = !azdoRepoDropdownOpen} class="w-100">
                                        <DropdownToggle caret class="w-100 text-start d-flex justify-content-between align-items-center">
                                            {#if selectedAzdoRepo}
                                                <span>{selectedAzdoRepo.full_name}</span>
                                            {:else}
                                                <span class="text-muted">Choose a repository...</span>
                                            {/if}
                                        </DropdownToggle>
                                        <DropdownMenu class="w-100 repo-dropdown-menu">
                                            <div class="p-2">
                                                <Input
                                                    placeholder="Search repositories..."
                                                    bind:value={azdoRepoSearchQuery}
                                                    size="sm"
                                                />
                                            </div>
                                            <div class="repo-list">
                                                {#each filteredAzdoRepos as repo}
                                                    <DropdownItem on:click={() => selectAzdoRepo(repo)}>
                                                        <div>
                                                            <div class="fw-bold">{repo.full_name}</div>
                                                            <small class="text-muted">Project: {repo.project_name}</small>
                                                        </div>
                                                    </DropdownItem>
                                                {:else}
                                                    <DropdownItem disabled>No repositories found</DropdownItem>
                                                {/each}
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>
                                {/if}
                            </div>
                            <small class="text-muted">Repositories from {azureDevOpsAuth.organization}</small>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Branch Name</label>
                            <Input
                                placeholder="main"
                                bind:value={branch}
                                on:keypress={handleKeyDown}
                            />
                            <small class="text-muted">Default: {selectedAzdoRepo?.default_branch || 'main'}</small>
                        </div>
                    </div>
                {/if}
            {:else if reviewMode === 'url'}
                <div class="row mb-3">
                    <div class="col-md-8">
                        <label class="form-label">Repository URL</label>
                        <Input
                            placeholder="https://github.com/username/repo.git"
                            bind:value={repoUrl}
                            on:keypress={handleKeyDown}
                            on:blur={() => validateField('repoUrl')}
                            on:change={() => validateField('repoUrl')}
                            class={validationErrors.repoUrl ? 'is-invalid' : ''}
                        />
                        {#if validationErrors.repoUrl}
                            <div class="invalid-feedback d-block">{validationErrors.repoUrl}</div>
                        {:else if githubAuth.authenticated || azureDevOpsAuth.authenticated}
                            <small class="text-muted">Enter any Git repository URL. Your sign-in credentials will be used for private repos.</small>
                        {:else}
                            <small class="text-muted">Enter a public Git repository URL. Sign in above to access private repos.</small>
                        {/if}
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
                        class="form-control {validationErrors.file ? 'is-invalid' : ''}"
                        accept=".zip"
                        bind:this={fileInput}
                        on:change={handleFileSelect}
                    />
                    {#if validationErrors.file}
                        <div class="invalid-feedback d-block">{validationErrors.file}</div>
                    {:else if selectedFile}
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
                        placeholder="1"
                        bind:value={maxCommits}
                        min="1"
                        max="100"
                        step="1"
                        on:keypress={handleKeyDown}
                        on:blur={normalizeMaxCommits}
                        on:change={() => validateField('maxCommits')}
                        class={validationErrors.maxCommits ? 'is-invalid' : ''}
                    />
                    {#if validationErrors.maxCommits}
                        <div class="invalid-feedback d-block">{validationErrors.maxCommits}</div>
                    {:else}
                        <small class="text-muted">Number of most recent commits to analyze (1-100). Only whole numbers are accepted.</small>
                    {/if}
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
                        on:change={() => validateField('sinceDate')}
                        max={new Date().toISOString().split('T')[0]}
                        class={validationErrors.dates ? 'is-invalid' : ''}
                    />
                    {#if validationErrors.dates}
                        <div class="invalid-feedback d-block">{validationErrors.dates}</div>
                    {:else}
                        <small class="text-muted">Leave dates empty to get the latest commits. Filter commits from this date onwards.</small>
                    {/if}
                </div>
                <div class="col-md-6">
                    <label class="form-label">End Date (Optional)</label>
                    <Input
                        type="date"
                        bind:value={untilDate}
                        on:keypress={handleKeyDown}
                        on:change={() => validateField('untilDate')}
                        max={new Date().toISOString().split('T')[0]}
                        class={validationErrors.dates && !validationErrors.dates.includes('Start') ? 'is-invalid' : ''}
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
    <div bind:this={resultsSection}></div>
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

    /* Validation error styles */
    .invalid-feedback {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    :global(.is-invalid) {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }

    :global(.is-invalid:focus) {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }

    /* Enhanced toast notification styles - override for more visibility */
    :global(.toast) {
        min-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    }

    :global(.toast.bg-danger) {
        background-color: #dc3545 !important;
        color: white !important;
    }

    :global(.toast.bg-warning) {
        background-color: #ffc107 !important;
        color: #212529 !important;
    }

    :global(.toast.bg-success) {
        background-color: #28a745 !important;
        color: white !important;
    }

    /* Authentication Styles */
    .auth-section {
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }

    .auth-provider-card {
        padding: 10px 20px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }

    .github-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #28a745;
    }

    /* Repository Selector Styles */
    .repo-selector :global(.dropdown-toggle) {
        background-color: white;
        border: 1px solid #ced4da;
        color: #495057;
    }

    .repo-selector :global(.dropdown-toggle:hover) {
        background-color: #f8f9fa;
    }

    :global(.repo-dropdown-menu) {
        max-height: 400px;
        overflow-y: auto;
        min-width: 100%;
    }

    .repo-list {
        max-height: 300px;
        overflow-y: auto;
    }

    .repo-list :global(.dropdown-item) {
        padding: 10px 15px;
        border-bottom: 1px solid #f0f0f0;
    }

    .repo-list :global(.dropdown-item:last-child) {
        border-bottom: none;
    }

    .repo-list :global(.dropdown-item:hover) {
        background-color: #f0f7ff;
    }
</style>