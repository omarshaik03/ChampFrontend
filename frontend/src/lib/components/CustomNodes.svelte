<script lang="ts">
	import { Handle, Position, type NodeProps } from "@xyflow/svelte";
	import { onMount, createEventDispatcher } from "svelte";

	let { id, data, isConnectable }: NodeProps = $props();
	let configKeys: string[] = [];
	let configValues: any = {};
	const dispatch = createEventDispatcher();

	// Required fields for node config
	const requiredFields = ["tools", "prompt", "output"];

	onMount(() => {
		if (data && data.config) {
			configKeys = Array.from(new Set([...Object.keys(data.config), ...requiredFields]));
			configValues = { ...requiredFields.reduce((acc, key) => ({ ...acc, [key]: data.config?.[key] ?? "" }), {}), ...data.config };
		}
	});

	function handleFieldChange(key: string, value: string) {
		configValues = { ...configValues, [key]: value };
		if (data && data.config) {
			data.config[key] = value;
		}
		dispatch("update", { id, config: configValues });
	}
</script>

<Handle type="target" position={Position.Left} {isConnectable}/>
<div class="custom-node">
	{#if data.label}
		<div class="node-label">{data.label}</div>
	{/if}
	{#if configKeys.length > 0}
		<div class="config-section">
			<strong>Config:</strong>
			<ul>
				{#each configKeys as key}
					<li>
						<span class="config-key">{key}:</span>
						<input class="config-input" type="text" bind:value={configValues[key]} oninput={(e) => handleFieldChange(key, (e.target as HTMLInputElement)?.value ?? "")} placeholder={requiredFields.includes(key) ? `Required: ${key}` : key} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
<Handle type="source" position={Position.Right} {isConnectable}/>

<style>
.custom-node {
	background: #fff;
	border: 2px solid #333;
	border-radius: 8px;
	padding: 12px 16px;
	min-width: 220px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.node-label {
	font-weight: bold;
	font-size: 1.1em;
	margin-bottom: 6px;
}
.config-section {
	margin-top: 8px;
	font-size: 0.95em;
}
.config-key {
	font-weight: 500;
	color: #222;
	margin-right: 4px;
}
.config-input {
	border: 1px solid #bbb;
	border-radius: 4px;
	padding: 2px 6px;
	font-size: 0.95em;
	margin-left: 2px;
	width: 120px;
}
.config-value {
	color: #555;
}
</style>
