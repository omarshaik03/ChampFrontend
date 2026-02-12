<script lang="ts">
    import { onMount } from 'svelte';
    import { Toast, ToastBody, ToastHeader } from "@sveltestrap/sveltestrap";
    import { toasts } from '../../lib/stores/toastStore';
    
    // Position of the toast container
    export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
    
    // Maximum number of toasts to display
    export let maxToasts: number = 5;
    
    // Calculate positioning CSS class
    $: positionClass = {
        'top-right': 'end-0',
        'top-left': 'start-0',
        'bottom-right': 'bottom-0 end-0',
        'bottom-left': 'bottom-0 start-0'
    }[position];
    
    function handleClose(id: string) {
        toasts.remove(id);
    }
</script>

<div class="toast-container p-3 {positionClass} position-fixed" style={position.startsWith('top') ? 'top: 80px' : ''}>
    {#each $toasts.slice(0, maxToasts) as toast (toast.id)}
        <Toast 
            class="mb-2 {toast.color === 'danger' ? 'toast-prominent' : ''}" 
            color={toast.color}
            autohide={true}
            delay={toast.timeout}
            isOpen={true}
            fade={true}
            on:close={() => handleClose(toast.id)}
        >
            {#if toast.header}
                <ToastHeader toggle={() => handleClose(toast.id)}>
                    {toast.header}
                </ToastHeader>
            {/if}
            <ToastBody>
                {toast.message}
            </ToastBody>
        </Toast>
    {/each}
</div>

<style>
    .toast-container {
        z-index: 9999;
    }

    :global(.toast-prominent) {
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4) !important;
        border: 2px solid #dc3545 !important;
        min-width: 350px;
        background-color: #ffeef0 !important; /* Very light red */
        color: #842029 !important; /* Dark red text for readability */
    }

    :global(.toast-prominent .toast-header) {
        background-color: #ffeef0 !important;
        border-bottom: 1px solid #f5c2c7 !important;
        color: #842029 !important;
    }

    :global(.toast-prominent .toast-body) {
        font-weight: 500;
        font-size: 1.05rem;
    }
</style>
