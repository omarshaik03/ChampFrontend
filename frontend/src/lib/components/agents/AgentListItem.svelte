<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import type { Agent } from '$lib/data/agents';

	export let agent: Agent;
	export let onRun: (agent: Agent) => void;
	export let runButtonEnabled: boolean = true;
	export let onEdit: (agent: Agent) => void;
	export let onDelete: () => void;
	export let onShowGraph: (agent: Agent) => void;
	export let onDuplicate: ((agent: Agent) => void) | undefined = undefined;
	export let displayGraphName: string | null = null; // Optional override for graph name

	// Reactive function to get the display graph name that updates on saves
	$: displayName = (() => {
		// Priority: displayGraphName prop > config.graph_name > agent.graph_name
		if (displayGraphName) {
			return displayGraphName;
		}
		if (agent.full_config?.graph_name) {
			return agent.full_config.graph_name;
		}
		return agent.graph_name;
	})();
</script>

<li class="list-group-item d-flex justify-content-between align-items-center">
	<div>
		<h5 class="mb-1">{displayName}</h5>
		<p class="mb-1 text-muted" style="font-size: 0.9rem;">{agent.full_config.description}</p>
	</div>
	<div>
		<Button 
			color={runButtonEnabled ? 'primary' : 'secondary'} 
			size="sm" 
			disabled={!runButtonEnabled}
			on:click={() => runButtonEnabled && onRun(agent)}
		>
			<i class="{runButtonEnabled ? 'bi bi-play-fill' : 'bi bi-pause-fill'} me-1"></i>{runButtonEnabled ? 'Run' : 'Waiting for Input'}
		</Button>
		
		<Button color="secondary" size="sm" on:click={() => onEdit(agent)} class="ms-2">
			<i class="bi bi-pencil-fill me-1"></i>Edit
		</Button>
		
		<Button color="info" size="sm" on:click={() => onShowGraph(agent)} class="ms-2">
			<i class="bi bi-diagram-3 me-1"></i>Graph
		</Button>
		
		{#if onDuplicate}
		<Button color="secondary" size="sm" on:click={() => onDuplicate(agent)} class="ms-2">
			<i class="bi bi-files me-1"></i>Duplicate
		</Button>
		{/if}
		
		<Button color="danger" size="sm" on:click={onDelete} class="ms-2">
			<i class="bi bi-trash me-1"></i>Delete
		</Button>
	</div>
</li>
