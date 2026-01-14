import { runtimeConfig } from '$lib/runtime-config';

// Types for API requests and responses
interface SaveGraphConfigRequest {
	user_id: number;
	graph_config: any;
	description?: string;
	username?: string;
	email?: string;
}

interface UpdateGraphConfigRequest {
	graph_config: any;
	description?: string;
}

interface ConfigRecord {
	config_id: number;
	key: string;
	value: any;
	description: string;
	tool_id: number;
	created_date: string | null;
	last_executed_date: string | null;
}

interface SaveConfigResponse {
	status: string;
	message?: string;
	config_ids?: number[];
	detail?: string;
	user_created?: boolean;
	tool_id?: number;
	config_id?: number; // Add config_id to the response interface
}

interface GetConfigResponse {
	status: string;
	config_dict?: any;
	config_records?: ConfigRecord[];
	total_configs?: number;
	detail?: string;
}

export class AgentCrudService {
	private static readonly CONFIG_API_URL = runtimeConfig.AI_AGENTIC_URL;
	// private static readonly CONFIG_API_URL = 'http://localhost:8000';

	/**
	 * Helper method to create a user info object from user store data
	 */
	static createUserInfo(user: any): { username?: string; email?: string } {
		return {
			username: user?.name,
			email: user?.email
		};
	}

	/**
	 * Save agent graph configuration to the backend
	 */
	static async saveGraphConfig(
		userId: number, 
		graphConfig: any, 
		description?: string,
		username?: string,
		email?: string
	): Promise<SaveConfigResponse> {
		try {
			const requestBody: SaveGraphConfigRequest = {
				user_id: userId,
				graph_config: graphConfig,
				description: description,
				username: username,
				email: email
			};

			const response = await fetch(`${this.CONFIG_API_URL}/save_graph_config`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();
			
			// Log if a new user was created
			if (result.user_created) {
				console.log(`New user created: ${username} (${email}) with ID: ${userId}`);
			}

			// Extract config_id from config_ids array if available
			if (result.config_ids && result.config_ids.length > 0) {
				result.config_id = result.config_ids[0]; // Use the first config_id
				console.log(`Config saved with config_id: ${result.config_id}`);
			}

			return result;
		} catch (error: any) {
			console.error('Error saving graph config:', error);
			return {
				status: 'error',
				detail: error.message
			};
		}
	}

	/**
	 * Retrieve agent graph configurations for a user
	 */
	static async getGraphConfigs(userId: number): Promise<GetConfigResponse> {
		try {
			const response = await fetch(`${this.CONFIG_API_URL}/get_graph_configs/${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.json();
		} catch (error: any) {
			console.error('Error retrieving graph configs:', error);
			return {
				status: 'error',
				detail: error.message
			};
		}
	}

	/**
	 * Save an agent configuration with metadata
	 */
	static async saveAgent(
		userId: number, 
		agent: any, 
		description?: string,
		username?: string,
		email?: string
	): Promise<SaveConfigResponse> {
		// Include config_id in graph_config if it exists, otherwise let backend generate it
		const configWithId = agent.config_id ? { ...agent.full_config, config_id: agent.config_id } : agent.full_config;
		return this.saveGraphConfig(userId, configWithId, description || agent.description, username, email);
	}

	/**
	 * Load saved agents for a user and convert them to the expected format
	 */
	static async loadUserAgents(userId: number): Promise<any[]> {
		const result = await this.getGraphConfigs(userId);
		
		// Debug: Log the entire response structure
		console.log('Full backend response:', result);
		console.log('Response status:', result.status);
		console.log('Config dict exists:', !!result.config_dict);
		console.log('Config dict content:', result.config_dict);
		console.log('Config records exists:', !!result.config_records);
		console.log('Config records content:', result.config_records);
		
		if (result.status !== 'success') {
			console.warn('Backend returned non-success status:', result.status, result.detail);
			return [];
		}
		
		// Process config_records to reconstruct individual agents
		if (result.config_records && Array.isArray(result.config_records)) {
			console.log('Processing config_records to reconstruct individual agents');
			
			// Group config records by config_id to get individual agents
			const agentGroups: { [configId: number]: any[] } = {};
			
			result.config_records.forEach((record: any) => {
				if (!agentGroups[record.config_id]) {
					agentGroups[record.config_id] = [];
				}
				agentGroups[record.config_id].push(record);
			});

			const agents = Object.entries(agentGroups).map(([configIdStr, configs]) => {
				const configId = parseInt(configIdStr);
				let description = '';
				let created_date = '';
				let tool_id: number | undefined;
				const full_config: any = {};

				// Reconstruct the full_config from individual config records
				// and get metadata
				configs.forEach((config: any) => {
					// Build the full_config from key-value pairs
					if (config.key && config.value !== null && config.value !== undefined) {
						try {
							// Try to parse JSON values, otherwise use as string
							full_config[config.key] = typeof config.value === 'string' ? 
								JSON.parse(config.value) : config.value;
						} catch {
							// If JSON parsing fails, use the raw value
							full_config[config.key] = config.value;
						}
					}
					
					// Get metadata
					if (!description && config.description) {
						description = config.description;
					}
					if (!created_date && config.created_date) {
						created_date = config.created_date;
					}
					// Get tool_id from any of the records (for backwards compatibility)
					if (!tool_id) {
						tool_id = config.tool_id;
					}
				});

				// Fallback to config_dict if individual reconstruction didn't work
				// and we have a single agent scenario
				if (Object.keys(full_config).length === 0 && result.config_dict) {
					console.log(`Using config_dict fallback for config_id ${configId}`);
					Object.assign(full_config, result.config_dict);
				}

				return {
					graph_name: full_config.graph_name || `agent_${configId}`,
					description: description || full_config.description || 'Saved agent configuration',
					running: false,
					full_config: full_config.graph_config || {},
					created_date: created_date,
					config_id: configId,
					tool_id: tool_id // Keep for backward compatibility
				};
			});

			console.log('Processed agents:', agents);
			return agents;
		} else {
			console.warn('No config_records found in response or invalid format');
			return [];
		}
	}

	/**
	 * Delete an agent configuration using config_id
	 */
	static async deleteAgent(configId: number): Promise<SaveConfigResponse> {
		try {
			console.log(`🗑️ Starting delete process for config_id: ${configId}`);
			
			// Call the delete API with config_id in path only
			const deleteUrl = `${this.CONFIG_API_URL}/delete_graph_config/${configId}`;
			console.log(`🌐 Making DELETE request to: ${deleteUrl}`);
			
			const response = await fetch(deleteUrl, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log(`📡 Delete response status: ${response.status} ${response.statusText}`);
			
			if (!response.ok) {
				const errorText = await response.text();
				console.error(`❌ Delete API failed: ${response.status} - ${errorText}`);
				throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
			}

			const deleteResult = await response.json();
			console.log('✅ Delete API success response:', deleteResult);
			return deleteResult;
		} catch (error: any) {
			console.error('💥 Error deleting agent config:', error);
			return {
				status: 'error',
				detail: error.message
			};
		}
	}

	/**
	 * Update an existing agent configuration using the dedicated update endpoint
	 */
	static async updateGraphConfig(
		configId: number,
		graphConfig: any,
		description?: string
	): Promise<SaveConfigResponse> {
		try {
			console.log(`🔄 Starting update process for config_id: ${configId}`);
			
			const requestBody = {
				graph_config: graphConfig,
				description: description
			};

			const updateUrl = `${this.CONFIG_API_URL}/update_graph_config/${configId}`;
			console.log(`🌐 Making PUT request to: ${updateUrl}`);
			
			const response = await fetch(updateUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			console.log(`📡 Update response status: ${response.status} ${response.statusText}`);
			
			if (!response.ok) {
				const errorText = await response.text();
				console.error(`❌ Update API failed: ${response.status} - ${errorText}`);
				throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
			}

			const updateResult = await response.json();
			console.log('✅ Update API success response:', updateResult);
			return updateResult;
		} catch (error: any) {
			console.error('💥 Error updating graph config:', error);
			return {
				status: 'error',
				detail: error.message
			};
		}
	}

	/**
	 * Update an existing agent configuration
	 */
	static async updateAgent(
		userId: number, 
		agent: any, 
		description?: string,
		username?: string,
		email?: string
	): Promise<SaveConfigResponse> {
		// Use the dedicated update endpoint if config_id exists
		const configId = agent.config_id;
		if (configId) {
			return this.updateGraphConfig(configId, agent.full_config, description || agent.description);
		}
		
		// Fallback to save method for new agents
		return this.saveGraphConfig(userId, agent.full_config, description || agent.description, username, email);
	}

	/**
	 * Get a specific agent configuration by config_id
	 */
	static async getAgent(userId: number, configId: number): Promise<any | null> {
		const result = await this.getGraphConfigs(userId);
		
		if (result.status !== 'success') {
			console.warn('Failed to load user agents:', result.detail);
			return null;
		}

		// Debug log for getAgent
		console.log(`Looking for agent with config_id: ${configId}`);
		console.log('Available data:', { 
			has_config_dict: !!result.config_dict, 
			has_config_records: !!result.config_records 
		});

		// Use config_records to find the agent and get metadata
		// Use config_dict as the full configuration
		if (result.config_records && result.config_dict) {
			const agentRecords = result.config_records.filter(record => record.config_id === configId);
			
			if (agentRecords.length > 0) {
				let description = '';
				let created_date = '';
				let tool_id: number | undefined;

				// Get metadata from config_records
				agentRecords.forEach(config => {
					if (!description && config.description) {
						description = config.description;
					}
					if (!created_date && config.created_date) {
						created_date = config.created_date;
					}
					// Get tool_id from any of the records (for backwards compatibility)
					if (!tool_id) {
						tool_id = config.tool_id;
					}
				});

				// Use the merged config_dict as the full_config
				const full_config = result.config_dict;

				console.log(`Found agent config for config_id ${configId} using config_dict`);
				return {
					graph_name: full_config.graph_name || `agent_${configId}`,
					description: description || full_config.description || 'Saved agent configuration',
					running: false,
					full_config: full_config,
					created_date: created_date,
					tool_id: tool_id,
					config_id: configId
				};
			}
		}

		// Fallback to config_records only if config_dict approach doesn't work
		if (result.config_records) {
			const agentRecords = result.config_records.filter(record => record.config_id === configId);
			
			if (agentRecords.length > 0) {
				const full_config: any = {};
				let description = '';
				let tool_id: number | undefined;

				agentRecords.forEach(config => {
					full_config[config.key] = config.value;
					if (!description && config.description) {
						description = config.description;
					}
					// Get tool_id from any of the records (for backwards compatibility)
					if (!tool_id) {
						tool_id = config.tool_id;
					}
				});

				return {
					graph_name: full_config.graph_name || `agent_${configId}`,
					description: description || full_config.description || 'Saved agent configuration',
					running: false,
					full_config: full_config,
					tool_id: tool_id,
					config_id: configId
				};
			}
		}

		console.warn(`Agent with config_id ${configId} not found`);
		return null;
	}

	/**
	 * Duplicate an existing agent using config_id
	 */
	static async duplicateAgent(
		userId: number, 
		sourceConfigId: number, 
		newConfigId?: number,
		username?: string,
		email?: string
	): Promise<SaveConfigResponse> {
		// For duplication, we need to get the agent by config_id
		// We can use our getAgent method which now works with config_id
		const sourceAgent = await this.getAgent(userId, sourceConfigId);
		
		if (!sourceAgent) {
			return {
				status: 'error',
				detail: 'Source agent not found'
			};
		}

		// Create a copy of the agent config with a new name
		const duplicatedConfig = { ...sourceAgent.full_config };
		duplicatedConfig.graph_name = `${sourceAgent.graph_name}_copy_${Date.now()}`;
		// Remove config_id so backend generates a new one
		delete duplicatedConfig.config_id;

		return this.saveGraphConfig(
			userId, 
			duplicatedConfig, 
			`Copy of ${sourceAgent.description}`,
			username,
			email
		);
	}
}

// Export types for use in other files
export type {
	SaveGraphConfigRequest,
	UpdateGraphConfigRequest,
	ConfigRecord,
	SaveConfigResponse,
	GetConfigResponse
};
