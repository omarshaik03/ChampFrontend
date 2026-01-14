<script lang="ts">
    import { SvelteFlow, Background, MiniMap, Controls, Panel, Position, ConnectionLineType, type EdgeTypes, type Node, type Edge} from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
    import { get, writable } from 'svelte/store';
    import {Button} from '@sveltestrap/sveltestrap';
    import CustomEdge from './CustomEdge.svelte';
    import '@xyflow/svelte/dist/style.css';
    import dagre from '@dagrejs/dagre';
    import JsonSchemaParser from './jsonSchemaParser.svelte';

   
    import TextUpdaterNode from './TextNode.svelte';
	import { text } from '@sveltejs/kit';
    const nodeTypes = { textupdater: TextUpdaterNode };

    const edgeTypes: EdgeTypes = {
        'custom-edge': CustomEdge,
    };

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
        
    // let nodes = $state.raw<Node[]>([
    //     {
    //         id: crypto.randomUUID(),
    //         type: 'textupdater',
    //         position: { x: Math.random() * 400, y: Math.random() * 400 },
    //         data: { text: 'New Node'},
    //         style: { textAlign: 'center' },
    //     },
       
    // ]);

    // let edges = $state.raw<Edge[]>([
    //     { id: 'e1-2', source: '1', target: '2' , type: 'custom-edge' , label: 'to'},
    // ]);

    function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
 
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
 
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
 
    dagre.layout(dagreGraph);
 
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
 
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });
 
    return { nodes: layoutedNodes, edges };
  }
let optionalField = '';

function addNode(optionalFields = {}) {
    const newNode = {
        id: crypto.randomUUID(),
        type: 'textupdater',
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { 
            text: 'New Node',
            fields: [] // Initialize fields array
        },
        style: 'text-align: center;',
        ...optionalFields // Merge optional fields into the new node
    };
    nodes = [...nodes, newNode];
}

    const nodeWidth = 172;
    const nodeHeight = 36;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        [],
        [],
    );

    let nodes = $state.raw<Node[]>(layoutedNodes);
    let edges = $state.raw<Edge[]>(layoutedEdges);
    
   
    
 
 
  function onLayout(direction: string) {
    const layoutedElements = getLayoutedElements(nodes, edges, direction);
 
    nodes = layoutedElements.nodes;
    edges = layoutedElements.edges;
  }

  function handleEdgeUpdate(event) {
        const { id, data } = event.detail;
        edges = edges.map(edge => 
            edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
        );
    }
</script>





<div style:width="100vw" style:height="100vh">
    <SvelteFlow 
        bind:nodes 
        {nodeTypes} 
        bind:edges 
        {edgeTypes}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        on:edgeUpdate={handleEdgeUpdate}
        >
        <Background />
        <Controls position = 'top-left' />
        <MiniMap position="top-right"
            nodeColor={(node) => {
            switch (node.type) {
                case 'input':
                return '#6ede87';
                case 'output':
                return '#6865A5';
                case 'textupdater':
                return '#ffcc00'; 
                default:
                return '#ff0072';
              
            }
            }}
            zoomable
            pannable
        />
        <Panel position="center-left">
            <Button on:click={addNode}>Add Node</Button>
        </Panel>
        <Panel position="top-center">
            <Button onclick={() => onLayout('TB')}>vertical layout</Button>
            <Button onclick={() => onLayout('LR')}>horizontal layout</Button>
            <Button>
                <a href="/jsonParser" style="text-decoration: none; color: inherit;">JSON Schema Parser</a>
            </Button>
          </Panel>
        <Panel position="center-right">
            <!-- <Button on:click={() => {
                if (nodes.length > 1) {
                    const sourceNode = nodes[nodes.length - 2];
                    const targetNode = nodes[nodes.length - 1];
                    edges = [...edges, {
                        id: `e${sourceNode.id}-${targetNode.id}`,
                        source: sourceNode.id,
                        target: targetNode.id,
                        type: 'custom-edge',
                        label: 'to'
                    }];
                } else {
                    alert('You need at least two nodes to create an edge.');
                }
            }}>Add Edge</Button> -->
        </Panel>
    </SvelteFlow>
    <!-- <JsonSchemaParser bind:nodes bind:edges /> -->
     
</div>
<!-- 
<script>
    import { 
      SvelteFlow, 
      Controls, 
      Background, 
      MiniMap
    } from '@xyflow/svelte';
    import CustomNode from './TextNode.svelte';
    import CustomEdge from './CustomEdge.svelte';
    
    // Define custom node and edge types
    const nodeTypes = {
      customNode: CustomNode
    };
    
    const edgeTypes = {
      customEdge: CustomEdge
    };
    
    // Initial nodes and edges - ensure they're arrays
    let nodes = [
      {
        id: '1',
        type: 'customNode',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Node 1',
          description: 'First custom node'
        }
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 400, y: 200 },
        data: { 
          label: 'Node 2',
          description: 'Second custom node'
        }
      }
    ];
    
    let edges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        sourceHandle: 'output-1',
        targetHandle: 'input-1',
        type: 'customEdge',
        data: {
          label: 'Connection 1',
          color: '#0066cc',
          width: 3
        }
      }
    ];
    
    // Debug logging
    $: console.log('Nodes:', nodes, 'Array?', Array.isArray(nodes));
    $: console.log('Edges:', edges, 'Array?', Array.isArray(edges));
    
    let nodeIdCounter = 3;
    let edgeIdCounter = 2;
    
    // Function to add a new custom node
    function addCustomNode() {
      const newNode = {
        id: nodeIdCounter.toString(),
        type: 'customNode',
        position: { 
          x: Math.random() * 400 + 100, 
          y: Math.random() * 300 + 100 
        },
        data: { 
          label: `Node ${nodeIdCounter}`,
          description: `Custom node ${nodeIdCounter}`
        }
      };
      
      // Ensure nodes is still an array before spreading
      if (Array.isArray(nodes)) {
        nodes = [...nodes, newNode];
        nodeIdCounter++;
      } else {
        console.error('Nodes is not an array:', nodes);
        nodes = [newNode];
        nodeIdCounter++;
      }
    }
    
    // Handle connection events
    function onConnect(params) {
      console.log('Connection params:', params);
      
      // Ensure we have valid connection params
      if (!params.source || !params.target) {
        console.error('Invalid connection params:', params);
        return;
      }
      
      const newEdge = {
        id: `e${edgeIdCounter}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || null,
        targetHandle: params.targetHandle || null,
        type: 'customEdge',
        data: {
          label: `Edge ${edgeIdCounter}`,
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
          width: 2
        }
      };
      
      // Ensure edges is still an array before spreading
      if (Array.isArray(edges)) {
        edges = [...edges, newEdge];
        edgeIdCounter++;
      } else {
        console.error('Edges is not an array:', edges);
        edges = [newEdge];
        edgeIdCounter++;
      }
    }
    
    // Handle edge updates (when user drags edge to new target)
    function onEdgeUpdate(oldEdge, newConnection) {
      edges = edges.map(edge => {
        if (edge.id === oldEdge.id) {
          return { 
            ...edge, 
            source: newConnection.source,
            target: newConnection.target,
            sourceHandle: newConnection.sourceHandle,
            targetHandle: newConnection.targetHandle
          };
        }
        return edge;
      });
    }
    
    // Handle node deletion
    function onNodesDelete(deleted) {
      console.log('Deleted nodes:', deleted);
    }
    
    // Handle edge deletion
    function onEdgesDelete(deleted) {
      console.log('Deleted edges:', deleted);
    }
  </script>
  
  <div class="app">
    <div class="controls-panel">
      <button on:click={addCustomNode}>Add Custom Node</button>
      <p>Drag from output handles (right) to input handles (left) to create connections</p>
    </div>
    
    <div class="flow-container">
      <SvelteFlow
        {nodes}
        {edges}
        {nodeTypes}
        {edgeTypes}
        on:connect={onConnect}
        on:edgeupdate={onEdgeUpdate}
        on:nodesdelete={onNodesDelete}
        on:edgesdelete={onEdgesDelete}
        fitView
        
      >
      <Background />
      <Controls position = 'top-left' />
      <MiniMap position="top-right"
          nodeColor={(node) => {
          switch (node.type) {
              case 'input':
              return '#6ede87';
              case 'output':
              return '#6865A5';
              default:
              return '#ff0072';
          }
          }}
          zoomable
          pannable
      />
      </SvelteFlow>
    </div>
  </div>
   -->
