<script lang="ts">
	import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@sveltestrap/sveltestrap';
	import type { Agent } from '$lib/data/agents';
	import { AgentService } from '$lib/services/agentService';
	import { onMount } from 'svelte';

	export let isOpen: boolean = false;
	export let agent: Agent | null = null;
	export let onSave: (config: any) => void;
	export let onClose: () => void;

	
	let jsonEditString = "";
	let jsonError = "";
	let validationResult: { isValid: boolean; errors: string[] } | null = null;
	let showValidation = false;

	onMount(() => {
		console.log("AgentEditModal mounted with agent:", agent);
		if (agent) {
			jsonEditString = JSON.stringify(agent.full_config, null, 2);
		}
	});

	function handleSave() {
		try {
			const newConfig = JSON.parse(jsonEditString);
			
			// Validate the configuration before saving
			const validation = AgentService.validateAgentConfig(newConfig);
			if (!validation.isValid) {
				jsonError = `Configuration is invalid:\n${validation.errors.join('\n')}`;
				return;
			}
			
			onSave(newConfig);
			jsonError = "";
			validationResult = null;
			showValidation = false;
		} catch (error) {
			console.error("JSON Parsing Error:", error);
			jsonError = "Invalid JSON format. Please correct and try again.";
		}
	}

	function handleValidate() {
		try {
			const config = JSON.parse(jsonEditString);
			validationResult = AgentService.validateAgentConfig(config);
			showValidation = true;
			jsonError = "";
		} catch (error) {
			console.error("JSON Parsing Error:", error);
			jsonError = "Invalid JSON format. Cannot validate.";
			validationResult = null;
			showValidation = false;
		}
	}
</script>

{#if isOpen && agent}
	<Modal {isOpen} toggle={onClose} size="lg" backdrop="static">
		<ModalHeader toggle={onClose}>Edit Agent Configuration: {agent.graph_name}</ModalHeader>
		<ModalBody>
			<textarea 
				class="form-control" 
				rows="20" 
				bind:value={jsonEditString} 
				style="font-family: monospace; font-size: 0.9rem;"
			></textarea>
			{#if jsonError}
				<p class="text-danger mt-2">{jsonError}</p>
			{/if}
			
			{#if showValidation && validationResult}
				<div class="mt-3">
					{#if validationResult.isValid}
						<div class="alert alert-success">
							<i class="bi bi-check-circle me-2"></i>
							<strong>Configuration is valid!</strong> All required fields and structure are correct.
						</div>
					{:else}
						<div class="alert alert-danger">
							<i class="bi bi-exclamation-triangle me-2"></i>
							<strong>Configuration is invalid:</strong>
							<ul class="mb-0 mt-2">
								{#each validationResult.errors as error}
									<li>{error}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</ModalBody>
		<ModalFooter>
			<Button color="info" on:click={handleValidate}>
				<i class="bi bi-check-circle me-1"></i>Validate Config
			</Button>
			<Button color="primary" on:click={handleSave}>Save Changes</Button>
			<Button color="secondary" on:click={onClose}>Close</Button>
		</ModalFooter>
	</Modal>
{/if}
