<script lang="ts">
    import { Modal, Icon, Input, Button, Spinner, Progress, Card, CardBody, CardTitle, Badge, Table, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';
    import Toastwrapper from '../../common/toastwrapper.svelte';
    import Timer from '../../common/timer.svelte';
    import ToastNotifications from '../../common/ToastNotifications.svelte';
    import { toasts } from '../../../lib/stores/toastStore';
    import { userStore } from '../../../lib/stores/userStore';
    import CostEstimationModal from '../../common/CostEstimationModal.svelte';
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

    // Azure DevOps PAT login
    let azdoPATInput = '';
    let azdoOrgLoginInput = '';
    let azdoLoggingIn = false;
    let showPATInput = false;

    // Review options
    let reviewMode: 'upload' | 'url' | 'github' | 'azuredevops' = 'url';
    let repoPath = "";
    let repoUrl = "";
    let selectedGithubRepo: any = null;
    let branch = "main";
    let maxCommits: number = 1;
    // Date range filtering
    let sinceDate: string = "";
    let untilDate: string = "";

    // File upload
    let fileInput: HTMLInputElement;
    let selectedFile: File | null = null;

    // Results
    let abortController: AbortController | null = null;
    let loading = false;
    let progress: number = 0;
    let progressTotal: number = 0;
    let progressCurrent: number = 0;
    let progressStatus: string = "";
    let currentCommit: string = "";
    let myTimer: Timer;
    let reviews: any[] = [];
    let failedCommits: string[] = [];
    let error = "";

    // Validation state
    let validationErrors: {[key: string]: string} = {};
    let resultsSection: HTMLElement;

    // Cost estimation modal state
    let showCostModal: boolean = false;
    let costModalLoading: boolean = false;
    let costEstimation = {
        inputTokens: null as number | null,
        promptTokens: null as number | null,
        codeTokens: null as number | null,
        projectedOutputTokens: null as number | null,
        projectedCost: null as string | null,
        costPerInputToken: 0,
        costPerOutputToken: 0,
    };
    let costEstimationError: string | null = null;
    let cachedLlmConfig: any = null;
    let reviewStartTime: number = 0;
    let actualTimeTaken: number | null = null;
    let actualInputTokens: number | null = null;
    let actualOutputTokens: number | null = null;
    let actualCost: string | null = null;

    // Modal mode: switches the single modal between estimation and results
    let costModalMode: 'estimation' | 'results' = 'estimation';

    // Expandable commit details
    let expandedCommits: Set<string> = new Set();

    // Expandable solutions
    let expandedSolutions: Set<string> = new Set();
    type FindingChatRole = 'user' | 'assistant';
    type FindingChatMessage = { role: FindingChatRole; content: string };
    type FindingChatContext = {
        finding_scope: 'code' | 'security';
        commit_hash: string;
        commit_message: string;
        review_summary: string;
        severity: string;
        file_path: string;
        line_number?: number;
        message: string;
        recommendation?: string;
        title?: string;
        cve_id?: string;
        original_code?: string;
        solution?: string;
    };
    type FindingChatState = {
        input: string;
        loading: boolean;
        error: string;
        messages: FindingChatMessage[];
    };
    let findingChats: Record<string, FindingChatState> = {};
    let findingContexts: Record<string, FindingChatContext> = {};
    let activeFindingId: string | null = null;
    let isChatDrawerOpen = false;
    let drawerChatInput = '';
    let activeChatState: FindingChatState = {
        input: '',
        loading: false,
        error: '',
        messages: [],
    };
    let activeChatContext: FindingChatContext | null = null;

    const emptyFindingChatState = (): FindingChatState => ({
        input: '',
        loading: false,
        error: '',
        messages: [],
    });

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

    function getFindingChatState(findingId: string): FindingChatState {
        return findingChats[findingId] || emptyFindingChatState();
    }

    function ensureFindingChatState(findingId: string): FindingChatState {
        const existing = findingChats[findingId];
        if (existing) return existing;
        const state = emptyFindingChatState();
        findingChats = { ...findingChats, [findingId]: state };
        return state;
    }

    function updateFindingChatInput(findingId: string, input: string) {
        const currentState = ensureFindingChatState(findingId);
        findingChats = {
            ...findingChats,
            [findingId]: {
                ...currentState,
                input,
            }
        };
    }

    function buildCodeFindingContext(review: any, finding: any): FindingChatContext {
        return {
            finding_scope: 'code',
            commit_hash: review.commit_hash,
            commit_message: review.commit_message,
            review_summary: review.summary || '',
            severity: finding.severity || 'info',
            file_path: finding.file || 'unknown',
            message: finding.message || '',
            original_code: finding.original_code || undefined,
            solution: finding.solution || undefined,
        };
    }

    function buildSecurityFindingContext(review: any, secFinding: any): FindingChatContext {
        return {
            finding_scope: 'security',
            commit_hash: review.commit_hash,
            commit_message: review.commit_message,
            review_summary: review.summary || '',
            severity: secFinding.severity || 'medium',
            file_path: secFinding.file_path || 'unknown',
            line_number: secFinding.line_number || undefined,
            message: secFinding.description || '',
            recommendation: secFinding.recommendation || undefined,
            title: secFinding.title || undefined,
            cve_id: secFinding.cve_id || undefined,
            original_code: secFinding.original_code || undefined,
            solution: secFinding.solution || undefined,
        };
    }

    function openFindingChat(findingId: string, context: FindingChatContext) {
        const currentState = ensureFindingChatState(findingId);
        findingContexts = { ...findingContexts, [findingId]: context };
        findingChats = { ...findingChats, [findingId]: { ...currentState, error: '' } };
        activeFindingId = findingId;
        drawerChatInput = currentState.input || '';
        isChatDrawerOpen = true;
    }

    function closeFindingChatDrawer() {
        isChatDrawerOpen = false;
    }

    async function sendFindingChat(findingId: string, context: FindingChatContext, rawQuestion?: string): Promise<boolean> {
        const currentState = ensureFindingChatState(findingId);
        const question = (rawQuestion ?? currentState.input).trim();
        if (!question || currentState.loading) return false;

        const previousMessages = [...currentState.messages];
        const nextMessages = [...previousMessages, { role: 'user' as const, content: question }];

        findingChats = {
            ...findingChats,
            [findingId]: {
                ...currentState,
                loading: true,
                error: '',
                input: '',
                messages: nextMessages,
            }
        };

        try {
            const response = await fetch(`${api_base}/review/finding-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    question,
                    context,
                    conversation: previousMessages,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to get finding chat response');
            }

            const data = await response.json();
            const refreshedState = ensureFindingChatState(findingId);
            findingChats = {
                ...findingChats,
                [findingId]: {
                    ...refreshedState,
                    loading: false,
                    messages: [
                        ...refreshedState.messages,
                        { role: 'assistant', content: data.answer || 'No answer returned.' }
                    ],
                }
            };
            return true;
        } catch (err: any) {
            const refreshedState = ensureFindingChatState(findingId);
            findingChats = {
                ...findingChats,
                [findingId]: {
                    ...refreshedState,
                    loading: false,
                    error: err.message || 'Unable to complete request.',
                }
            };
            toasts.push({
                message: err.message || 'Failed to send finding chat message.',
                color: 'danger'
            });
            return false;
        }
    }

    async function sendActiveFindingChat() {
        if (!activeFindingId) return;
        const context = findingContexts[activeFindingId];
        if (!context) return;

        const drawerTextarea = document.querySelector('.finding-chat-drawer.open textarea') as HTMLTextAreaElement | null;
        const rawInput = drawerTextarea?.value ?? drawerChatInput;
        const question = (rawInput || '').trim();
        if (!question) {
            toasts.push({ message: 'Please enter a message before sending.', color: 'warning' });
            return;
        }

        const sent = await sendFindingChat(activeFindingId, context, question);
        if (sent) {
            drawerChatInput = '';
            if (drawerTextarea) drawerTextarea.value = '';
        }
    }

    $: activeChatState = activeFindingId
        ? (findingChats[activeFindingId] || emptyFindingChatState())
        : emptyFindingChatState();
    $: activeChatContext = activeFindingId
        ? (findingContexts[activeFindingId] || null)
        : null;

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
        // Use setTimeout to ensure the DOM has updated, then scroll results to top of viewport
        setTimeout(() => {
            if (resultsSection) {
                const yOffset = resultsSection.getBoundingClientRect().top + window.pageYOffset - 10;
                window.scrollTo({ top: yOffset, behavior: 'smooth' });
            }
        }, 150);
    }

    // --- Cost Estimation ---

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

        // Show cost estimation modal before starting review
        showCostModal = true;
        await estimateReviewCost();
    }

    async function fetchLlmConfig() {
        if (cachedLlmConfig) return cachedLlmConfig;
        const res = await fetch(`${api_base}/config/llm`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch LLM configuration');
        cachedLlmConfig = await res.json();
        return cachedLlmConfig;
    }

    function computeCostForCommits(numCommits: number, llmConfig: any) {
        const maxOutputPerCommit = llmConfig.max_output_tokens || 1200;
        const costPerInput = llmConfig.cost_per_input_token;
        const costPerOutput = llmConfig.cost_per_output_token;

        // Per-commit estimates based on review_agent.py constants:
        // - System prompt: ~500 tokens (review instructions, format rules, JSON schema)
        // - Format instructions (Pydantic schema): ~200 tokens
        // - Commit metadata (SHA, summary, description): ~100 tokens
        // - Code diff: MAX_TOTAL_DIFF_CHARS=12000, at ~4 chars/token ≈ 3000 tokens max
        //   Average commit is smaller, use ~1500 tokens as typical estimate
        // - Output: typically uses 40-60% of max_output_tokens, use 50% as estimate
        const promptTokensPerCommit = 800;     // system prompt + format instructions + metadata
        const codeTokensPerCommit = 1500;      // typical diff size (~6000 chars / 4)
        const outputPerCommit = Math.round(maxOutputPerCommit * 0.5);  // typical usage ~50% of max

        const totalPromptTokens = promptTokensPerCommit * numCommits;
        const totalCodeTokens = codeTokensPerCommit * numCommits;
        const totalInputTokens = totalPromptTokens + totalCodeTokens;
        const totalOutputTokens = outputPerCommit * numCommits;

        const inputCost = totalInputTokens * costPerInput;
        const outputCost = totalOutputTokens * costPerOutput;

        return {
            inputTokens: totalInputTokens,
            promptTokens: totalPromptTokens,
            codeTokens: totalCodeTokens,
            outputTokens: totalOutputTokens,
            cost: (inputCost + outputCost).toFixed(6),
            costPerInputToken: costPerInput,
            costPerOutputToken: costPerOutput,
        };
    }

    async function estimateReviewCost() {
        costModalLoading = true;
        costEstimationError = null;

        try {
            const llmConfig = await fetchLlmConfig();
            const numCommits = maxCommits || 1;
            const est = computeCostForCommits(numCommits, llmConfig);

            costEstimation = {
                inputTokens: est.inputTokens,
                promptTokens: est.promptTokens,
                codeTokens: est.codeTokens,
                projectedOutputTokens: est.outputTokens,
                projectedCost: est.cost,
                costPerInputToken: est.costPerInputToken,
                costPerOutputToken: est.costPerOutputToken,
            };
        } catch (err: any) {
            console.error('Error estimating cost:', err);
            costEstimationError = err.message || 'Failed to estimate cost';
        } finally {
            costModalLoading = false;
        }
    }

    function closeCostModal() {
        showCostModal = false;
        costEstimationError = null;
        costModalMode = 'estimation';
    }

    async function proceedWithReview() {
        closeCostModal();
        await executeReview();
    }

    async function executeReview() {
        abortController = new AbortController();
        reviewStartTime = Date.now();
        loading = true;
        error = "";
        reviews = [];
        failedCommits = [];
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


                // Add form parameters
                formData.append('format', 'json');
                if (maxCommits) formData.append('max_commits', maxCommits.toString());
                if (sinceDate) formData.append('since', sinceDate);
                if (untilDate) formData.append('until', untilDate);

                progressStatus = "Uploading and analyzing...";
                const response = await fetch(`${api_base}/review/upload`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    signal: abortController?.signal
                });

                progress = 100;

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.detail || 'Review failed');
                }

                const data = await response.json();

                if (data.reviews) {
                    reviews = data.reviews;
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


                // Use streaming endpoint for real-time progress
                // Include credentials to send auth cookies for private repo access
                const response = await fetch(`${api_base}/review/url/stream`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    signal: abortController?.signal
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
            if (err.name === 'AbortError') {
                // User cancelled — don't show error
                return;
            }
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
            abortController = null;
            progressStatus = "";
            myTimer?.stop();

            // Compute actual cost and show results modal
            if (reviews.length > 0) {
                await computeActualCostResults();
            }
        }
    }

    async function computeActualCostResults() {
        actualTimeTaken = (Date.now() - reviewStartTime) / 1000;

        try {
            // Try to fetch LLM config if not already cached
            if (!cachedLlmConfig) {
                try {
                    await fetchLlmConfig();
                } catch (e) {
                    console.warn('Could not fetch LLM config for cost calculation');
                }
            }

            if (cachedLlmConfig) {
                const costPerInput = cachedLlmConfig.cost_per_input_token;
                const costPerOutput = cachedLlmConfig.cost_per_output_token;

                // If we have actual token data from the API, use it for cost calculation
                if (actualInputTokens && actualOutputTokens) {
                    const inputCost = actualInputTokens * costPerInput;
                    const outputCost = actualOutputTokens * costPerOutput;
                    actualCost = (inputCost + outputCost).toFixed(6);
                } else {
                    // Fallback: estimate based on number of commits reviewed
                    const est = computeCostForCommits(reviews.length, cachedLlmConfig);
                    actualInputTokens = est.inputTokens;
                    actualOutputTokens = est.outputTokens;
                    actualCost = est.cost;
                }
            }
        } catch (err) {
            console.error('Cost summary computation failed:', err);
        }

        // Reopen the same modal in results mode.
        // Use a short delay to ensure Sveltestrap's Modal component has fully
        // completed its internal close cycle before we reopen it.
        costModalMode = 'results';
        costModalLoading = false;
        costEstimationError = null;
        await new Promise(r => setTimeout(r, 300));
        showCostModal = true;
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
                // Capture actual token usage from the backend
                if (data.total_token_usage) {
                    actualInputTokens = data.total_token_usage.input_tokens || 0;
                    actualOutputTokens = data.total_token_usage.output_tokens || 0;
                }
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

    function clearResults() {
        reviews = [];
        error = "";
        repoUrl = "";
        branch = "main";
        maxCommits = 1;
        sinceDate = "";
        untilDate = "";
        selectedFile = null;
        if (fileInput) fileInput.value = '';
        selectedGithubRepo = null;
        selectedAzdoRepo = null;
        repoSearchQuery = '';
        azdoRepoSearchQuery = '';
        validationErrors = {};
        failedCommits = [];
        progress = 0;
        progressTotal = 0;
        progressCurrent = 0;
        progressStatus = "";
        currentCommit = "";
        expandedCommits = new Set();
        expandedSolutions = new Set();
        findingChats = {};
        findingContexts = {};
        activeFindingId = null;
        isChatDrawerOpen = false;
        drawerChatInput = '';
        actualTimeTaken = null;
        actualInputTokens = null;
        actualOutputTokens = null;
        actualCost = null;
        costModalMode = 'estimation';
    }

    function cancelReview() {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        loading = false;
        progressStatus = "Cancelled";
        myTimer?.stop();
        toasts.push({ message: 'Review cancelled.', color: 'info' });
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

    async function handleAzureDevOpsLogin() {
        if (!azdoPATInput.trim()) {
            toasts.push({ message: 'Please enter your Personal Access Token', color: 'warning' });
            return;
        }
        if (!azdoOrgLoginInput.trim()) {
            toasts.push({ message: 'Please enter your Azure DevOps organization name', color: 'warning' });
            return;
        }

        azdoLoggingIn = true;
        try {
            const response = await fetch(`${api_base}/auth/azuredevops/pat-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    pat: azdoPATInput.trim(),
                    organization: azdoOrgLoginInput.trim()
                })
            });

            if (response.ok) {
                const data = await response.json();
                azureDevOpsAuth = {
                    authenticated: true,
                    display_name: data.display_name || '',
                    email: data.email || '',
                    organization: data.organization || ''
                };
                azdoOrgInput = data.organization;
                azdoPATInput = '';
                showPATInput = false;
                toasts.push({
                    message: `Signed in to Azure DevOps as ${azureDevOpsAuth.display_name}`,
                    color: 'success'
                });
                reviewMode = 'azuredevops';
                await loadAzdoRepos();
            } else {
                const errData = await response.json();
                toasts.push({
                    message: errData.detail || 'Failed to authenticate with Azure DevOps',
                    color: 'danger'
                });
            }
        } catch (err) {
            toasts.push({ message: 'Failed to connect to the server', color: 'danger' });
        } finally {
            azdoLoggingIn = false;
        }
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
            console.log('[AzDO] Repos response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('[AzDO] Loaded repos:', data.total_count, 'repos from', data.organization);
                azdoRepos = data.repos || [];
            } else if (response.status === 401) {
                azureDevOpsAuth = { authenticated: false, display_name: '', email: '', organization: '' };
                azdoRepos = [];
                toasts.push({ message: 'Azure DevOps session expired. Please sign in again.', color: 'warning' });
            } else {
                const errData = await response.json();
                console.error('[AzDO] Repos error:', errData);
                toasts.push({ message: errData.detail || 'Failed to load repositories', color: 'danger' });
            }
        } catch (err) {
            console.error('[AzDO] Failed to load repos:', err);
            toasts.push({ message: 'Failed to connect to server for repository list', color: 'danger' });
        } finally {
            loadingAzdoRepos = false;
        }
    }

    function selectAzdoRepo(repo: any) {
        selectedAzdoRepo = repo;
        repoUrl = repo.remote_url;
        branch = repo.default_branch || 'main';
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
        <h2><Icon name="file-code" style="font-size: 1.1em; vertical-align: -0.08em;" /> Code Review Assistant</h2>
        <p class="text-muted mb-0">Analyze Git commits with AI-powered insights</p>
        <hr class="my-4" style="border-top: 3px solid #CDA788; opacity: 1;"/>
    </div>

    <!-- Configuration Panel -->
    <Card class="mb-4 config-card">
        <CardBody>
            <div class="d-flex justify-content-between align-items-start mb-3">
                <CardTitle class="mb-0"><Icon name="gear" /> Review Configuration</CardTitle>
                <div class="d-flex flex-column align-items-end gap-1">
                    <div class="d-flex align-items-center gap-2">
                        {#if githubAuth.authenticated}
                            <div class="auth-chip auth-chip-success">
                                {#if githubAuth.avatar_url}
                                    <img src={githubAuth.avatar_url} alt={githubAuth.username} class="github-avatar" />
                                {/if}
                                <Icon name="github" />
                                <span>{githubAuth.username}</span>
                                <button class="auth-chip-close" on:click={handleGitHubLogout} title="Sign out">
                                    <Icon name="x" />
                                </button>
                            </div>
                        {:else}
                            <Button size="sm" color="dark" on:click={handleGitHubLogin}>
                                <Icon name="github" /> GitHub
                            </Button>
                        {/if}
                        {#if azureDevOpsAuth.authenticated}
                            <div class="auth-chip auth-chip-primary">
                                <Icon name="cloud" />
                                <span>{azureDevOpsAuth.display_name}</span>
                                {#if azureDevOpsAuth.organization}
                                    <Badge color="info" class="ms-1" style="font-size: 0.7rem;">{azureDevOpsAuth.organization}</Badge>
                                {/if}
                                <button class="auth-chip-close" on:click={handleAzureDevOpsLogout} title="Sign out">
                                    <Icon name="x" />
                                </button>
                            </div>
                        {:else}
                            <Button size="sm" color="primary" on:click={() => showPATInput = true}>
                                <Icon name="cloud" /> Azure DevOps
                            </Button>
                        {/if}
                    </div>
                    {#if !githubAuth.authenticated || !azureDevOpsAuth.authenticated}
                        <small class="text-muted" style="font-size: 0.72rem;">Sign in for private repos</small>
                    {/if}
                </div>
            </div>

            <!-- Azure DevOps PAT Login (collapsible) -->
            {#if showPATInput && !azureDevOpsAuth.authenticated}
                <div class="pat-login-bar mb-3">
                    <div class="d-flex align-items-end gap-2 flex-wrap">
                        <div style="flex: 1; min-width: 180px;">
                            <label class="form-label mb-1"><small>Personal Access Token</small></label>
                            <Input type="password" placeholder="Paste your PAT" bind:value={azdoPATInput} size="sm" />
                        </div>
                        <div style="flex: 1; min-width: 150px;">
                            <label class="form-label mb-1"><small>Organization</small></label>
                            <Input placeholder="org name" bind:value={azdoOrgLoginInput} size="sm"
                                on:keypress={(e) => { if (e.key === 'Enter') handleAzureDevOpsLogin(); }} />
                        </div>
                        <Button size="sm" color="primary" on:click={handleAzureDevOpsLogin} disabled={azdoLoggingIn}>
                            {#if azdoLoggingIn}<Spinner size="sm" />{:else}Connect{/if}
                        </Button>
                        <Button size="sm" color="secondary" outline on:click={() => { showPATInput = false; azdoPATInput = ''; }}>
                            Cancel
                        </Button>
                    </div>
                    <small class="text-muted mt-1 d-block">
                        <a href="https://dev.azure.com/{azdoOrgLoginInput || 'YOUR_ORG'}/_usersSettings/tokens" target="_blank" rel="noopener">Create a PAT</a> with "Code (Read)" scope
                    </small>
                </div>
            {/if}
            
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
                        value="url"
                        id="mode-url"
                        on:change={clearResults}
                    />
                    <label class="btn btn-outline-primary" for="mode-url">
                        <Icon name="link-45deg" /> Repository URL
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
                        <Icon name="upload" /> Upload ZIP
                    </label>
                </div>
            </div>

            <!-- Conditional Inputs Based on Mode -->
            {#if reviewMode === 'github'}
                <!-- GitHub: Repo + Branch + Max Commits on one row -->
                <div class="row mb-3 align-items-end">
                    <div class="col-md-6">
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
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Branch</label>
                        <Input placeholder="main" bind:value={branch} on:keypress={handleKeyDown} />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Commits</label>
                        <Input type="number" placeholder="1" bind:value={maxCommits} min="1" max="100" step="1"
                            on:keypress={handleKeyDown} on:blur={normalizeMaxCommits}
                            on:change={() => validateField('maxCommits')}
                            class={validationErrors.maxCommits ? 'is-invalid' : ''} />
                        {#if validationErrors.maxCommits}
                            <div class="invalid-feedback d-block">{validationErrors.maxCommits}</div>
                        {/if}
                    </div>
                </div>
            {:else if reviewMode === 'azuredevops'}
                <!-- Azure DevOps: Repo + Branch + Max Commits on one row -->
                <div class="row mb-3 align-items-end">
                    <div class="col-md-6">
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
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Branch</label>
                        <Input placeholder="main" bind:value={branch} on:keypress={handleKeyDown} />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Commits</label>
                        <Input type="number" placeholder="1" bind:value={maxCommits} min="1" max="100" step="1"
                            on:keypress={handleKeyDown} on:blur={normalizeMaxCommits}
                            on:change={() => validateField('maxCommits')}
                            class={validationErrors.maxCommits ? 'is-invalid' : ''} />
                        {#if validationErrors.maxCommits}
                            <div class="invalid-feedback d-block">{validationErrors.maxCommits}</div>
                        {/if}
                    </div>
                </div>
            {:else if reviewMode === 'url'}
                <!-- URL: Repo URL + Branch + Max Commits on one row -->
                <div class="row mb-3 align-items-end">
                    <div class="col-md-6">
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
                        {/if}
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Branch</label>
                        <Input placeholder="main" bind:value={branch} on:keypress={handleKeyDown} />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Commits</label>
                        <Input type="number" placeholder="1" bind:value={maxCommits} min="1" max="100" step="1"
                            on:keypress={handleKeyDown} on:blur={normalizeMaxCommits}
                            on:change={() => validateField('maxCommits')}
                            class={validationErrors.maxCommits ? 'is-invalid' : ''} />
                        {#if validationErrors.maxCommits}
                            <div class="invalid-feedback d-block">{validationErrors.maxCommits}</div>
                        {/if}
                    </div>
                </div>
            {:else}
                <!-- Upload: File + Max Commits on one row -->
                <div class="row mb-3 align-items-end">
                    <div class="col-md-10">
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
                            <small class="text-success"><Icon name="check-circle" /> {selectedFile.name}</small>
                        {/if}
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Commits</label>
                        <Input type="number" placeholder="1" bind:value={maxCommits} min="1" max="100" step="1"
                            on:keypress={handleKeyDown} on:blur={normalizeMaxCommits}
                            on:change={() => validateField('maxCommits')}
                            class={validationErrors.maxCommits ? 'is-invalid' : ''} />
                        {#if validationErrors.maxCommits}
                            <div class="invalid-feedback d-block">{validationErrors.maxCommits}</div>
                        {/if}
                    </div>
                </div>
            {/if}

            <!-- Date Range -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Start Date <small class="text-muted">(optional)</small></label>
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
                    {/if}
                </div>
                <div class="col-md-6">
                    <label class="form-label">End Date <small class="text-muted">(optional)</small></label>
                    <Input
                        type="date"
                        bind:value={untilDate}
                        on:keypress={handleKeyDown}
                        on:change={() => validateField('untilDate')}
                        max={new Date().toISOString().split('T')[0]}
                        class={validationErrors.dates && !validationErrors.dates.includes('Start') ? 'is-invalid' : ''}
                    />
                </div>
            </div>

            <div class="d-flex gap-2">
                <Button color="primary" on:click={handleReview} disabled={loading} class="flex-grow-1">
                    <Icon name="play-fill" /> Start Review
                </Button>
                {#if loading}
                    <Button color="danger" on:click={cancelReview}>
                        <Icon name="stop-fill" /> Cancel
                    </Button>
                {:else}
                    <Button color="secondary" on:click={clearResults}>
                        <Icon name="x-circle" /> Clear
                    </Button>
                {/if}
            </div>
        </CardBody>
    </Card>

    <!-- Cost Modal (switches between estimation and results mode) -->
    <CostEstimationModal
        isOpen={showCostModal}
        isLoading={costModalLoading}
        mode={costModalMode}
        inputTokens={costModalMode === 'results' ? actualInputTokens : costEstimation.inputTokens}
        promptTokens={costModalMode === 'results' ? null : costEstimation.promptTokens}
        sqlCodeTokens={costModalMode === 'results' ? null : costEstimation.codeTokens}
        projectedOutputTokens={costEstimation.projectedOutputTokens}
        projectedCost={costEstimation.projectedCost}
        actualOutputTokens={actualOutputTokens}
        actualCost={actualCost}
        timeTaken={actualTimeTaken}
        estimationError={costEstimationError}
        onConfirm={proceedWithReview}
        onCancel={closeCostModal}
        codeTokensLabel="Code Tokens"
        confirmButtonLabel="Proceed with Review"
        estimationHeader="Review Cost Estimation"
        resultsHeader="Review Complete — Token Usage"
        estimationDisclaimer={"* Estimated for " + maxCommits + " commit" + (maxCommits !== 1 ? "s" : "") + " based on typical diff sizes and output patterns. Actual usage may vary."}
        loadingMessage="Estimating review cost..."
    />

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

    <!-- Cost Summary -->
    {#if !loading && reviews.length > 0 && actualTimeTaken !== null}
        <Card class="mb-3 border-0 bg-light">
            <CardBody class="py-2 px-3">
                <div class="d-flex flex-wrap align-items-center gap-3">
                    <span class="fw-bold text-muted" style="font-size: 0.85rem;">
                        <Icon name="calculator" /> Cost Summary
                    </span>
                    <span style="font-size: 0.85rem;">
                        <Icon name="check-circle-fill" class="text-success" />
                        {reviews.length} commit{reviews.length !== 1 ? 's' : ''} reviewed
                    </span>
                    {#if actualInputTokens}
                        <span style="font-size: 0.85rem;">
                            <Icon name="arrow-right-circle" class="text-primary" />
                            {actualInputTokens.toLocaleString()} input tokens
                        </span>
                    {/if}
                    {#if actualOutputTokens}
                        <span style="font-size: 0.85rem;">
                            <Icon name="arrow-left-circle" class="text-info" />
                            {actualOutputTokens.toLocaleString()} output tokens
                        </span>
                    {/if}
                    {#if actualCost}
                        <span style="font-size: 0.85rem;">
                            <Icon name="currency-dollar" class="text-success" />
                            ${actualCost} USD
                        </span>
                    {/if}
                    <span style="font-size: 0.85rem;">
                        <Icon name="clock" class="text-muted" />
                        {actualTimeTaken.toFixed(1)}s
                    </span>
                    <button class="btn btn-sm btn-outline-secondary" style="font-size: 0.75rem; padding: 0.15rem 0.5rem;" on:click={() => { costModalMode = 'results'; showCostModal = true; }}>
                        <Icon name="bar-chart" /> Details
                    </button>
                </div>
            </CardBody>
        </Card>
    {/if}

    <!-- JSON Results -->
    {#if reviews.length > 0}
        <div class="reviews-container">
            {#each reviews as review, reviewIdx}
                <div class="review-card">
                    <div class="review-card-header" on:click={() => toggleCommit(review.commit_hash)} on:keypress={() => toggleCommit(review.commit_hash)} role="button" tabindex="0">
                        <div class="d-flex align-items-center gap-2">
                            <span class="review-card-number">#{reviewIdx + 1}</span>
                            <Icon name={expandedCommits.has(review.commit_hash) ? "chevron-down" : "chevron-right"} />
                            <code class="commit-hash">{review.commit_hash}</code>
                            <span class="commit-message-header">{review.commit_message}</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            {#if review.security_summary && review.security_summary.risk_level !== 'None'}
                                <Badge color={getRiskLevelColor(review.security_summary.risk_level)}>
                                    <Icon name="shield-exclamation" /> {review.security_summary.risk_level}
                                </Badge>
                            {/if}
                            <Badge color={review.findings.length > 0 ? 'warning' : 'success'} class="findings-badge">
                                {review.findings.length} finding{review.findings.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </div>

                    <Collapse isOpen={expandedCommits.has(review.commit_hash)}>
                        <div class="review-card-body">
                            <div class="summary-text">{review.summary}</div>
                                
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
                                                        <div class="d-flex gap-2 mt-2">
                                                            {#if finding.solution}
                                                                <Button
                                                                    size="sm"
                                                                    color="info"
                                                                    outline
                                                                    on:click={() => toggleSolution(findingId)}
                                                                >
                                                                    <Icon name={expandedSolutions.has(findingId) ? "chevron-up" : "chevron-down"} />
                                                                    {expandedSolutions.has(findingId) ? "Hide" : "View"} Solution
                                                                </Button>
                                                            {/if}
                                                            <Button
                                                                size="sm"
                                                                color="primary"
                                                                outline
                                                                on:click={() => openFindingChat(findingId, buildCodeFindingContext(review, finding))}
                                                            >
                                                                <Icon name={activeFindingId === findingId && isChatDrawerOpen ? "chat-square-text-fill" : "chat-square-text"} />
                                                                Ask Chat
                                                            </Button>
                                                        </div>
                                                        {#if finding.solution}
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
                                                                <div class="d-flex gap-2 mt-2">
                                                                    {#if secFinding.solution}
                                                                        <Button
                                                                            size="sm"
                                                                            color="info"
                                                                            outline
                                                                            on:click={() => toggleSolution(secFindingId)}
                                                                        >
                                                                            <Icon name={expandedSolutions.has(secFindingId) ? "chevron-up" : "chevron-down"} />
                                                                            {expandedSolutions.has(secFindingId) ? "Hide" : "View"} Solution
                                                                        </Button>
                                                                    {/if}
                                                                    <Button
                                                                        size="sm"
                                                                        color="primary"
                                                                        outline
                                                                        on:click={() => openFindingChat(secFindingId, buildSecurityFindingContext(review, secFinding))}
                                                                    >
                                                                        <Icon name={activeFindingId === secFindingId && isChatDrawerOpen ? "chat-square-text-fill" : "chat-square-text"} />
                                                                        Ask Chat
                                                                    </Button>
                                                                </div>
                                                                {#if secFinding.solution}
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
                </div>
            {/each}
        </div>
    {/if}

    <div
        class={`chat-drawer-backdrop ${isChatDrawerOpen ? 'show' : ''}`}
        role="button"
        tabindex="0"
        aria-label="Close finding chat"
        on:click={closeFindingChatDrawer}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeFindingChatDrawer(); }}
    ></div>
    <aside class={`finding-chat-drawer ${isChatDrawerOpen ? 'open' : ''}`}>
        {#if activeFindingId}
            <div class="drawer-header">
                <div>
                    <h6 class="mb-1"><Icon name="chat-square-text" /> Finding Chat</h6>
                    {#if activeChatContext}
                        <small class="text-muted d-block">{activeChatContext.severity.toUpperCase()} • {activeChatContext.file_path}</small>
                        <small class="text-muted d-block"><code>{activeChatContext.commit_hash}</code></small>
                    {/if}
                </div>
                <Button size="sm" color="secondary" outline on:click={closeFindingChatDrawer}>
                    <Icon name="x-lg" />
                </Button>
            </div>

            {#if activeChatContext}
                <div class="drawer-context">
                    {activeChatContext.message}
                </div>
            {/if}

            <div class="drawer-chat-history">
                {#if activeChatState.messages.length === 0}
                    <div class="text-muted small">Start by asking about risk, severity, exploitability, and remediation.</div>
                {:else}
                    {#each activeChatState.messages as chatMessage}
                        <div class={`finding-chat-message ${chatMessage.role}`}>
                            {chatMessage.content}
                        </div>
                    {/each}
                {/if}
            </div>

            {#if activeChatState.error}
                <div class="text-danger mt-2">
                    <small>{activeChatState.error}</small>
                </div>
            {/if}

            <div class="drawer-input">
                <textarea
                    class="form-control drawer-textarea"
                    rows="3"
                    placeholder="Ask a question about this specific finding..."
                    bind:value={drawerChatInput}
                    on:input={() => {
                        if (activeFindingId) updateFindingChatInput(activeFindingId, drawerChatInput);
                    }}
                    on:keydown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendActiveFindingChat();
                        }
                    }}
                ></textarea>
                <button
                    type="button"
                    class="btn btn-primary mt-2 w-100 drawer-send-btn"
                    on:click={sendActiveFindingChat}
                    disabled={activeChatState.loading || !drawerChatInput.trim()}
                >
                    {#if activeChatState.loading}
                        <Spinner size="sm" /> Asking...
                    {:else}
                        <Icon name="send" /> Send
                    {/if}
                </button>
            </div>
        {/if}
    </aside>

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
        margin-bottom: 1.5rem;
    }

    .header-section h2 {
        color: #0a58ca;
        margin-bottom: 0.25rem;
    }

    .config-card {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Auth chip styles */
    .auth-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .auth-chip-success {
        background-color: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #c8e6c9;
    }

    .auth-chip-primary {
        background-color: #e3f2fd;
        color: #1565c0;
        border: 1px solid #bbdefb;
    }

    .auth-chip-close {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        opacity: 0.6;
        color: inherit;
        display: inline-flex;
        align-items: center;
        line-height: 1;
    }

    .auth-chip-close:hover {
        opacity: 1;
    }

    .github-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    /* PAT login bar */
    .pat-login-bar {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 12px 16px;
    }

    /* Review card styles — enhanced */
    .review-card {
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 16px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        border: 1px solid #e0e4e8;
        background: white;
        transition: box-shadow 0.2s ease, transform 0.15s ease;
    }

    .review-card:hover {
        box-shadow: 0 4px 20px rgba(0,0,0,0.14);
        transform: translateY(-1px);
    }

    .review-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e2e8f0;
        cursor: pointer;
        user-select: none;
        gap: 12px;
    }

    .review-card-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        color: #f1f5f9;
        font-size: 0.75rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .review-card-header .commit-hash {
        font-size: 0.85rem;
        background-color: rgba(255,255,255,0.1);
        padding: 2px 8px;
        border-radius: 4px;
        color: #93c5fd;
        font-family: 'SFMono-Regular', Consolas, monospace;
    }

    .commit-message-header {
        color: #f1f5f9;
        font-size: 0.85rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
    }

    :global(.findings-badge) {
        font-size: 0.75rem !important;
        padding: 4px 10px !important;
    }

    .review-card-body {
        padding: 20px;
        background: #fafbfc;
    }

    .summary-text {
        font-size: 0.9rem;
        line-height: 1.6;
        padding: 12px 16px;
        background-color: #ffffff;
        border-radius: 6px;
        border-left: 4px solid #3b82f6;
        color: #475569;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        margin-bottom: 16px;
    }

    .file-path {
        font-size: 0.85rem;
        background-color: #f1f5f9;
        padding: 2px 6px;
        border-radius: 3px;
        color: #d63384;
    }

    .findings-table {
        font-size: 0.9rem;
        margin-top: 1rem;
        border-radius: 6px;
        overflow: hidden;
    }

    :global(.findings-table thead th) {
        background-color: #f1f5f9 !important;
        color: #475569;
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        border-bottom: 2px solid #e2e8f0 !important;
    }

    .security-section {
        padding: 16px;
        background-color: #fef2f2;
        border-radius: 8px;
        border-left: 4px solid #dc3545;
        margin-top: 16px;
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

    .chat-drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.25);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 1040;
    }

    .chat-drawer-backdrop.show {
        opacity: 1;
        pointer-events: auto;
    }

    .finding-chat-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: min(460px, 96vw);
        height: 100vh;
        background: #ffffff;
        border-left: 1px solid #dbe5f0;
        box-shadow: -8px 0 24px rgba(15, 23, 42, 0.15);
        transform: translateX(100%);
        transition: transform 0.24s ease;
        z-index: 1050;
        display: flex;
        flex-direction: column;
        padding: 14px;
    }

    .finding-chat-drawer.open {
        transform: translateX(0);
    }

    .drawer-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid #edf2f7;
    }

    .drawer-context {
        font-size: 0.88rem;
        color: #475569;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        max-height: 120px;
        overflow-y: auto;
    }

    .drawer-chat-history {
        flex: 1;
        overflow-y: auto;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px;
        background: #fbfdff;
    }

    .finding-chat-message {
        font-size: 0.85rem;
        line-height: 1.4;
        white-space: pre-wrap;
        word-break: break-word;
        padding: 6px 8px;
        border-radius: 6px;
        margin-bottom: 6px;
    }

    .finding-chat-message.user {
        background: #e8f0ff;
        border: 1px solid #c6dbff;
    }

    .finding-chat-message.assistant {
        background: #f1f5f9;
        border: 1px solid #d9e1ea;
    }

    .drawer-input {
        margin-top: 10px;
        position: relative;
        z-index: 2;
    }

    .drawer-textarea {
        resize: vertical;
        min-height: 88px;
    }

    .drawer-send-btn {
        position: relative;
        z-index: 2;
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

    /* Enhanced toast notification styles */
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
