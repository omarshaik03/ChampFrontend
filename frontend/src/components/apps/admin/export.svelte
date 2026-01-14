<script lang="ts">
	import '../../../app.css';
	import { Button, Modal } from 'flowbite-svelte';
    import * as XLSX from 'xlsx'; 
    import Logs from './logs.svelte';
	import { ExclamationCircleOutline, UserSolid } from 'flowbite-svelte-icons';
	export let open: boolean = false; // modal control
	import type { PageData } from '../../../routes/$types';
	export let data: PageData;
    export let logs: any[] = [];

	let selectedLogs = {
        authLogs: false,
        docInsightsLogs: false,
        webInsightsLogs: false,
        codeConvertLogs: false
    };


	async function exportLogs() {
        const logsToExport: any[] = [];

        if (selectedLogs.authLogs) {
            console.log("auth selected");
            logsToExport.push(...logs.filter(log => log.application === 'auth'));
            console.log(logs);
        }
        if (selectedLogs.codeConvertLogs) {
            logsToExport.push(...logs.filter(log => log.application === 'codeconvert'));
        }
        if (selectedLogs.webInsightsLogs) {
            logsToExport.push(...logs.filter(log => log.application === 'webinsights'));
        }
        if (selectedLogs.docInsightsLogs) {
            logsToExport.push(...logs.filter(log => log.application === 'docinsights'));
        }

            if (logsToExport.length > 0) {
                const ws = XLSX.utils.json_to_sheet(logsToExport);  // Convert logs to a worksheet
                const wb = XLSX.utils.book_new();  // Create a new workbook
                XLSX.utils.book_append_sheet(wb, ws, "Logs");  // Append the worksheet to the workbook
                XLSX.writeFile(wb, "logs_export.xlsx");  // Export the workbook to an Excel file
                console.log("Exporting logs:", logsToExport);
            } else {
                console.log("No logs selected for export.");
            }
       

	};
</script>

<Modal bind:open size="sm">

	<h3 class="mb-6 text-center text-lg text-gray-500 dark:text-gray-400">
        Please select which logs you want to export:
    </h3>
    <div class="space-y-2">
        <label class="flex items-center space-x-2">
            <input type="checkbox" bind:checked={selectedLogs.authLogs} class="h-4 w-4 text-blue-600" />
            <span class="text-gray-700">User Logs</span>
        </label>
        <label class="flex items-center space-x-2">
            <input type="checkbox" bind:checked={selectedLogs.codeConvertLogs} class="h-4 w-4 text-blue-600" />
            <span class="text-gray-700">Code Convert Logs</span>
        </label>
        <label class="flex items-center space-x-2">
            <input type="checkbox" bind:checked={selectedLogs.webInsightsLogs} class="h-4 w-4 text-blue-600" />
            <span class="text-gray-700">Web Insights Logs</span>
        </label>
        <label class="flex items-center space-x-2">
            <input type="checkbox" bind:checked={selectedLogs.docInsightsLogs} class="h-4 w-4 text-blue-600" />
            <span class="text-gray-700">Document Insights Logs</span>
        </label>
    </div>

	<div class="flex items-center justify-center">
		<Button href="/" color="red" class="mr-2" on:click={exportLogs}>Export</Button>
		<Button color="alternative" on:click={() => (open = false)}>Cancel</Button>
	</div>
</Modal>