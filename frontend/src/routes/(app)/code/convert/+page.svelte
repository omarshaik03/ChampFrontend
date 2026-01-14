<script lang="ts">
    import CodeConversion from "$lib/components/code-conversion/CodeConversion.svelte";
	import ToastNotifications from "../../../../components/common/ToastNotifications.svelte";
    import { toasts } from "$lib/stores/toastStore";
	import { goto } from "$app/navigation";
    import { userStore } from "$lib/stores/userStore";

    // data management
    let user = $userStore;
    let url_base: string | undefined;
    
    $: if (user?.url_base) {
        url_base = user.url_base;
    }

    function handleUnauthorized(): void {
        toasts.push({ message: 'Unauthorized. Please login.', color: 'danger' });
        goto("/auth/login");
    }
</script>

<ToastNotifications position="top-right" maxToasts={5} />

{#if user?.token && url_base}
    <CodeConversion
        urlBase={url_base} 
        onUnauthorized={handleUnauthorized}
        on:toast={(event) => toasts.push(event.detail)}
    />
{:else}
    <div class="d-flex justify-content-center align-items-center" style="min-height: 50vh;">
        <div class="text-center">
            <h3>Authentication Required</h3>
            <p>Please log in to use the code conversion tool.</p>
        </div>
    </div>
{/if}

<style>
    @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
</style>