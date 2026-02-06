<script lang="ts">
    import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@sveltestrap/sveltestrap";

    export let isOpen: boolean = false;
    export let isLoading: boolean = false;
    export let mode: 'estimation' | 'results' = 'estimation';
    
    // Common props
    export let inputTokens: number | null = null;
    export let promptTokens: number | null = null;
    export let sqlCodeTokens: number | null = null;
    
    // Estimation mode props
    export let projectedOutputTokens: number | null = null;
    export let projectedCost: string | null = null;
    export let estimationError: string | null = null;
    
    // Results mode props
    export let actualOutputTokens: number | null = null;
    export let actualCost: string | null = null;
    export let timeTaken: number | null = null;
    
    // Callbacks
    export let onConfirm: () => void = () => {};
    export let onCancel: () => void = () => {};

    function handleConfirm() {
        onConfirm();
    }

    function handleCancel() {
        onCancel();
    }
    
    $: isEstimationMode = mode === 'estimation';
    $: isResultsMode = mode === 'results';
</script>

{#if isOpen}
    <div class="cost-modal-dim" aria-hidden="true"></div>
{/if}

<Modal
    {isOpen}
    toggle={handleCancel}
    centered
    backdrop={false}
    container="inline"
    modalClassName="show cost-estimation-modal"
    fade={false}
>
    <ModalHeader toggle={handleCancel}>
        {isEstimationMode ? 'Cost Estimation' : 'Conversion Results'}
    </ModalHeader>
    <ModalBody>
        {#if isLoading}
            <div class="text-center">
                <Spinner color="primary" class="mb-2" />
                <p>Calculating token counts and cost...</p>
            </div>
        {:else if estimationError && isEstimationMode}
            <div class="alert alert-danger" role="alert">
                <strong>Error:</strong> {estimationError}
            </div>
        {:else}
            <div class="cost-estimation-container">
                <div class="estimation-row">
                    <div>Total Input Tokens:</div>
                    <span class="value">{inputTokens !== null ? inputTokens.toLocaleString() : 'N/A'}</span>
                </div>
                <div class="estimation-row sub-row">
                    <div>└─ Prompt Tokens:</div>
                    <span class="value">{promptTokens !== null ? promptTokens.toLocaleString() : 'N/A'}</span>
                </div>
                <div class="estimation-row sub-row">
                    <div>└─ SQL Code Tokens:</div>
                    <span class="value">{sqlCodeTokens !== null ? sqlCodeTokens.toLocaleString() : 'N/A'}</span>
                </div>
                <div class="estimation-row">
                    <div>{isEstimationMode ? 'Projected' : 'Actual'} Output Tokens:</div>
                    <span class="value">
                        {#if isEstimationMode}
                            {projectedOutputTokens !== null ? projectedOutputTokens.toLocaleString() : 'N/A'}
                        {:else}
                            {actualOutputTokens !== null ? actualOutputTokens.toLocaleString() : 'N/A'}
                        {/if}
                    </span>
                </div>
                
                {#if isResultsMode && timeTaken !== null}
                    <div class="estimation-row">
                        <div>Time Taken:</div>
                        <span class="value">{timeTaken.toFixed(2)} seconds</span>
                    </div>
                {/if}
                
                <hr>
                <div class="estimation-row total">
                    <div><strong>{isEstimationMode ? 'Estimated' : 'Actual'} Cost:</strong></div>
                    <span class="value">
                        <strong>
                            {#if isEstimationMode}
                                {projectedCost !== null ? projectedCost : 'N/A'}
                            {:else}
                                {actualCost !== null ? actualCost : 'N/A'}
                            {/if}
                            USD
                        </strong>
                    </span>
                </div>
                
                {#if isEstimationMode}
                    <small class="text-muted d-block mt-3">
                        * Projected output tokens are estimated based on typical SQL conversion patterns.
                    </small>
                    <small class="text-muted d-block">
                        * The actual cost will be calculated based on the exact output token count once the conversion completes.
                    </small>
                {/if}
            </div>
        {/if}
    </ModalBody>
    <ModalFooter>
        {#if isEstimationMode}
            <Button color="secondary" on:click={handleCancel} disabled={isLoading}>
                Cancel
            </Button>
            <Button color="primary" on:click={handleConfirm} disabled={isLoading || estimationError !== null}>
                Proceed with Conversion
            </Button>
        {:else}
            <Button color="primary" on:click={handleCancel}>
                Close
            </Button>
        {/if}
    </ModalFooter>
</Modal>

<style>
    :global(.cost-estimation-modal) {
        display: block;
        z-index: 1050;
    }

    .cost-modal-dim {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.30);
        z-index: 1040;
        pointer-events: none;
    }

    .cost-estimation-container {
        padding: 1rem 0;
    }

    .estimation-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e9ecef;
    }

    .estimation-row.total {
        border-bottom: none;
        border-top: 2px solid #dee2e6;
        padding-top: 1rem;
        margin-top: 0.5rem;
    }

    .estimation-row.sub-row {
        padding-left: 1rem;
        font-size: 0.9em;
        color: #6c757d;
        border-bottom: none;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }

    .estimation-row > div {
        margin: 0;
        font-weight: 500;
    }

    .estimation-row .value {
        text-align: right;
        font-family: monospace;
        font-size: 1.05em;
        color: #0d6efd;
    }

    .estimation-row.total .value {
        color: #198754;
        font-size: 1.2em;
    }
</style>
