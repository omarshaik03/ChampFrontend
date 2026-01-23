<script lang="ts">
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";
	import Logs from "../../../components/apps/admin/logs.svelte";
    import Users from "../../../components/apps/admin/users.svelte";
	import { Heading } from "flowbite-svelte";
    import { Button } from "@sveltestrap/sveltestrap";
    import { userStore } from "../../../lib/stores/userStore";

    let filter: [Boolean, String];
    filter = [false, ""];
    onMount(async () => {
        if(!$userStore) {
            goto("/auth/login");
            return;
        }
    });
</script>


{#if !$userStore}
    <div class="flex justify-center items-center h-screen">
        <div class="text-center">
            <h1 class="text-2xl font-bold">Loading...</h1>
        </div>
    </div>
{:else}
    <div class="flex justify-end mb-4 pt-4 pr-4">
        <Button color="dark" href="/admin/testing">API Testing Dashboard</Button>
    </div>
        <Users data={$userStore}/>
    <!-- Overall Title -->
    <Heading tag="h2" class="mb-4 text-2xl font-bold dark:text-white">
        User Logs
    </Heading>

    <!-- User Activity Logs -->
    <div>
        <Heading tag="h3" class="ml-0 mb-2 text-xl font-semibold dark:text-white">
            User Activity
        </Heading>  
        <Logs data={$userStore} filter={[false, "auth"]} />
    </div>

    <!-- Code Convert Logs -->
    <br><br>
    <div>
        <Heading tag="h3" class="ml-0 mb-2 text-xl font-semibold dark:text-white">
            SQL Convert Logs
        </Heading>  
        <Logs data={$userStore} filter={[false, "codeconvert"]} />
    </div>

    <!-- Web Insights Logs -->
    <br><br>
    <div>
        <Heading tag="h3" class="ml-0 mb-2 text-xl font-semibold dark:text-white">
            Web Insights Logs
        </Heading>      
        <Logs data={$userStore} filter={[false, "webinsights"]} />
    </div>

    <!-- Document Insights Logs -->
    <br><br>
    <div>
        <Heading tag="h3" class="ml-0 mb-2 text-xl font-semibold dark:text-white">
            Document Insights Logs
        </Heading>  
        <Logs data={$userStore} filter={[false, "documentinsights"]} />
    </div>
{/if}