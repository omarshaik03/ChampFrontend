<script lang="ts">
	import { 
		Card, 
		CardHeader, 
		CardBody, 
		CardFooter, 
		Button, 
		Input, 
		Pagination, 
		PaginationItem, 
		PaginationLink,
		Row,
		Col,
		Badge,
		Alert,
		Modal,
		ModalHeader,
		ModalBody,
		ModalFooter
	} from '@sveltestrap/sveltestrap';
	import { SvelteFlow, Controls, Background, MiniMap, Panel } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import AgentListItem from './AgentListItem.svelte';
	import AgentEditModal from './AgentEditModal.svelte';
	import AgentConsole from './AgentConsole.svelte';
	import { updateInlineGraph, parseAgentConfig } from '../AgentGraphUtils';
	import AgentGraphModal from '../AgentGraphModal.svelte';
	import { defaultAgents, type Agent } from '$lib/data/agents';
	import { AgentService } from '$lib/services/agentService';
	import { AgentCrudService } from '$lib/services/agent_crud';
	import { toasts } from '../../stores/toastStore';
	import { userStore } from '../../stores/userStore';
	import { llmConfigStore, type LlmConfig } from '$lib/stores/llmConfigStore';
	import LlmConfigSelector from '../llm-config/LlmConfigSelector.svelte';

	// Constants
	const AGENTS_PER_PAGE = 5;
	const TOAST_MESSAGES = {
		AGENT_UPDATED: 'updated successfully!',
		AGENT_DELETED: 'deleted.',
		AGENT_CREATED: 'created. You can now edit its JSON.',
		AGENT_ALREADY_RUNNING: 'is already running.',
		AGENT_RUN_ATTEMPT: 'Attempting to run agent:',
		AGENT_COMPLETE: 'Agent execution completed!',
		AGENT_INTERRUPTED: 'Agent paused - waiting for user input to continue.',
		AGENT_CANCELLED: 'Agent input cancelled. Execution halted.',
		AGENT_ERROR: 'Agent execution failed:',
		NO_SESSION: 'No active session to resume.',
		RESUME_REQUIRED: 'Please provide input for all required fields to resume the agent execution.'
	} as const;

	// LLM management - now using configuration store
    let selectedLlmConfig: LlmConfig | null
    llmConfigStore.activeConfig.subscribe(
        (config) => {
            selectedLlmConfig = config;
        }
    );

	// Agent management state
	let agents: Agent[] = [...defaultAgents];
	let isEditModalOpen = false;
	let selectedAgentForEdit: Agent | null = null;
	let isGraphModalOpen = false;
	let selectedAgentForGraph: Agent | null = null;
	let isNameModalOpen = false;
	let newAgentName = '';
	let nameInputError = '';

	// Get user ID from store
	$: currentUser = $userStore;
	$: userId = currentUser?.id ? (typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id) : null;
	$: userIsAuthenticated = userId !== null && !isNaN(userId);

	// Load agents from backend on component mount
	async function loadAgentsFromBackend() {
		if (!userIsAuthenticated) {
			console.log('User not authenticated, skipping backend agent load');
			return;
		}

		try {
			const backendAgents = await AgentCrudService.loadUserAgents(userId!);
			console.log(`🔍 loadAgentsFromBackend: Received ${backendAgents.length} agents from backend for user ${userId}`);
			console.log('🔍 Backend agents:', backendAgents.map(a => ({ 
				graph_name: a.graph_name, 
				config_id: a.config_id 
			})));
			
			// Always start with all backend agents (they have config_id)
			// Then add default agents that don't conflict by graph_name
			const backendAgentNames = new Set(backendAgents.map(agent => agent.graph_name));
			const nonConflictingDefaultAgents = defaultAgents.filter(defaultAgent => 
				!backendAgentNames.has(defaultAgent.graph_name)
			);
			
			agents = [...backendAgents, ...nonConflictingDefaultAgents];
			
			// Reset pagination to page 1 if current page is now invalid
			const newTotalPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
			if (agentsCurrentPage > newTotalPages) {
				agentsCurrentPage = 1;
			}
			
			console.log(`✅ Final agent list: ${agents.length} total (${backendAgents.length} backend + ${nonConflictingDefaultAgents.length} non-conflicting default agents)`);
		} catch (error: any) {
			console.warn('Failed to load agents from backend:', error);
			// Don't show error toast on initial load, just log it
			// Users can manually refresh if needed
		}
	}

	// Load agents when component mounts
	// Also reload when userId changes (user logs in/out)
	$: if (userIsAuthenticated) {
		loadAgentsFromBackend();
	}

	// Function to manually refresh agents from backend
	async function refreshAgentsFromBackend() {
		if (!userIsAuthenticated) {
			toasts.push({
				message: 'Please log in to refresh agents from backend',
				color: 'warning',
				header: 'Authentication Required'
			});
			return;
		}

		try {
			const backendAgents = await AgentCrudService.loadUserAgents(userId!);
			console.log(`🔄 refreshAgentsFromBackend: Received ${backendAgents.length} agents from backend for user ${userId}`);
			console.log('🔄 Backend agents:', backendAgents.map(a => ({ 
				graph_name: a.graph_name, 
				config_id: a.config_id 
			})));
			
			// Always start with all backend agents (they have config_id)
			// Then add default agents that don't conflict by graph_name
			const backendAgentNames = new Set(backendAgents.map(agent => agent.graph_name));
			const nonConflictingDefaultAgents = defaultAgents.filter(defaultAgent => 
				!backendAgentNames.has(defaultAgent.graph_name)
			);
			
			agents = [...backendAgents, ...nonConflictingDefaultAgents];
			
			// Reset pagination to page 1 if current page is now invalid
			const newTotalPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
			if (agentsCurrentPage > newTotalPages) {
				agentsCurrentPage = 1;
			}
			
			console.log(`✅ Refresh complete: ${agents.length} total agents (${backendAgents.length} backend + ${nonConflictingDefaultAgents.length} non-conflicting default)`);
			
			toasts.push({
				message: `Refreshed ${backendAgents.length} agents from backend`,
				color: 'success',
				header: 'Agents Refreshed'
			});
		} catch (error: any) {
			console.error('Failed to refresh agents from backend:', error);
			toasts.push({
				message: `Failed to refresh agents: ${error.message}`,
				color: 'danger',
				header: 'Refresh Failed'
			});
		}
	}

	// Function to duplicate an agent
	async function handleDuplicateAgent(agent: Agent) {
		if (!userIsAuthenticated) {
			toasts.push({
				message: 'Please log in to duplicate agents',
				color: 'warning',
				header: 'Authentication Required'
			});
			return;
		}

		try {
			if (agent.config_id) {
				// Duplicate from backend using config_id
				const result = await AgentCrudService.duplicateAgent(
					userId!, 
					agent.config_id,
					undefined,
					currentUser?.name,
					currentUser?.email
				);
				if (result.status === 'success') {
					// Refresh agents to show the newly duplicated agent
					await refreshAgentsFromBackend();
					toasts.push({
						message: `Agent '${agent.graph_name}' duplicated successfully`,
						color: 'success',
						header: 'Agent Duplicated'
					});
				} else {
					throw new Error(result.detail || 'Failed to duplicate agent');
				}
			} else {
				// Create local duplicate and save to backend
				const duplicatedAgent = {
					...agent,
					graph_name: `${agent.graph_name}_copy_${Date.now()}`,
					full_config: {
						...agent.full_config,
						graph_name: `${agent.graph_name}_copy_${Date.now()}`
					}
				};
				
				// Save to backend first, then refresh
				const result = await AgentCrudService.saveAgent(
					userId!, 
					duplicatedAgent, 
					`Copy of ${agent.description}`,
					currentUser?.name,
					currentUser?.email
				);
				
				if (result.status === 'success') {
					// Refresh agents to show the newly created duplicate
					await refreshAgentsFromBackend();
					toasts.push({
						message: `Agent '${agent.graph_name}' duplicated successfully`,
						color: 'success',
						header: 'Agent Duplicated'
					});
				} else {
					throw new Error(result.detail || 'Failed to save duplicated agent');
				}
			}
		} catch (error: any) {
			console.error('Failed to duplicate agent:', error);
			toasts.push({
				message: `Failed to duplicate agent: ${error.message}`,
				color: 'danger',
				header: 'Duplication Failed'
			});
		}
	}

	// Helper function to save a new agent to backend
	async function handleSaveNewAgentToBackend(agent: Agent) {
		if (!userIsAuthenticated) {
			throw new Error('User not authenticated');
		}

		try {
			const result = await AgentCrudService.saveAgent(
				userId!, 
				agent, 
				agent.description,
				currentUser?.name,
				currentUser?.email
			);
			if (result.status === 'success') {
				agent.config_id = result.config_id; // Assign config_id from backend response
				console.log('✅ Agent saved with config_id:', { 
					graph_name: agent.graph_name, 
					config_id: agent.config_id 
				});
				agents = [...agents, agent];
				toasts.push({
					message: `Agent '${agent.graph_name}' saved successfully`,
					color: 'success',
					header: 'Agent Saved'
				});
			} else {
				throw new Error(result.detail || 'Failed to save agent');
			}
		} catch (error: any) {
			throw error;
		}
	}

	// Agent execution state
	let agentOutput = '';
	let agentStreaming = false;
	let currentAgent: Agent | null = null;
	let streamEvents: any[] = [];
	let currentSessionId: string | null = null;
	let waitingForResume = false;
	let resumePrompts: Record<string, { prompt: string; default?: string }> = {};
	let resumeInputs: Record<string, string> = {};

	// Graph visualization state
	let showInlineGraph = false;
	let graphNodes: any[] = [];
	let graphEdges: any[] = [];
	let graphError: string | null = null;
	let graphExecutionPath: string[] = [];
	let showExecutionOnly = false;

	// Pagination state
	let agentsCurrentPage = 1;
	$: totalAgentPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
	$: paginatedAgents = agents.slice(
		(agentsCurrentPage - 1) * AGENTS_PER_PAGE, 
		agentsCurrentPage * AGENTS_PER_PAGE
	);

	// Debug pagination whenever it changes
	$: if (agents.length > 0) {
		console.log(`📄 Pagination Debug:`, {
			totalAgents: agents.length,
			agentsPerPage: AGENTS_PER_PAGE,
			currentPage: agentsCurrentPage,
			totalPages: totalAgentPages,
			paginatedAgentsCount: paginatedAgents.length,
			startIndex: (agentsCurrentPage - 1) * AGENTS_PER_PAGE,
			endIndex: agentsCurrentPage * AGENTS_PER_PAGE,
			paginatedAgents: paginatedAgents.map(a => ({ 
				graph_name: a.graph_name, 
				config_id: a.config_id 
			}))
		});
	}

	$: if (currentAgent) {
		console.log(`📄 Current Agent Debug:`, {
			graph_name: currentAgent.graph_name,
			config_id: currentAgent.config_id,
			running: currentAgent.running
		});
	}

	// Update inline graph when execution events change
	$: if (currentAgent && showInlineGraph && streamEvents.length > 0) {
		const result = updateInlineGraph(currentAgent, streamEvents);
		graphNodes = result.nodes;
		graphEdges = result.edges;
		graphError = result.error;
		graphExecutionPath = result.executionPath;
	}

	// Update inline graph when showExecutionOnly toggle changes
	$: if (currentAgent && showInlineGraph) {
		const { nodes: parsedNodes, edges: parsedEdges } = parseAgentConfig(currentAgent.full_config, graphExecutionPath, showExecutionOnly);
		graphNodes = parsedNodes;
		graphEdges = parsedEdges;
	}

	// Helper function to reset execution state
	function resetExecutionState() {
		agentOutput = '';
		streamEvents = [];
		agentStreaming = false;
		waitingForResume = false;
		currentSessionId = null;
		resumePrompts = {};
		resumeInputs = {};
		showInlineGraph = false;
		graphNodes = [];
		graphEdges = [];
		graphError = null;
		graphExecutionPath = [];
		showExecutionOnly = false;
		if (currentAgent) {
			currentAgent.running = false;
			currentAgent = null;
		}
		agents = [...agents]; // Trigger reactivity
	}

	// Helper function to create request bodies for agent operations
	function createAgentRequest(operation: 'execute' | 'resume', data: any, sessionId?: string | null) {
		const baseRequest = {
			operation,
			metadata: {}
		};

		if (operation === 'execute') {
			return {
				...baseRequest,
				graph_config: data,
				input_data: {}
			};
		} else {
			return {
				...baseRequest,
				session_id: sessionId,
				resume_data: data
			};
		}
	}

	// Helper function to validate resume inputs
	function validateResumeInputs(): boolean {
		const targets = Object.keys(resumePrompts);
		return targets.length > 0 && targets.every(target => resumeInputs[target]?.trim());
	}

	// Helper function to create response data for resume operations
	function createResumeResponseData(): Record<string, string> {
		const targets = Object.keys(resumePrompts);
		const responseData: Record<string, string> = {};
		
		targets.forEach(target => {
			responseData[target] = (resumeInputs[target] ?? '').trim();
		});

		return responseData;
	}

	// Modal management functions
	function openEditModal(agent: Agent) {
		selectedAgentForEdit = agent;
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		selectedAgentForEdit = null;
	}

	function openGraphModal(agent: Agent) {
		selectedAgentForGraph = agent;
		isGraphModalOpen = true;
	}

	function closeGraphModal() {
		isGraphModalOpen = false;
		selectedAgentForGraph = null;
	}

	function openNameModal() {
		newAgentName = '';
		nameInputError = '';
		isNameModalOpen = true;
	}

	function closeNameModal() {
		isNameModalOpen = false;
		newAgentName = '';
		nameInputError = '';
	}

	function validateAgentName(name: string): string {
		if (!name.trim()) {
			return 'Agent name is required';
		}
		if (name.trim().length < 2) {
			return 'Agent name must be at least 2 characters long';
		}
		if (name.trim().length > 50) {
			return 'Agent name must be less than 50 characters';
		}
		// Check if name already exists
		const existingAgent = agents.find(agent => 
			agent.graph_name.toLowerCase() === name.trim().toLowerCase()
		);
		if (existingAgent) {
			return 'An agent with this name already exists';
		}
		return '';
	}

	// Agent CRUD operations
	async function handleSaveAgentChanges(newConfig: any) {
		if (!selectedAgentForEdit) return;
		
		if (!userIsAuthenticated) {
			toasts.push({
				message: 'Please log in to save agent changes',
				color: 'warning',
				header: 'Authentication Required'
			});
			return;
		}
		
		const agentIndex = agents.findIndex(a => a.config_id === selectedAgentForEdit!.config_id);
		if (agentIndex !== -1) {
			// Update local state immediately for responsive UI
			agents[agentIndex].full_config = newConfig;
			agents = [...agents]; // Trigger Svelte reactivity
			
			try {
				// Save to backend
				const updatedAgent = { ...selectedAgentForEdit, full_config: newConfig };
				
				const result = await AgentCrudService.updateAgent(
					userId!,
					updatedAgent,
					selectedAgentForEdit.description,
					currentUser?.name,
					currentUser?.email
				);
				
				if (result.status === 'success') {
					toasts.push({
						message: `Agent '${selectedAgentForEdit!.graph_name}' ${TOAST_MESSAGES.AGENT_UPDATED}`,
						color: 'success',
						header: 'Agent Updated'
					});
				} else {
					throw new Error(result.detail || 'Failed to save agent');
				}
			} catch (error: any) {
				console.error('Failed to save agent to backend:', error);
				toasts.push({
					message: `Failed to save agent to backend: ${error.message}`,
					color: 'warning',
					header: 'Save Warning'
				});
			}
			
			closeEditModal();
		}
	}

	async function handleDeleteAgent(config_id: string) {
		console.log('🗑️ handleDeleteAgent called with config_id:', config_id, 'type:', typeof config_id);
		console.log('🗑️ All agents:', agents.map(a => ({ 
			graph_name: a.graph_name, 
			config_id: a.config_id, 
			config_id_type: typeof a.config_id,
			config_id_str: a.config_id?.toString()
		})));
		
		if (!config_id || config_id === 'undefined' || config_id === '') {
			console.error('❌ Invalid config_id provided:', config_id);
			
			// For default agents without config_id, just delete locally
			toasts.push({
				message: 'Agent deleted locally (no backend ID)',
				color: 'info',
				header: 'Agent Deleted'
			});
			return;
		}

		const agentToDelete = agents.find(a => a.config_id?.toString() === config_id);
		console.log('🗑️ Delete request for agent:', { 
			config_id, 
			agentToDelete: agentToDelete ? {
				graph_name: agentToDelete.graph_name,
				config_id: agentToDelete.config_id,
				has_config_id: !!agentToDelete.config_id
			} : null,
			userIsAuthenticated, 
			userId,
			currentUser: currentUser ? {
				id: currentUser.id,
				name: currentUser.name,
				email: currentUser.email
			} : null
		});
		
		if (!agentToDelete) {
			console.error('❌ Agent not found with config_id:', config_id);
			toasts.push({
				message: 'Agent not found for deletion',
				color: 'danger',
				header: 'Delete Failed'
			});
			return;
		}
		
		// Remove from local state immediately for responsive UI
		agents = agents.filter(a => a.config_id?.toString() !== config_id);
		
		// If this is a backend-persisted agent and user is logged in, delete from backend
		if (userIsAuthenticated && agentToDelete.config_id) {
			console.log(`🔄 Attempting backend deletion for config_id: ${agentToDelete.config_id}`);
			try {
				const result = await AgentCrudService.deleteAgent(parseInt(config_id));
				console.log('🔄 Delete result:', result);
				if (result.status === 'success') {
					console.log('✅ Successfully deleted agent from backend:', result.message);
					toasts.push({
						message: `Agent '${agentToDelete.graph_name}' ${TOAST_MESSAGES.AGENT_DELETED}`,
						color: 'success',
						header: 'Agent Deleted'
					});
				} else {
					console.warn('⚠️ Failed to delete agent from backend:', result.detail);
					toasts.push({
						message: `Agent deleted locally but backend deletion failed: ${result.detail}`,
						color: 'warning',
						header: 'Delete Warning'
					});
				}
			} catch (error: any) {
				console.error('💥 Failed to delete agent from backend:', error);
				toasts.push({
					message: `Agent deleted locally but backend deletion failed: ${error.message}`,
					color: 'warning',
					header: 'Delete Warning'
				});
			}
		} else {
			console.log('❌ Skipping backend delete because user not authenticated or agent has no config_id');
			toasts.push({
				message: 'Agent deleted locally. Please log in to delete from backend.',
				color: 'warning',
				header: 'Authentication Required'
			});
		}
	}

	// Handle deletion of local agents (without config_id)
	function handleDeleteLocalAgent(graphName: string) {
		console.log('🗑️ Deleting local agent:', graphName);
		agents = agents.filter(a => a.graph_name !== graphName);
		toasts.push({
			message: `Agent '${graphName}' deleted locally`,
			color: 'info',
			header: 'Agent Deleted'
		});
	}

	async function handleCreateNewAgent() {
		openNameModal();
	}

	async function createAgentWithName() {
		const trimmedName = newAgentName.trim();
		console.log('🏷️ Creating agent with name:', { 
			originalName: newAgentName, 
			trimmedName: trimmedName 
		});
		
		const validationError = validateAgentName(trimmedName);
		
		if (validationError) {
			nameInputError = validationError;
			return;
		}

		closeNameModal();
		
		const newAgent = AgentService.createNewAgentTemplate(trimmedName);
		console.log('📦 Created agent object:', { 
			graph_name: newAgent.graph_name, 
			full_config_graph_name: newAgent.full_config?.graph_name,
			description: newAgent.description 
		});
		
		// Only save to backend if user is logged in
		if (userIsAuthenticated) {
			try {
				// Save to backend first
				const result = await AgentCrudService.saveAgent(
					userId!,
					newAgent,
					newAgent.description,
					currentUser?.name,
					currentUser?.email
				);
				
				if (result.status === 'success') {
					console.log('✅ New agent created with config_id:', result.config_id);
					
					// Refresh agents to show the newly created agent with proper config_id
					await refreshAgentsFromBackend();
					
					toasts.push({
						message: `Agent '${newAgent.graph_name}' ${TOAST_MESSAGES.AGENT_CREATED}`,
						color: 'success',
						header: 'Agent Created'
					});
					
					// Navigate to the last page to show the new agent
					agentsCurrentPage = Math.ceil(agents.length / AGENTS_PER_PAGE);
				} else {
					throw new Error(result.detail || 'Failed to save agent');
				}
			} catch (error: any) {
				console.error('Failed to save new agent to backend:', error);
				
				// Add to local state as fallback
				agents = [...agents, newAgent];
				agentsCurrentPage = Math.ceil(agents.length / AGENTS_PER_PAGE);
				
				toasts.push({
					message: `Agent created locally but backend save failed: ${error.message}`,
					color: 'warning',
					header: 'Save Warning'
				});
			}
		} else {
			// Add to local state only if not authenticated
			agents = [...agents, newAgent];
			agentsCurrentPage = Math.ceil(agents.length / AGENTS_PER_PAGE);
			
			toasts.push({
				message: `Agent '${newAgent.graph_name}' created locally. Please log in to save to backend.`,
				color: 'warning',
				header: 'Agent Created (Local Only)'
			});
		}
	}

	// Agent execution functions
	async function handleRunAgent(agent: Agent) {
		console.log("Running agent with config:", agent.full_config);
		
		if (agent.running) {
			toasts.push({
				message: `Agent '${agent.graph_name}' ${TOAST_MESSAGES.AGENT_ALREADY_RUNNING}`,
				color: 'warning',
				header: 'Agent Already Running'
			});
			return;
		}

		// Validate agent configuration before execution
		const validation = AgentService.validateAgentConfig(agent.full_config);
		if (!validation.isValid) {
			toasts.push({
				message: `Agent configuration is invalid: ${validation.errors.join(', ')}`,
				color: 'danger',
				header: 'Invalid Configuration'
			});
			return;
		}

		agent.running = agentStreaming = true;
		agentOutput = '';
		streamEvents = [];
		currentAgent = agent;
		waitingForResume = false;
		currentSessionId = null;
		resumePrompts = {};
		resumeInputs = {};

		const result = updateInlineGraph(agent, streamEvents);
		graphNodes = result.nodes;
		graphEdges = result.edges;
		graphError = result.error;
		graphExecutionPath = result.executionPath;
		showInlineGraph = true;
		toasts.push({
			message: `${TOAST_MESSAGES.AGENT_RUN_ATTEMPT} ${agent.graph_name}`,
			color: 'info',
			header: 'Agent Run'
		});

		await executeAgentRequest(createAgentRequest('execute', agent.full_config));
	}

	async function handleResumeAgent() {
		if (!currentSessionId) {
			toasts.push({
				message: TOAST_MESSAGES.NO_SESSION,
				color: 'warning',
				header: 'Resume Required'
			});
			return;
		}

		if (!validateResumeInputs()) {
			toasts.push({
				message: TOAST_MESSAGES.RESUME_REQUIRED,
				color: 'warning',
				header: 'Resume Required'
			});
			return;
		}

		const requestBody = createAgentRequest('resume', createResumeResponseData(), currentSessionId);
		resumeInputs = {};
		await executeAgentRequest(requestBody);
	}

	function handleCancelResume() {
		const cancellationMessage = '[Info]: Agent resume cancelled by user.';
		agentOutput = agentOutput ? `${agentOutput}\n${cancellationMessage}` : cancellationMessage;
		waitingForResume = false;
		agentStreaming = false;
		currentSessionId = null;
		resumePrompts = {};
		resumeInputs = {};
		if (currentAgent) {
			currentAgent.running = false;
		}
		agents = [...agents];
		toasts.push({
			message: TOAST_MESSAGES.AGENT_CANCELLED,
			color: 'warning',
			header: 'Agent Cancelled'
		});
	}

	async function executeAgentRequest(requestBody: any) {
		try {
			const responseBody = await AgentService.executeAgentRequest(requestBody);
			if (!responseBody) throw new Error('No response body');
			
			await processStreamResponse(responseBody);
			handleExecutionCompletion();
		} catch (err: any) {
			// Immediately reset execution state for any error (including HTTP errors)
			handleExecutionError(err);
		}
	}

	async function processStreamResponse(responseBody: ReadableStream<Uint8Array>) {
		const reader = responseBody.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let done = false;
		
		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			
			if (value) {
				buffer += decoder.decode(value, { stream: true });
				buffer = processStreamBuffer(buffer);
			}
		}
		
		// Process any remaining buffer content
		if (buffer.trim()) {
			processStreamBuffer(buffer);
		}
	}

	function processStreamBuffer(buffer: string): string {
		const newEvents = AgentService.parseSSEEvents(buffer);
		if (newEvents.length > 0) {
			streamEvents = [...streamEvents, ...newEvents];
			agentOutput = AgentService.parseAgentOutput(
				streamEvents,
				(id) => currentSessionId = id,
				(waiting) => waitingForResume = waiting,
				(prompts) => resumePrompts = prompts
			);
			
			// Return remaining buffer content after processing
			const lastEventEnd = buffer.lastIndexOf('\n\n');
			return lastEventEnd !== -1 ? buffer.substring(lastEventEnd + 2) : '';
		}
		return buffer;
	}

	function handleExecutionCompletion() {
		if (!waitingForResume) {
			if (currentAgent) {
				currentAgent.running = false;
			}
			toasts.push({
				message: TOAST_MESSAGES.AGENT_COMPLETE,
				color: 'success',
				header: 'Agent Complete'
			});
		} else {
			toasts.push({
				message: TOAST_MESSAGES.AGENT_INTERRUPTED,
				color: 'info',
				header: 'Agent Interrupted'
			});
		}
	}

	function handleExecutionError(err: any) {
		// First, reset all execution state
		resetExecutionState();
		
		// Then add the error message to output and show toast
		agentOutput += `\n[Error]: ${err.message}`;
		toasts.push({
			message: `${TOAST_MESSAGES.AGENT_ERROR} ${err.message}`,
			color: 'danger',
			header: 'Agent Error'
		});
	}

	// Agent validation function
	function handleValidateAgent(agent: Agent, validationResult: { isValid: boolean; errors: string[] }) {
		if (validationResult.isValid) {
			toasts.push({
				message: `Agent "${agent.graph_name}" configuration is valid.`,
				color: 'success',
				header: 'Validation Passed'
			});
		} else {
			toasts.push({
				message: `Agent "${agent.graph_name}" configuration is invalid:\n${validationResult.errors.join('\n')}`,
				color: 'danger',
				header: 'Validation Failed'
			});
		}
	}

	// Pagination function
	function goToAgentPage(page: number) {
		if (page >= 1 && page <= totalAgentPages) {
			agentsCurrentPage = (agents.length > 0 || page === 1) ? page : agentsCurrentPage;
		}
	}
</script>

<div class="tab-pane fade show active">
	<Card class="mb-4">
		<CardHeader>
			<div class="d-flex mt-2 mt-md-0">
				<Button color="success" size="sm" on:click={handleCreateNewAgent} class="flex-shrink-0 me-2">
					<i class="bi bi-plus-circle-fill me-1"></i>Create New Agent
				</Button>
				<Button 
					color="info" 
					size="sm" 
					on:click={refreshAgentsFromBackend} 
					class="flex-shrink-0 me-2"
					disabled={!userIsAuthenticated}
				>
					<i class="bi bi-arrow-clockwise me-1"></i>Refresh
				</Button>

				<div class="m-1">
					<LlmConfigSelector
						placeholder="Select LLM configuration"
					/>
				</div>

				{#if !userIsAuthenticated}
					<Badge color="warning" class="me-2 align-self-center">
						<i class="bi bi-exclamation-triangle me-1"></i>Not logged in - backend features disabled
					</Badge>
				{:else if currentUser}
					<Badge color="success" class="me-2 align-self-center">
						<i class="bi bi-person-check me-1"></i>Logged in as {currentUser.name}
					</Badge>
				{/if}
				<div class="input-group w-100 w-md-auto">
					<span class="input-group-text"><i class="bi bi-search"></i></span>
					<Input type="text" placeholder="Search agents..." />
					<Button outline color="secondary" disabled><i class="bi bi-funnel-fill me-1"></i>Filters</Button>
				</div>
			</div>
		</CardHeader>
		<CardBody>
			{#if agents.length > 0}
				<ul class="list-group mb-3">
					{#each paginatedAgents as agent (agent.config_id || agent.graph_name)}
						<AgentListItem 
							{agent} 
							onRun={handleRunAgent}
							runButtonEnabled={((currentAgent && currentAgent.running) || !waitingForResume) === true}
							onEdit={openEditModal}
							onDelete={() => {
								if (agent.config_id) {
									handleDeleteAgent(agent.config_id.toString());
								} else {
									handleDeleteLocalAgent(agent.graph_name);
								}
							}}
							onShowGraph={openGraphModal}
							onDuplicate={handleDuplicateAgent}
						/>
					{/each}
				</ul>
			{:else}
				<p class="text-center text-muted mb-3">No agents configured yet.</p>
			{/if}
			
			<AgentConsole 
				{agentOutput}
				{agentStreaming}
				{streamEvents}
				{waitingForResume}
				{resumePrompts}
				bind:resumeInputs
				{currentSessionId}
				onResumeAgent={handleResumeAgent}
				onCancelResume={handleCancelResume}
			/>

			<!-- Inline Graph Visualization -->
			{#if showInlineGraph}
				<Card class="mt-4">
					<CardHeader>
						<Row>
							<Col>
								<h5 class="mb-0">
									<i class="bi bi-diagram-3 me-2"></i>
									Agent Workflow Graph
									{#if currentAgent}
										- {currentAgent.graph_name}
									{/if}
								</h5>
								{#if graphExecutionPath.length > 0}
									<small class="text-muted">
										Execution Path: {graphExecutionPath.join(' → ')}
									</small>
								{/if}
							</Col>
							<Col xs="auto">
								<div class="d-flex gap-2">
									<Badge color="info">{graphNodes.length} nodes</Badge>
									<Badge color="secondary">{graphEdges.length} edges</Badge>
									{#if graphExecutionPath.length > 0}
										<Badge color="success">{graphExecutionPath.length} executed</Badge>
									{/if}
									<Button 
										size="sm" 
										color="outline-secondary" 
										on:click={() => showInlineGraph = false}
									>
										<i class="bi bi-x"></i> Hide Graph
									</Button>
								</div>
							</Col>
						</Row>
					</CardHeader>
					<CardBody>
						{#if graphExecutionPath.length > 0}
							<div class="mb-3">
								<div class="form-check">
									<input 
										class="form-check-input" 
										type="checkbox" 
										bind:checked={showExecutionOnly}
										id="showInlineExecutionOnly"
									>
									<label class="form-check-label" for="showInlineExecutionOnly">
										Show only executed nodes and edges
									</label>
								</div>
							</div>
						{/if}
						{#if graphError}
							<Alert color="danger">
								<i class="bi bi-exclamation-triangle me-2"></i>
								Error parsing agent configuration: {graphError}
							</Alert>
						{:else if graphNodes.length > 0}
							<div style="height: 400px; width: 100%; border: 1px solid #dee2e6; border-radius: 0.375rem;">
								<SvelteFlow nodes={graphNodes} edges={graphEdges} fitView>
									<Controls />
									<Background />
									<MiniMap />
									<Panel position="top-right">
										<div class="bg-white p-2 rounded shadow-sm">
											<small class="text-muted">
												<i class="bi bi-info-circle me-1"></i>
												Use mouse wheel to zoom, drag to pan
											</small>
											{#if graphExecutionPath.length > 0}
												<hr class="my-2">
												<div class="mb-1">
													<small class="text-success">
														<i class="bi bi-check-circle me-1"></i>
														<strong>Executed</strong>
													</small>
												</div>
												<div class="mb-1">
													<small class="text-muted">
														<i class="bi bi-circle me-1"></i>
														Not executed
													</small>
												</div>
												<div>
													<small class="text-success">
														<i class="bi bi-arrow-right me-1"></i>
														Used paths
													</small>
												</div>
											{/if}
										</div>
									</Panel>
								</SvelteFlow>
							</div>
						{:else}
							<Alert color="warning">
								<i class="bi bi-exclamation-triangle me-2"></i>
								No nodes found in agent configuration. The agent may not be properly configured.
							</Alert>
						{/if}
					</CardBody>
				</Card>
			{/if}
		</CardBody>
		<CardFooter>
			<div class="d-flex justify-content-center">
				<Pagination>
					<PaginationItem disabled={agentsCurrentPage === 1 || agents.length === 0}>
						<PaginationLink previous href="#" on:click={(e) => {goToAgentPage(agentsCurrentPage - 1); e.preventDefault();}} />
					</PaginationItem>
					{#each Array(totalAgentPages) as _, i}
						{@const pageNum = i + 1}
						<PaginationItem active={agentsCurrentPage === pageNum && agents.length > 0} disabled={agents.length === 0 && pageNum > 1}>
							<PaginationLink href="#" on:click={(e) => {goToAgentPage(pageNum); e.preventDefault();}}>{pageNum}</PaginationLink>
						</PaginationItem>
					{/each}
					<PaginationItem disabled={agentsCurrentPage === totalAgentPages || agents.length === 0}>
						<PaginationLink next href="#" on:click={(e) => {goToAgentPage(agentsCurrentPage + 1); e.preventDefault();}} />
					</PaginationItem>
				</Pagination>
			</div>
		</CardFooter>
	</Card>
</div>

{#if isEditModalOpen && selectedAgentForEdit}
	<AgentEditModal 
		isOpen={isEditModalOpen}
		agent={selectedAgentForEdit}
		onSave={handleSaveAgentChanges}
		onClose={closeEditModal}
	/>
{/if}

{#if isGraphModalOpen && selectedAgentForGraph}
	<AgentGraphModal 
		isOpen={isGraphModalOpen}
		agent={selectedAgentForGraph}
		onClose={closeGraphModal}
		executionData={streamEvents}
	/>
{/if}

{#if isNameModalOpen}
	<Modal isOpen={isNameModalOpen} toggle={closeNameModal}>
		<ModalHeader toggle={closeNameModal}>
			Create New Agent
		</ModalHeader>
		<ModalBody>
			<div class="mb-3">
				<label for="agentName" class="form-label">Agent Name</label>
				<Input
					id="agentName"
					type="text"
					bind:value={newAgentName}
					placeholder="Enter a name for your agent"
					invalid={!!nameInputError}
					on:input={(e) => {
						console.log('📝 Input changed:', e.target.value, 'newAgentName:', newAgentName);
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							console.log('⌨️ Enter pressed, newAgentName:', newAgentName);
							createAgentWithName();
						}
					}}
				/>
				{#if nameInputError}
					<div class="invalid-feedback d-block">
						{nameInputError}
					</div>
				{/if}
			</div>
			<div class="text-muted small">
				<i class="bi bi-info-circle me-1"></i>
				The agent name should be unique and descriptive. You can edit the configuration after creation.
			</div>
		</ModalBody>
		<ModalFooter>
			<Button color="secondary" on:click={closeNameModal}>
				Cancel
			</Button>
			<Button 
				color="primary" 
				on:click={() => {
					console.log('🖱️ Create Agent button clicked, newAgentName:', newAgentName);
					createAgentWithName();
				}}
				disabled={!newAgentName.trim()}
			>
				Create Agent
			</Button>
		</ModalFooter>
	</Modal>
{/if}