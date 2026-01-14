import type { Agent } from '$lib/data/agents';

// Graph visualization functions
export const getNodeTypeInfo = (template: string, config: any) => {
	const typeMap = {
		'core.HumanInputNode': {
			type: 'input',
			color: '#4CAF50',
			icon: '👤',
			label: 'Human Input'
		},
		'core.LLMToolNode': {
			type: 'default',
			color: '#2196F3',
			icon: '🤖',
			label: 'LLM Tool'
		},
		'core.ToolNode': {
			type: 'default',
			color: '#FF9800',
			icon: '🔧',
			label: 'Tool'
		},
		'__start__': {
			type: 'input',
			color: '#9C27B0',
			icon: '▶️',
			label: 'Start'
		},
		'__end__': {
			type: 'output',
			color: '#F44336',
			icon: '⏹️',
			label: 'End'
		}
	};

	return (typeMap as any)[template] || {
		type: 'default',
		color: '#607D8B',
		icon: '📦',
		label: 'Custom Node'
	};
};

export const calculateNodePositions = (nodes: any[], edges: any[]) => {
	const positions: any = {};
	const levels: any = {};
	const visited = new Set();
	
	// Find root nodes (no incoming edges)
	const hasIncoming = new Set(edges.map((e: any) => e.target));
	const rootNodes = nodes.filter((n: any) => !hasIncoming.has(n.id));
	
	// BFS to assign levels
	const queue = rootNodes.map((n: any) => ({ node: n, level: 0 }));
	
	while (queue.length > 0) {
		const { node, level } = queue.shift()!;
		
		if (visited.has(node.id)) continue;
		visited.add(node.id);
		
		levels[node.id] = level;
		
		// Find children
		const children = edges
			.filter((e: any) => e.source === node.id)
			.map((e: any) => nodes.find((n: any) => n.id === e.target))
			.filter((n: any) => n && !visited.has(n.id));
		
		children.forEach((child: any) => {
			queue.push({ node: child, level: level + 1 });
		});
	}
	
	// Calculate positions
	const levelGroups: any = {};
	Object.entries(levels).forEach(([nodeId, level]) => {
		const levelNum = level as number;
		if (!levelGroups[levelNum]) levelGroups[levelNum] = [];
		levelGroups[levelNum].push(nodeId);
	});
	
	Object.entries(levelGroups).forEach(([level, nodeIds]) => {
		const levelNum = parseInt(level);
		const yPos = levelNum * 200 + 100;
		const xSpacing = 300;
		const nodeArray = nodeIds as string[];
		const startX = -(nodeArray.length - 1) * xSpacing / 2 + 400;
		
		nodeArray.forEach((nodeId, index) => {
			positions[nodeId] = {
				x: startX + index * xSpacing,
				y: yPos
			};
		});
	});
	
	return positions;
};

export const parseAgentConfig = (config: any, executionPath: string[] = [], showExecutionOnly: boolean = false) => {
	try {
		if (!config || typeof config !== 'object') {
			throw new Error('Invalid agent configuration');
		}

		const parsedNodes = [];
		const parsedEdges = [];
		
		// Add special start and end nodes if they don't exist
		const nodeIds = config.nodes?.map((n: any) => n.id) || [];
		const hasStart = nodeIds.includes('__start__') || config.edges?.some((e: any) => e.from === '__start__');
		const hasEnd = nodeIds.includes('__end__') || config.edges?.some((e: any) => e.to === '__end__') || 
					  config.conditional_edges?.some((ce: any) => Object.values(ce.routing_map).includes('__end__'));
		
		if (hasStart && !nodeIds.includes('__start__')) {
			parsedNodes.push({
				id: '__start__',
				template: '__start__',
				config: {}
			});
		}
		
		if (hasEnd && !nodeIds.includes('__end__')) {
			parsedNodes.push({
				id: '__end__',
				template: '__end__',
				config: {}
			});
		}
		
		// Add regular nodes
		if (config.nodes) {
			parsedNodes.push(...config.nodes);
		}
		
		// Filter nodes if showing execution only
		const nodesToShow = showExecutionOnly ? 
			parsedNodes.filter(node => executionPath.includes(node.id)) : 
			parsedNodes;
		
		// Calculate positions
		const allEdges = [
			...(config.edges?.map((e: any) => ({ source: e.from, target: e.to })) || []),
			...(config.conditional_edges?.flatMap((ce: any) => 
				Object.entries(ce.routing_map).map(([condition, target]) => ({
					source: ce.from,
					target: target,
					condition
				}))
			) || [])
		];
		
		// Filter edges if showing execution only
		const edgesToShow = showExecutionOnly ? 
			allEdges.filter(edge => {
				const sourceExecuted = executionPath.includes(edge.source);
				const targetExecuted = executionPath.includes(edge.target);
				return sourceExecuted && targetExecuted;
			}) : 
			allEdges;
		
		const positions = calculateNodePositions(nodesToShow, edgesToShow);
		
		// Convert to visual nodes
		const visualNodes = nodesToShow.map(node => {
			const typeInfo = getNodeTypeInfo(node.template, node.config);
			const position = positions[node.id] || { x: 100, y: 100 };
			const wasExecuted = executionPath.includes(node.id);
			
			// Determine node styling based on execution status
			let nodeColor = typeInfo.color;
			let borderStyle = `2px solid ${typeInfo.color}`;
			let nodeIcon = typeInfo.icon;
			
			if (executionPath.length > 0) {
				if (wasExecuted) {
					// Executed nodes: brighter/highlighted
					nodeColor = typeInfo.color;
					borderStyle = `3px solid #00ff00`; // Green border for executed
					nodeIcon = `✅ ${typeInfo.icon}`;
				} else {
					// Non-executed nodes: dimmed
					nodeColor = '#cccccc';
					borderStyle = `2px solid #cccccc`;
					nodeIcon = `⚪ ${typeInfo.icon}`;
				}
			}
			
			return {
				id: node.id,
				type: 'default',
				position,
				data: {
					label: node.id,
					color: nodeColor,
					nodeType: typeInfo.type,
					template: node.template,
					config: node.config,
					icon: nodeIcon,
					executed: wasExecuted
				},
				style: `background-color: ${nodeColor}; color: ${wasExecuted ? 'white' : '#666'}; border: ${borderStyle}; border-radius: 8px; padding: 10px; min-width: 150px; ${wasExecuted ? 'box-shadow: 0 0 10px rgba(0,255,0,0.5);' : 'opacity: 0.7;'}`
			};
		});
		
		// Convert to visual edges
		const visualEdges: any[] = [];
		
		// Regular edges
		if (config.edges) {
			config.edges.forEach((edge: any, index: number) => {
				if (!showExecutionOnly || (executionPath.includes(edge.from) && executionPath.includes(edge.to))) {
					const wasUsed = executionPath.includes(edge.from) && executionPath.includes(edge.to);
					visualEdges.push({
						id: `edge-${index}`,
						source: edge.from,
						target: edge.to,
						type: 'smoothstep',
						animated: wasUsed,
						style: wasUsed ? 'stroke: #00ff00; stroke-width: 3px;' : 'stroke: #cccccc; stroke-width: 2px;',
						label: edge.condition || ''
					});
				}
			});
		}
		
		// Conditional edges
		if (config.conditional_edges) {
			config.conditional_edges.forEach((condEdge: any) => {
				Object.entries(condEdge.routing_map).forEach(([condition, target], index) => {
					if (!showExecutionOnly || (executionPath.includes(condEdge.from) && executionPath.includes(target as string))) {
						const wasUsed = executionPath.includes(condEdge.from) && executionPath.includes(target as string);
						visualEdges.push({
							id: `cond-edge-${condEdge.from}-${target}-${index}`,
							source: condEdge.from,
							target: target,
							type: 'smoothstep',
							animated: wasUsed,
							style: wasUsed ? 'stroke: #00ff00; stroke-width: 3px;' : 'stroke: #FF6B6B; stroke-width: 2px;',
							label: condition
						});
					}
				});
			});
		}
		
		return { nodes: visualNodes, edges: visualEdges };
	} catch (err: any) {
		throw new Error(`Failed to parse agent configuration: ${err.message}`);
	}
};

// Extract execution path from execution data/checkpoints
export const extractExecutionPath = (executionData: any[]): string[] => {
	const path: string[] = [];
	
	if (!executionData || executionData.length === 0) {
		return path;
	}
	
	console.log('🔍 Extracting execution path from events:', executionData);
	
	// Look for different types of events that indicate node execution
	for (const event of executionData) {
		console.log('📝 Processing event:', event.type, event);
		
		// Check for explicit node execution indicators
		if (event.node_id && !path.includes(event.node_id)) {
			path.push(event.node_id);
			console.log('✅ Added node from node_id:', event.node_id);
		}
		
		// Check in event data for node information
		if (event.data) {
			// Look for current_node, node_id, or similar fields in data
			const nodeFields = ['current_node', 'node_id', 'node', 'executing_node'];
			for (const field of nodeFields) {
				if (event.data[field] && !path.includes(event.data[field])) {
					path.push(event.data[field]);
					console.log(`✅ Added node from data.${field}:`, event.data[field]);
				}
			}
		}
		
		// For execution_chunk events, try to infer node from the context
		if (event.type === 'execution_chunk') {
			// Look for patterns in the event that might indicate which node is executing
			if (event.step || event.stage) {
				const stepNode = event.step || event.stage;
				if (typeof stepNode === 'string' && !path.includes(stepNode)) {
					path.push(stepNode);
					console.log('✅ Added node from step/stage:', stepNode);
				}
			}
		}
	}
	
	// If we have session start but no specific nodes, add common start node
	if (path.length === 0 && executionData.some(e => e.type === 'session_start')) {
		path.push('__start__');
		console.log('✅ Added default start node');
	}
	
	// If we have execution complete, likely includes end node
	if (executionData.some(e => e.type === 'execution_complete') && !path.includes('__end__')) {
		path.push('__end__');
		console.log('✅ Added end node from completion');
	}
	
	console.log('🎯 Final execution path:', path);
	return path;
};

export function updateInlineGraph(agent: Agent, executionData: any[] = []): { nodes: any[], edges: any[], error: string | null, executionPath: string[] } {
	try {
		const executionPath = extractExecutionPath(executionData);
		const { nodes: parsedNodes, edges: parsedEdges } = parseAgentConfig(agent.full_config, executionPath, false);
		return {
			nodes: parsedNodes,
			edges: parsedEdges,
			error: null,
			executionPath
		};
	} catch (err: any) {
		return {
			nodes: [],
			edges: [],
			error: err.message,
			executionPath: []
		};
	}
}
