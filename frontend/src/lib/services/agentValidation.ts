export class AgentValidation {
	static validateAgentConfig(config: any): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		try {
			// First, ensure it's valid JSON if it's a string
			if (typeof config === 'string') {
				config = JSON.parse(config);
			}

			// Check required top-level fields
			const requiredFields = ['graph_name', 'nodes', 'edges'];
			for (const field of requiredFields) {
				if (!config[field]) {
					errors.push(`Missing required field: ${field}`);
				}
			}

			// Validate graph_name
			if (config.graph_name && typeof config.graph_name !== 'string') {
				errors.push('graph_name must be a string');
			}

			// Validate nodes array
			if (config.nodes) {
				if (!Array.isArray(config.nodes)) {
					errors.push('nodes must be an array');
				} else {
					config.nodes.forEach((node: any, index: number) => {
						// Check required node fields
						if (!node.id) {
							errors.push(`Node at index ${index} missing required field: id`);
						}
						if (!node.template) {
							errors.push(`Node at index ${index} missing required field: template`);
						}
						if (!node.config) {
							errors.push(`Node at index ${index} missing required field: config`);
						}
						
						// Validate field types
						if (node.id && typeof node.id !== 'string') {
							errors.push(`Node at index ${index}: id must be a string`);
						}
						if (node.template && typeof node.template !== 'string') {
							errors.push(`Node at index ${index}: template must be a string`);
						}
						if (node.config && typeof node.config !== 'object') {
							errors.push(`Node at index ${index}: config must be an object`);
						}
						
						// Validate config fields based on node template
						if (node.config) {
							// Common validations for LLM nodes
							if (node.template && (node.template.includes('LLM') || node.template.includes('llm'))) {
								if (!node.config.prompt) {
									errors.push(`Node '${node.id}' (LLM node) missing required config field: prompt`);
								}
								if (!node.config.llm_id) {
									errors.push(`Node '${node.id}' (LLM node) missing required config field: llm_id`);
								}
								if (!node.config.target) {
									errors.push(`Node '${node.id}' (LLM node) missing required config field: target`);
								}
							}
							
							// Validations for Tool nodes
							if (node.template && node.template.includes('Tool')) {
								if (!node.config.target) {
									errors.push(`Node '${node.id}' (Tool node) missing required config field: target`);
								}
								
								// Check for any of the common tool configuration fields
								const hasToolNames = node.config.tool_names && Array.isArray(node.config.tool_names);
								const hasToolConfig = node.config.tool_config;
								const hasTools = node.config.tools; // Also accept 'tools' field
								
								if (!hasToolNames && !hasToolConfig && !hasTools) {
									errors.push(`Node '${node.id}' (Tool node) must have either 'tool_names' (array), 'tool_config' (object), or 'tools' field`);
								}
								
								// Validate tool_names if present
								if (node.config.tool_names && !Array.isArray(node.config.tool_names)) {
									errors.push(`Node '${node.id}' (Tool node) tool_names must be an array`);
								}
								
								// Validate tools field if present (can be array or string)
								if (node.config.tools) {
									if (typeof node.config.tools !== 'string' && !Array.isArray(node.config.tools)) {
										errors.push(`Node '${node.id}' (Tool node) tools must be a string or array`);
									}
								}
								
								// Validate tool_config if present
								if (node.config.tool_config) {
									if (typeof node.config.tool_config !== 'object' || Array.isArray(node.config.tool_config)) {
										errors.push(`Node '${node.id}' (Tool node) tool_config must be an object`);
									} else {
										// tool_config can be an object with multiple tool configurations
										// Each tool should have a configuration object
										Object.entries(node.config.tool_config).forEach(([toolName, toolConfig]) => {
											if (toolConfig !== null && typeof toolConfig !== 'object') {
												errors.push(`Node '${node.id}' (Tool node) tool_config['${toolName}'] must be an object or null`);
											}
										});
									}
								}
							}
							
							// Validations for HumanInput nodes
							if (node.template && node.template.includes('HumanInput')) {
								if (!node.config.targets_prompts) {
									errors.push(`Node '${node.id}' (HumanInput node) missing required config field: targets_prompts`);
								} else if (typeof node.config.targets_prompts !== 'object') {
									errors.push(`Node '${node.id}' (HumanInput node) targets_prompts must be an object`);
								}
							}
						}
					});
				}
			}

			// Validate edges array
			if (config.edges) {
				if (!Array.isArray(config.edges)) {
					errors.push('edges must be an array');
				} else {
					config.edges.forEach((edge: any, index: number) => {
						if (!edge.from) {
							errors.push(`Edge at index ${index} missing required field: from`);
						}
						if (!edge.to) {
							errors.push(`Edge at index ${index} missing required field: to`);
						}
						if (edge.from && typeof edge.from !== 'string') {
							errors.push(`Edge at index ${index}: from must be a string`);
						}
						if (edge.to && typeof edge.to !== 'string') {
							errors.push(`Edge at index ${index}: to must be a string`);
						}
					});
				}
			}
			
			// Validate that each node has proper edge connections
			if (config.nodes && config.edges && Array.isArray(config.nodes) && Array.isArray(config.edges)) {
				const nodeIds = new Set(config.nodes.map((node: any) => node.id));
				
				// Check that edge references point to valid nodes (or special keywords)
				config.edges.forEach((edge: any, index: number) => {
					// 'from' can be __start__ or any valid node
					if (edge.from !== '__start__' && !nodeIds.has(edge.from)) {
						errors.push(`Edge at index ${index} references non-existent source node '${edge.from}'`);
					}
					// 'to' can be __end__ or any valid node
					if (edge.to !== '__end__' && !nodeIds.has(edge.to)) {
						errors.push(`Edge at index ${index} references non-existent target node '${edge.to}'`);
					}
					
					// Check for self-referencing edges (circular edges)
					if (edge.from === edge.to && edge.from !== '__start__' && edge.from !== '__end__') {
						errors.push(`Edge at index ${index} creates a circular reference: node '${edge.from}' cannot connect to itself`);
					}
				});
				
				// Check conditional edges if they exist
				if (config.conditional_edges && Array.isArray(config.conditional_edges)) {
					config.conditional_edges.forEach((condEdge: any, index: number) => {
						// 'from' must be a valid node (conditional edges come from nodes, not __start__)
						if (!nodeIds.has(condEdge.from)) {
							errors.push(`Conditional edge at index ${index} references non-existent source node '${condEdge.from}'`);
						}
						
						// Check routing_map targets
						if (condEdge.routing_map && typeof condEdge.routing_map === 'object') {
							Object.entries(condEdge.routing_map).forEach(([condition, target]) => {
								if (typeof target === 'string' && target !== '__end__' && !nodeIds.has(target)) {
									errors.push(`Conditional edge routing_map condition '${condition}' references non-existent target node '${target}'`);
								}
								
								// Check for self-referencing conditional edges
								if (typeof target === 'string' && target === condEdge.from) {
									errors.push(`Conditional edge at index ${index} creates a circular reference: node '${condEdge.from}' cannot conditionally route to itself (condition: '${condition}')`);
								}
							});
						}
					});
				}
				
				// Check for graph connectivity - ensure there's at least one path from __start__
				const hasStartEdge = config.edges.some((edge: any) => edge.from === '__start__');
				if (!hasStartEdge) {
					errors.push('Graph must have at least one edge starting from __start__');
				}
				
				// Optional: Check if all nodes are reachable from __start__ (this is a warning, not an error)
				const reachableNodes = new Set<string>();
				
				// Find nodes directly reachable from __start__
				config.edges.forEach((edge: any) => {
					if (edge.from === '__start__') {
						reachableNodes.add(edge.to);
					}
				});
				
				// Iteratively find all reachable nodes through regular edges
				let foundNewNodes = true;
				while (foundNewNodes) {
					foundNewNodes = false;
					config.edges.forEach((edge: any) => {
						if (reachableNodes.has(edge.from) && !reachableNodes.has(edge.to) && edge.to !== '__end__') {
							reachableNodes.add(edge.to);
							foundNewNodes = true;
						}
					});
					
					// Also check conditional edges
					if (config.conditional_edges) {
						config.conditional_edges.forEach((condEdge: any) => {
							if (reachableNodes.has(condEdge.from) && condEdge.routing_map) {
								Object.values(condEdge.routing_map).forEach((target: any) => {
									if (typeof target === 'string' && target !== '__end__' && !reachableNodes.has(target)) {
										reachableNodes.add(target);
										foundNewNodes = true;
									}
								});
							}
						});
					}
				}
				
				// Warn about unreachable nodes (but don't fail validation)
				for (const nodeId of nodeIds) {
					if (!reachableNodes.has(nodeId as string)) {
						// This could be a warning instead of an error, depending on requirements
						console.warn(`Warning: Node '${nodeId}' may not be reachable from __start__`);
					}
				}
			}

			// Validate conditional_edges array if present
			if (config.conditional_edges) {
				if (!Array.isArray(config.conditional_edges)) {
					errors.push('conditional_edges must be an array');
				} else {
					config.conditional_edges.forEach((condEdge: any, index: number) => {
						if (!condEdge.from) {
							errors.push(`Conditional edge at index ${index} missing required field: from`);
						}
						if (!condEdge.target) {
							errors.push(`Conditional edge at index ${index} missing required field: target`);
						}
						if (!condEdge.routing_map || typeof condEdge.routing_map !== 'object') {
							errors.push(`Conditional edge at index ${index} missing or invalid routing_map`);
						} else {
							// Check that routing_map has at least two routes
							const routeCount = Object.keys(condEdge.routing_map).length;
							if (routeCount < 2) {
								errors.push(`Conditional edge at index ${index} must have at least 2 routes in routing_map, found ${routeCount}`);
							}
						}
					});
				}
			}

			// Validate LLMs array if present
			if (config.llms) {
				if (!Array.isArray(config.llms)) {
					errors.push('llms must be an array');
				} else {
					config.llms.forEach((llm: any, index: number) => {
						if (!llm.id) {
							errors.push(`LLM at index ${index} missing required field: id`);
						}
						if (!llm.type) {
							errors.push(`LLM at index ${index} missing required field: type`);
						}
						if (!llm.config) {
							errors.push(`LLM at index ${index} missing required field: config`);
						}
						if (llm.id && typeof llm.id !== 'string') {
							errors.push(`LLM at index ${index}: id must be a string`);
						}
						if (llm.type && typeof llm.type !== 'string') {
							errors.push(`LLM at index ${index}: type must be a string`);
						}
					});
				}
			}
			
			// Validate LLM references in nodes
			if (config.nodes && config.llms) {
				const llmIds = new Set(config.llms.map((llm: any) => llm.id));
				config.nodes.forEach((node: any) => {
					if (node.config && node.config.llm_id) {
						if (!llmIds.has(node.config.llm_id)) {
							errors.push(`Node '${node.id}' references non-existent LLM '${node.config.llm_id}'`);
						}
					}
				});
			}

		} catch (parseError: any) {
			errors.push(`Invalid JSON: ${parseError.message}`);
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	/**
	 * Validate a single node configuration
	 */
	static validateNodeConfig(node: any, index?: number): string[] {
		const errors: string[] = [];
		const nodeRef = index !== undefined ? `Node at index ${index}` : `Node '${node.id || 'unknown'}'`;

		// Check required node fields
		if (!node.id) {
			errors.push(`${nodeRef} missing required field: id`);
		}
		if (!node.template) {
			errors.push(`${nodeRef} missing required field: template`);
		}
		if (!node.config) {
			errors.push(`${nodeRef} missing required field: config`);
		}

		// Validate field types
		if (node.id && typeof node.id !== 'string') {
			errors.push(`${nodeRef}: id must be a string`);
		}
		if (node.template && typeof node.template !== 'string') {
			errors.push(`${nodeRef}: template must be a string`);
		}
		if (node.config && typeof node.config !== 'object') {
			errors.push(`${nodeRef}: config must be an object`);
		}

		return errors;
	}

	/**
	 * Validate edge configuration
	 */
	static validateEdgeConfig(edge: any, index?: number): string[] {
		const errors: string[] = [];
		const edgeRef = index !== undefined ? `Edge at index ${index}` : 'Edge';

		if (!edge.from) {
			errors.push(`${edgeRef} missing required field: from`);
		}
		if (!edge.to) {
			errors.push(`${edgeRef} missing required field: to`);
		}
		if (edge.from && typeof edge.from !== 'string') {
			errors.push(`${edgeRef}: from must be a string`);
		}
		if (edge.to && typeof edge.to !== 'string') {
			errors.push(`${edgeRef}: to must be a string`);
		}

		return errors;
	}

	/**
	 * Validate LLM configuration
	 */
	static validateLLMConfig(llm: any, index?: number): string[] {
		const errors: string[] = [];
		const llmRef = index !== undefined ? `LLM at index ${index}` : `LLM '${llm.id || 'unknown'}'`;

		if (!llm.id) {
			errors.push(`${llmRef} missing required field: id`);
		}
		if (!llm.type) {
			errors.push(`${llmRef} missing required field: type`);
		}
		if (!llm.config) {
			errors.push(`${llmRef} missing required field: config`);
		}
		if (llm.id && typeof llm.id !== 'string') {
			errors.push(`${llmRef}: id must be a string`);
		}
		if (llm.type && typeof llm.type !== 'string') {
			errors.push(`${llmRef}: type must be a string`);
		}

		return errors;
	}
}
