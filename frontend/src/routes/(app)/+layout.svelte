<script lang="ts">
    import "../../app.css";
    import { userStore } from "../../lib/stores/userStore";
    import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import { browser } from "$app/environment";
	import Navbar from "../../components/common/navbar.svelte";
	import ToastNotifications from "../../components/common/ToastNotifications.svelte";
	import { goto, afterNavigate } from "$app/navigation";
    import { APPS } from "../../lib/commontypes"; // Import the apps object from commontypes
    
    // This receives the data from +layout.server.ts
    export let data: PageData;
    let currentApp: string;
    let appAlias: string;

    function getCurrentApp(url: string): string {
        console.log("URL:", url);
        
        //remove protocol, host, and port from the URL
        const urlWithoutHost = url.replace(/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)(?::\d+)?/, "");
        
        //get the key from apps based on the URLWithoutHost
        const appKey = Object.keys(APPS).find(key => APPS[key].route === urlWithoutHost);
        console.log("App key:", appKey);

        //if the appKey is not found, return "Home"
        if (!appKey) {
            console.log("App key not found, returning 'Home'.");
            return "Home";
        }

        return appKey;
    }    // When the component mounts, update the store with server data
    onMount(() => {
        if (!browser) return;
        updateUserStore();
    });    // This function checks if the current app is accessible and handles redirects if needed
    function checkAccessAndRedirect() {
        //set current app based on the URL
        const url = window.location.href;
        currentApp = getCurrentApp(url);
        appAlias = APPS[currentApp].alias;

        if (!data.user && currentApp !== "Home") {
            console.error("User data not found, redirecting to login.");
            // Store the current path before redirecting to login
            const currentPath = window.location.pathname;
            if (currentPath !== "/auth/login") {
                // Only set if not already on login page to avoid loops
                sessionStorage.setItem("returnTo", currentPath);
            }
            goto("/auth/login", { replaceState: true });
            return;
        } else if (data.user?.allowed_apps?.includes(currentApp)) {
            console.log("User has access to the app:", currentApp);
        } else {
            console.error("User does not have access to the app:", currentApp);
            if (currentApp !== "Home") {
                // Redirect to home if the user does not have access to the current app
                goto("/", { replaceState: true });
            }
        }
    }

    // Update user store from server data
    function updateUserStore() {
        if (data && data.user) {
            userStore.set({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                allowed_apps: data.user.allowed_apps,
                tokens_left: data.user.tokens_left,
                tokens_allocated: data.user.tokens_allocated,
                token: data.token,
                url_base: data.url_base,
            });
        }
        
        // Always check access after updating the store
        checkAccessAndRedirect();
        console.log("User store updated with server data:", $userStore);
    }

    // Handle navigation events to check access on every route change
    afterNavigate(() => {
        if (!browser) return;
        checkAccessAndRedirect();
    });
</script>

<ToastNotifications position="top-right" />
{#if $userStore}
    <Navbar
        bind:currentApp={currentApp}
        bind:appAlias={appAlias}
        allowedApps={$userStore.allowed_apps}
        authenticated={!!$userStore.token}
        userName={$userStore.name}
    />
    <slot/>
{:else} 
    <Navbar
        bind:currentApp={currentApp}
        bind:appAlias={appAlias}
    />
    <slot/>
{/if}