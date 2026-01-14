<script lang="ts">
	import { Badge, Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@sveltestrap/sveltestrap';
	import { afterUpdate } from 'svelte';
	import AgentConsoleViewport from './AgentConsoleViewport.svelte';

	export let agentOutput: string = '';
	export let agentStreaming: boolean = false;
	export let streamEvents: any[] = [];
	export let waitingForResume: boolean = false;
	export let resumePrompts: Record<string, { prompt: string; default?: string }> = {};
	export let resumeInputs: Record<string, string> = {};
	export let currentSessionId: string | null = null;
	export let onResumeAgent: () => void;
	export let onCancelResume: () => void;

	let showVerbose = false;
	let inlineConsoleRef: HTMLPreElement | null = null;
	let modalConsoleRef: HTMLPreElement | null = null;
	let resumeModalOpen = false;
	let consoleModalOpen = false;
	let hasAgentOutput = false;
	let consoleStatusLabel = 'Awaiting first run';
	let previousRunActive = false;
	let manualClosedWhileActive = false;

	// Watch for resume state changes to open modal
	$: if (waitingForResume && Object.keys(resumePrompts).length > 0) {
		resumeModalOpen = true;
	}

	// Close modal when no longer waiting for resume
	$: if (!waitingForResume) {
		resumeModalOpen = false;
	}

	// Automatically open the console when a new run starts unless the user has closed it
	$: {
		const runActive = agentStreaming || waitingForResume;

		if (runActive && !previousRunActive && !manualClosedWhileActive) {
			consoleModalOpen = true;
		}

		if (!runActive && previousRunActive) {
			manualClosedWhileActive = false;
		}

		previousRunActive = runActive;
	}

	// Reactive statement to initialize resumeInputs when resumePrompts change
	$: {
		if (resumePrompts && Object.keys(resumePrompts).length > 0) {
			// Create a new object to ensure reactivity
			const newResumeInputs = { ...resumeInputs };
			
			// Initialize inputs for any new targets that don't have inputs yet
			Object.entries(resumePrompts).forEach(([target, promptConfig]) => {
				if (!(target in newResumeInputs)) {
					newResumeInputs[target] = promptConfig.default ?? '';
				}
			});
			
			// Clean up inputs for targets that no longer exist
			Object.keys(newResumeInputs).forEach(target => {
				if (!(target in resumePrompts)) {
					delete newResumeInputs[target];
				}
			});
			
			// Update resumeInputs only if there are actual changes
			if (JSON.stringify(newResumeInputs) !== JSON.stringify(resumeInputs)) {
				resumeInputs = newResumeInputs;
			}
		}
	}

	// Reactive statement for button state debugging
	$: areInputsFilled = (() => {
		const targets = Object.keys(resumePrompts);
		if (targets.length === 0) return false;
		
		// Check if all targets have corresponding inputs and they're not empty
		return targets.every(target => {
			const input = resumeInputs[target];
			return input !== undefined && input.trim().length > 0;
		});
	})();
	
	$: buttonDisabled = !areInputsFilled;
	$: console.log('Resume state:', { 
		resumePrompts, 
		resumeInputs, 
		areInputsFilled,
		buttonDisabled, 
		targetsCount: Object.keys(resumePrompts).length,
		inputsCount: Object.keys(resumeInputs).length 
	});

	afterUpdate(() => {
		[inlineConsoleRef, modalConsoleRef].forEach((target) => {
			if (target) {
				target.scrollTop = target.scrollHeight;
			}
		});
	});

	$: hasAgentOutput = Boolean(agentOutput && agentOutput.trim().length > 0);
	$: consoleStatusLabel = agentStreaming
		? 'Agent run in progress'
		: waitingForResume
			? 'Agent waiting for input'
			: hasAgentOutput
				? 'Last run output available'
				: 'Awaiting first run';

	function openConsole() {
		consoleModalOpen = true;
		manualClosedWhileActive = false;
	}

	function handleToggleConsole() {
		const runActive = agentStreaming || waitingForResume;

		if (consoleModalOpen) {
			consoleModalOpen = false;
			if (runActive) {
				manualClosedWhileActive = true;
			}
		} else {
			consoleModalOpen = true;
			manualClosedWhileActive = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && areInputsFilled) {
			onResumeAgent();
		}
	}

	function handleCancel() {
		resumeModalOpen = false;
		if (typeof onCancelResume === 'function') {
			onCancelResume();
		}
	}

</script>

{#if !consoleModalOpen}
	<div class="inline-console mt-3">
		<div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
			<h6 class="mb-0">Agent Output Console</h6>
			<div class="d-flex align-items-center gap-2">
				<div class="form-check form-switch m-0">
					<input
						id="inline-showVerbose"
						type="checkbox"
						bind:checked={showVerbose}
						class="form-check-input"
					/>
					<label for="inline-showVerbose" class="form-check-label small">
						Show raw events
					</label>
				</div>
				<Button color={agentStreaming ? 'warning' : 'secondary'} outline size="sm" on:click={openConsole}>
					<i class="bi bi-arrows-fullscreen me-1"></i>
					Open in modal
				</Button>
				<Badge color={agentStreaming ? 'warning' : waitingForResume ? 'info' : hasAgentOutput ? 'success' : 'secondary'} pill>
					{consoleStatusLabel}
				</Badge>
				{#if currentSessionId}
					<code class="session-pill">Session: {currentSessionId}</code>
				{/if}
			</div>
		</div>

		<AgentConsoleViewport
			bind:scrollEl={inlineConsoleRef}
			{showVerbose}
			{streamEvents}
			{agentOutput}
			{agentStreaming}
			{waitingForResume}
		/>
	</div>
{/if}

<Modal
	class="agent-console-modal"
	isOpen={consoleModalOpen}
	toggle={handleToggleConsole}
	size="xl"
>
	<ModalHeader toggle={handleToggleConsole}>
		<i class="bi bi-terminal-fill text-primary me-2"></i>
		<span>Agent Output Console</span>
		<Badge color={agentStreaming ? 'warning' : waitingForResume ? 'info' : hasAgentOutput ? 'success' : 'secondary'} pill class="ms-2">
			{consoleStatusLabel}
		</Badge>
		<div class="form-check form-switch ms-auto">
			<input
				id="modal-showVerbose"
				type="checkbox"
				bind:checked={showVerbose}
				class="form-check-input"
			/>
			<label for="modal-showVerbose" class="form-check-label small">
				Show raw events
			</label>
		</div>
	</ModalHeader>
	<ModalBody>

		<AgentConsoleViewport
			bind:scrollEl={modalConsoleRef}
			{showVerbose}
			{streamEvents}
			{agentOutput}
			{agentStreaming}
			{waitingForResume}
		/>
	</ModalBody>
	<ModalFooter class="justify-content-between flex-wrap gap-2">
		<small class="text-muted">
			<i class="bi bi-info-circle me-1"></i>
			{consoleStatusLabel}
		</small>

		<Button color="secondary" size="sm" on:click={handleToggleConsole}>
			<i class="bi bi-x-circle me-2"></i>
			Close Console
		</Button>
	</ModalFooter>
</Modal>

<!-- Resume Modal -->
<Modal isOpen={resumeModalOpen} toggle={() => {}} backdrop="static" keyboard={false} size="lg">
	<ModalHeader>
		<div class="d-flex align-items-center">
			<i class="bi bi-chat-square-text-fill me-2 text-primary"></i>
			Agent Input Required
		</div>
	</ModalHeader>
	<ModalBody>
		<div class="alert alert-info d-flex align-items-center">
			<i class="bi bi-info-circle-fill me-2"></i>
			<div>
				The agent execution has been paused and requires your input to continue.
				Please provide the requested information below.
			</div>
		</div>
		
		{#each Object.entries(resumePrompts) as [target, promptConfig], index}
			<div class="mb-4">
				<Label for="input-{target}" class="form-label fw-bold text-primary">
					<i class="bi bi-arrow-right-circle me-1"></i>
					{target}
				</Label>
				<div class="prompt-text p-2 mb-2 bg-light border-start border-primary border-3">
					<small class="text-muted">{promptConfig.prompt}</small>
				</div>
				<Input 
					id="input-{target}"
					type="text" 
					bind:value={resumeInputs[target]}
					placeholder="Enter your response..." 
					class="form-control-lg"
					on:keypress={handleKeyPress}
				/>
			</div>
		{/each}
		
		{#if currentSessionId}
			<div class="mt-3 p-2 bg-light rounded">
				<small class="text-muted">
					<i class="bi bi-tag me-1"></i>
					Session ID: <code>{currentSessionId}</code>
				</small>
			</div>
		{/if}
	</ModalBody>
	<ModalFooter>
		<Button 
			color="secondary"
			size="lg"
			outline
			on:click={handleCancel}
			class="px-4"
		>
			<i class="bi bi-x-circle me-2"></i>
			Cancel
		</Button>
		<Button 
			color="primary" 
			size="lg"
			on:click={onResumeAgent} 
			disabled={buttonDisabled}
			class="px-4"
		>
			<i class="bi bi-play-fill me-2"></i>
			Continue Agent Execution
		</Button>
	</ModalFooter>
</Modal>

<style>
	/* Modal styles */
	:global(.agent-console-modal .modal-dialog) {
		max-width: 960px;
		margin-top: 2rem;
	}

	.inline-console {
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		padding: 1rem;
		background: #ffffff;
	}

	.session-pill {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background-color: #212529;
		color: #f8f9fa;
		border-radius: 9999px;
	}

	.prompt-text {
		font-style: italic;
		line-height: 1.4;
	}

	:global(.form-control-lg) {
		font-size: 1rem;
		border-radius: 8px;
		border: 2px solid #e9ecef;
		transition: all 0.2s ease-in-out;
	}

	:global(.form-control-lg:focus) {
		border-color: #0d6efd;
		box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
		transform: translateY(-1px);
	}

	:global(.alert-info) {
		border-left: 4px solid #0dcaf0;
		background-color: #e7f3ff;
		border-color: #b3d9ff;
	}
</style>
