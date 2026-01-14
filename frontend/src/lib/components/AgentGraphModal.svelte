<script lang="ts">
	import { 
		Modal, 
		ModalBody, 
		ModalHeader, 
		ModalFooter, 
		Button,
		Container,
		Row,
		Col,
		Card,
		CardBody,
		Badge,
		Alert
	} from '@sveltestrap/sveltestrap';
	import { SvelteFlow, Controls, Background, MiniMap, Panel } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import type { Agent } from '$lib/data/agents';

	export let isOpen = false;
	export let agent: Agent | null = null;
	export let onClose: () => void;
	export let executionPath: string[] = []; // Array of node IDs that were executed
	export let executionData: any[] = []; // Array of execution events/checkpoints

	let nodes: any[] = [];
	let edges: any[] = [];
	let error: string | null = null;
	let showExecutionOnly = false; // Toggle to show only executed nodes/edges

	// Node type mapping and styling (copied from jsonSchemaParser)
	const getNodeTypeInfo = (template: string, config: any) => {
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

	// Calculate node positions using a simple layout algorithm (copied from jsonSchemaParser)
	const calculateNodePositions = (nodes: any[], edges: any[]) => {
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

	// Parse agent configuration to graph format (adapted from jsonSchemaParser)
	const parseAgentConfig = (config: any, executionPath: string[] = [], showExecutionOnly: boolean = false) => {
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
					// Show edge if both source and target were executed, or if source was executed and leads to target
					return sourceExecuted && targetExecuted;
				}) : 
				allEdges;
			
			const positions = calculateNodePositions(nodesToShow, edgesToShow);
			
			// Convert to visual nodes
			const visualNodes = nodesToShow.map(node => {
				const typeInfo = getNodeTypeInfo(node.template, node.config);
				const position = positions[node.id] || { x: 100, y: 100 };
				const wasExecuted = executionPath.includes(node.id);
				
				// Create additional fields from config
				const additionalFields: any[] = [];
				if (node.config) {
					Object.entries(node.config).forEach(([key, value]) => {
						if (key !== 'target' && typeof value !== 'object') {
							additionalFields.push({
								name: key,
								value: String(value).length > 30 ? String(value).substring(0, 30) + '...' : String(value)
							});
						}
					});
				}
				
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
						fields: additionalFields,
						template: node.template,
						config: node.config,
						icon: nodeIcon,
						executed: wasExecuted
					},
					style: `background-color: ${nodeColor}; color: ${wasExecuted ? 'white' : 'black'}; border: ${borderStyle}; border-radius: 8px; padding: 10px; min-width: 150px; ${wasExecuted ? 'box-shadow: 0 0 10px rgba(0,255,0,0.5);' : 'opacity: 0.7;'}`
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
						if (!showExecutionOnly || (executionPath.includes(condEdge.from) && executionPath.includes(target))) {
							const wasUsed = executionPath.includes(condEdge.from) && executionPath.includes(target);
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
	const extractExecutionPath = (executionData: any[]): string[] => {
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
				// This is a heuristic approach - you might need to adjust based on your actual event structure
				// Look for patterns in the event that might indicate which node is executing
				
				// If the event has step or stage information
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

	// Update execution path when execution data changes
	$: if (executionData && executionData.length > 0) {
		executionPath = extractExecutionPath(executionData);
	}
	$: if (agent && isOpen) {
		try {
			error = null;
			const { nodes: parsedNodes, edges: parsedEdges } = parseAgentConfig(agent.full_config, executionPath, showExecutionOnly);
			nodes = parsedNodes;
			edges = parsedEdges;
		} catch (err: any) {
			error = err.message;
			nodes = [];
			edges = [];
		}
	}
</script>

<Modal {isOpen} toggle={onClose} size="xl" class="modal-xl">
	<ModalHeader toggle={onClose}>
		{#if agent}
			<i class="bi bi-diagram-3 me-2"></i>Agent Graph: {agent.graph_name}
		{:else}
			Agent Graph
		{/if}
	</ModalHeader>
	<ModalBody>
		{#if agent}
			<Container fluid>
				<Row class="mb-3">
					<Col>
						<Card>
							<CardBody class="py-2">
								<div class="d-flex justify-content-between align-items-center">
									<div>
										<h6 class="mb-1">{agent.graph_name}</h6>
										<small class="text-muted">{agent.description}</small>
									</div>
									<div class="d-flex gap-2">
										<Badge color="info">{nodes.length} nodes</Badge>
										<Badge color="secondary">{edges.length} edges</Badge>
										{#if executionPath.length > 0}
											<Badge color="success">{executionPath.length} executed</Badge>
										{/if}
									</div>
								</div>
								{#if executionPath.length > 0}
									<div class="mt-2">
										<div class="form-check">
											<input 
												class="form-check-input" 
												type="checkbox" 
												bind:checked={showExecutionOnly}
												id="showExecutionOnly"
											>
											<label class="form-check-label" for="showExecutionOnly">
												Show only executed nodes and edges
											</label>
										</div>
									</div>
								{/if}
							</CardBody>
						</Card>
					</Col>
				</Row>
				
				{#if executionPath.length > 0}
					<Row class="mb-3">
						<Col>
							<Card>
								<CardBody class="py-2">
									<h6 class="mb-2">
										<i class="bi bi-play-circle me-2"></i>
										Execution Summary
									</h6>
									<div class="row">
										<div class="col-md-6">
											<small class="text-muted d-block">Execution Path:</small>
											<div class="d-flex flex-wrap gap-1">
												{#each executionPath as nodeId, index}
													<Badge color="success" class="small">
														{index + 1}. {nodeId}
													</Badge>
													{#if index < executionPath.length - 1}
														<i class="bi bi-arrow-right text-muted small align-self-center"></i>
													{/if}
												{/each}
											</div>
										</div>
										<div class="col-md-6">
											<small class="text-muted d-block">Execution Events:</small>
											<div class="d-flex flex-wrap gap-1">
												{#each executionData.filter(e => ['session_start', 'execution_chunk', 'interrupt', 'execution_complete', 'error'].includes(e.type)) as event}
													<Badge 
														color={event.type === 'session_start' ? 'primary' : 
															   event.type === 'execution_chunk' ? 'info' : 
															   event.type === 'interrupt' ? 'warning' : 
															   event.type === 'execution_complete' ? 'success' : 'danger'} 
														class="small"
													>
														{event.type}
													</Badge>
												{/each}
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
				{/if}
				
				{#if error}
					<Row class="mb-3">
						<Col>
							<Alert color="danger">
								<i class="bi bi-exclamation-triangle me-2"></i>
								Error parsing agent configuration: {error}
							</Alert>
						</Col>
					</Row>
				{:else if nodes.length > 0}
					<Row>
						<Col>
							<div style="height: 500px; width: 100%; border: 1px solid #dee2e6; border-radius: 0.375rem;">
								<SvelteFlow {nodes} {edges} fitView>
									<Controls />
									<Background />
									<MiniMap />
									<Panel position="top-right">
										<div class="bg-white p-2 rounded shadow-sm">
											<small class="text-muted">
												<i class="bi bi-info-circle me-1"></i>
												Use mouse wheel to zoom, drag to pan
											</small>
											{#if executionPath.length > 0}
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
						</Col>
					</Row>
				{:else}
					<Row>
						<Col>
							<Alert color="warning">
								<i class="bi bi-exclamation-triangle me-2"></i>
								No nodes found in agent configuration. The agent may not be properly configured.
							</Alert>
						</Col>
					</Row>
				{/if}
			</Container>
		{:else}
			<div class="text-center py-4">
				<i class="bi bi-diagram-3 text-muted" style="font-size: 3rem;"></i>
				<p class="text-muted mt-2">No agent selected</p>
			</div>
		{/if}
	</ModalBody>
	<ModalFooter>
		<Button color="secondary" on:click={onClose}>Close</Button>
	</ModalFooter>
</Modal>
