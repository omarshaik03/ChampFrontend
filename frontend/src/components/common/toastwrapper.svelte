<script lang="ts">
	import { Toast, ToastBody, ToastHeader } from "@sveltestrap/sveltestrap";

    export let open = false;
    export let width = "max-content";
</script>

<div class="my-toast" style="width: {width}">
    <Toast isOpen={open} color="primary">
        {#if $$slots.header}
            <ToastHeader>
                <slot name="header" />
            </ToastHeader>
        {/if}
        {#if $$slots.body}
            <ToastBody>
                <slot name="body" />
            </ToastBody>
        {/if}
    </Toast>
</div>

<style>
    .my-toast {
        position: fixed;
        top: var(--nav-height);
        right: 0;
    }
    :root {
        --nav-height: 70px;
    }
</style>

