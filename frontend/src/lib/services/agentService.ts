import { llmConfigStore } from '$lib/stores/llmConfigStore';
import { AgentValidation } from './agentValidation';
import { runtimeConfig } from '$lib/runtime-config';

export class AgentService {
	private static readonly API_URL = `${runtimeConfig.AI_AGENTIC_URL}/graph/stream`;
	// private static readonly API_URL = 'http://localhost:8000/graph/stream';

	static parseSSEEvents(rawData: string): any[] {
		const events: any[] = [];
		const chunks = rawData.split('\n\n');
		
		for (const chunk of chunks) {
			if (!chunk.trim()) continue;
			
			const lines = chunk.split('\n');
			let eventType = '';
			let eventData = '';
			
			for (const line of lines) {
				if (line.startsWith('event: ')) {
					eventType = line.substring(7);
				} else if (line.startsWith('data: ')) {
					eventData = line.substring(6);
				}
			}
			
			if (eventType && eventData) {
				try {
					const parsedData = JSON.parse(eventData);
					events.push({ type: eventType, ...parsedData });
				} catch (error) {
					console.error("Error parsing SSE event data:", error, eventData);
				}
			}
		}
		
		return events;
	}

	/**
	 * Parses agent execution events and handles the targets_prompts format for interrupts.
	 * 
	 * For interrupts, expects:
	 * - targets_prompts: { target1: prompt1, target2: prompt2, ... }
	 * 
	 * Resume responses should be in format: { target1: response1, target2: response2, ... }
	 */
	static parseAgentOutput(
		events: any[],
		setCurrentSessionId: (id: string | null) => void,
		setWaitingForResume: (waiting: boolean) => void,
		setResumePrompts: (prompts: Record<string, { prompt: string; default?: string }>) => void
	): string {
		if (!events || events.length === 0) return '';
		
		let output = '';
		
		for (const event of events) {
			switch (event.type) {
				case 'session_start':
					output += `🚀 Session started (ID: ${event.session_id})\n`;
					if (event.message) output += `${event.message}\n`;
					break;
				case 'execution_chunk':
					if (event.data) {
						// Display all tracked state variables in event.data
						for (const [key, value] of Object.entries(event.data)) {
							if (Array.isArray(value)) {
								output += `🔹 ${key}:\n`;
								for (const item of value) {
									if (typeof item === 'string') {
										output += `  - ${item}\n`;
									} else if (item?.content) {
										output += `  - ${item.content}\n`;
									} else {
										output += `  - ${JSON.stringify(item)}\n`;
									}
								}
							} else if (typeof value === 'object' && value !== null) {
								output += `🔹 ${key}: ${JSON.stringify(value, null, 2)}\n`;
							} else {
								output += `🔹 ${key}: ${value}\n`;
							}
						}
					}
					if (event.message) output += `${event.message}\n`;
					break;
				case 'interrupt':
					output += `⏸️ Execution interrupted - User input required\n`;
					if (event.targets_prompts) {
						const normalizedPrompts: Record<string, { prompt: string; default?: string }> = {};
						Object.entries(event.targets_prompts).forEach(([target, value]) => {
							if (value && typeof value === 'object' && !Array.isArray(value) && 'prompt' in value) {
								const valueObj = value as { prompt?: unknown; default?: unknown };
								let promptText = '';
								if (typeof valueObj.prompt === 'string') {
									promptText = valueObj.prompt;
								} else if (valueObj.prompt !== undefined && valueObj.prompt !== null) {
									try {
										promptText = JSON.stringify(valueObj.prompt);
									} catch {
										promptText = String(valueObj.prompt);
									}
								}
								const defaultValue = typeof valueObj.default === 'string' ? valueObj.default : undefined;
								normalizedPrompts[target] = defaultValue ? { prompt: promptText, default: defaultValue } : { prompt: promptText };
							} else {
								let promptText = '';
								if (typeof value === 'string') {
									promptText = value;
								} else if (value !== undefined && value !== null) {
									try {
										promptText = JSON.stringify(value);
									} catch {
										promptText = String(value);
									}
								}
								normalizedPrompts[target] = { prompt: promptText };
							}
						});

						const targets = Object.keys(normalizedPrompts);
						for (const target of targets) {
							const promptInfo = normalizedPrompts[target];
							const defaultSuffix = promptInfo.default ? ` (default: ${promptInfo.default})` : '';
							output += `${target}: ${promptInfo.prompt}${defaultSuffix}\n`;
						}

						// Set up resume state with normalized prompts
						setCurrentSessionId(event.session_id);
						setWaitingForResume(true);
						setResumePrompts(normalizedPrompts);
					} else {
						// No targets_prompts provided
						console.warn('Interrupt event received without targets_prompts');
						setCurrentSessionId(event.session_id);
						setWaitingForResume(true);
						setResumePrompts({
							default: { prompt: 'Please provide input to continue:' }
						});
					}
					break;
				case 'execution_complete':
					output += `✅ Execution completed successfully\n`;
					if (event.message) output += `${event.message}\n`;
					// Clear resume state
					setWaitingForResume(false);
					setCurrentSessionId(null);
					setResumePrompts({});
					break;
				case 'error':
					output += `❌ Error: ${event.error || event.message}\n`;
					if (event.error_type) output += `Error Type: ${event.error_type}\n`;
					// Clear resume state on error and set agent running to false
					setWaitingForResume(false);
					setCurrentSessionId(null);
					setResumePrompts({});
					break;
				case 'resume_start':
					output += `🔄 Resuming execution\n`;
					if (event.message) output += `${event.message}\n`;
					setWaitingForResume(false);
					break;
				default:
					if (event.message) output += `${event.message}\n`;
					break;
			}
		}
		
		return output.trim();
	}

	static async executeAgentRequest(requestBody: any): Promise<ReadableStream<Uint8Array> | null> {
		//overrride the llms list with list of LLMs from the config store
		if (requestBody.graph_config) {
			requestBody.graph_config.llms = {}
			llmConfigStore.configs.subscribe((configs) => {
				requestBody.graph_config.llms = configs.map(config => ({
					id: config.name,
					type: config.provider,
					description: "sample description",
					config: config.config
				}));
			});
		}

		console.log("Executing agent request with body:", requestBody);

		const response = await fetch(this.API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'text/event-stream'
			},
			body: JSON.stringify(requestBody)
		});
		
		// Check for HTTP error status codes
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}
		
		if (!response.body) throw new Error('No response body');
		return response.body;
	}

	static createNewAgentTemplate(agentName: string): any {
		console.log('🔧 createNewAgentTemplate called with agentName:', agentName);
		
		const template = {
			graph_name: agentName,
			description: "A newly created agent. Click 'Edit JSON' to configure.",
			running: false,
			full_config: {
				graph_name: agentName,
				description: "Default configuration for a new agent. Please edit.",
				state_schema: {
					messages: { type: "List[AnyMessage]", default: [] }
				},
				nodes: [
					{ 
						id: "initial_node", 
						template: "llm_prompt_node", 
						config: { 
							prompt: "This is a new agent. Configure its prompt.", 
							llm_id: "default_llm", 
							target: "messages" 
						} 
					}
				],
				edges: [{ from: "__start__", to: "initial_node" }],
				conditional_edges: [],
				llms: [
					{ 
						id: "default_llm", 
						type: "AzureOpenAI",
						description: "Configure your LLM details here.", 
						config: {
							azure_endpoint: "YOUR_ENDPOINT",
							api_key: "YOUR_API_KEY",
							api_version: "2024-08-01-preview",
							azure_deployment: "YOUR_DEPLOYMENT",
							model_version: "YOUR_MODEL"
						} 
					}
				],
				tool_config: {}
			}
		};
		
		console.log('🔧 Created template:', { 
			graph_name: template.graph_name, 
			full_config_graph_name: template.full_config.graph_name 
		});
		
		return template;
	}

	static validateAgentConfig(config: any): { isValid: boolean; errors: string[] } {
		return AgentValidation.validateAgentConfig(config);
	}
}
