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
        'top-right': 'top-0 end-0',
        'top-left': 'top-0 start-0',
        'bottom-right': 'bottom-0 end-0',
        'bottom-left': 'bottom-0 start-0'
    }[position];
    
    function handleClose(id: string) {
        toasts.remove(id);
    }
</script>

<div class="toast-container p-3 {positionClass} position-fixed">
    {#each $toasts.slice(0, maxToasts) as toast (toast.id)}
        <Toast 
            class="mb-2" 
            color={toast.color}
            autohide={true}
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
</style>
