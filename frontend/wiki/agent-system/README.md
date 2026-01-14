# Agent System Documentation

## Overview

The Agent System is a powerful workflow visualization and execution engine that allows users to create, modify, and execute complex AI-powered workflows using a visual graph interface.

## Table of Contents

1. [Architecture](#architecture)
2. [Components](#components)
3. [Graph Visualization](#graph-visualization)
4. [Node Types](#node-types)
5. [Workflow Execution](#workflow-execution)
6. [Subgraph System](#subgraph-system)
7. [Configuration](#configuration)
8. [API Integration](#api-integration)

## Architecture

### Core Components

```
Agent System Architecture
├── AgentsTab.svelte          # Main agent management interface
├── AgentGraphModal.svelte    # Graph visualization modal
├── CustomNodes.svelte        # Custom node renderer
├── AgentGraphUtils.ts        # Graph parsing and utilities
└── Agent Validation          # Configuration validation
```

### Data Flow

1. **Agent Configuration** → Stored as JSON with nodes, edges, and metadata
2. **Graph Parsing** → Converted to visual representation using AgentGraphUtils
3. **Visualization** → Rendered using SvelteFlow with custom nodes
4. **Interaction** → User interactions trigger state updates and re-rendering
5. **Execution** → Real-time execution tracking with visual feedback

## Components

### AgentsTab.svelte

Main interface for agent management:

```typescript
// Key features:
- Agent list display
- Create/edit/delete operations
- Graph modal triggering
- Execution status tracking
```

**Props:**
- `agents: Agent[]` - Array of available agents
- `selectedAgent?: Agent` - Currently selected agent

**Events:**
- `agentSelected` - When an agent is clicked
- `agentExecuted` - When execution is triggered

### AgentGraphModal.svelte

Full-screen modal for graph visualization:

```typescript
// Key features:
- Interactive graph display
- Node expansion/collapse
- Execution path highlighting
- Real-time updates
```

**Props:**
- `isOpen: boolean` - Modal visibility
- `agent: Agent` - Agent to visualize
- `executionPath: string[]` - Executed node IDs
- `executionData: any[]` - Execution event data

### CustomNodes.svelte

Renders individual nodes in the graph:

```typescript
// Two modes:
1. Display mode - For subgraph and visualization nodes
2. Configuration mode - For editable node properties
```

**Features:**
- Dynamic node styling based on type
- Click handling for subgraph expansion
- Real-time execution status
- Accessibility support

### AgentGraphUtils.ts

Core utilities for graph processing:

```typescript
// Main functions:
- parseAgentConfig() - Convert JSON to visual graph
- calculateNodePositions() - Auto-layout algorithm
- getNodeTypeInfo() - Node styling and metadata
```

## Graph Visualization

### SvelteFlow Integration

The system uses SvelteFlow for interactive graph rendering:

```typescript
<SvelteFlow 
    {nodes} 
    {edges} 
    {nodeTypes} 
    fitView 
    on:nodeclick={handleNodeClick}
>
    <Controls />
    <Background />
    <MiniMap />
</SvelteFlow>
```

### Visual Features

- **Auto Layout**: Hierarchical node positioning
- **Interactive Controls**: Pan, zoom, minimap
- **Custom Styling**: Node types with distinct colors and icons
- **Execution Highlighting**: Visual feedback for executed paths
- **Subgraph Expansion**: Click to expand/collapse subgraphs

### Node Positioning

Automatic layout using hierarchical algorithm:

1. **Root Detection**: Find nodes with no incoming edges
2. **Level Assignment**: BFS traversal to assign depth levels
3. **Position Calculation**: Distribute nodes across levels
4. **Spacing**: Maintain consistent spacing and readability

## Node Types

### Core Node Templates

| Template | Purpose | Icon | Color |
|----------|---------|------|--------|
| `core.HumanInputNode` | User input collection | 👤 | #4CAF50 |
| `core.LLMToolNode` | LLM with tool access | 🤖 | #2196F3 |
| `core.ToolNode` | Tool execution | 🔧 | #FF9800 |
| `core.SubGraphNode` | Workflow subgraph | 📊 | #9C27B0 |
| `__start__` | Workflow start | ▶️ | #9C27B0 |
| `__end__` | Workflow end | ⏹️ | #F44336 |

### Node Configuration

Each node has a standardized configuration structure:

```typescript
interface Node {
    id: string;
    template: string;
    config: {
        // Common fields
        target?: string;
        prompt?: string;
        
        // Node-specific fields
        tool_names?: string[];
        tool_config?: Record<string, any>;
        llm_id?: string;
    };
}
```

### Custom Node Rendering

Nodes are rendered with context-aware styling:

- **Execution Status**: Green border for executed nodes
- **Subgraph State**: Different styling for expanded/collapsed
- **Node Type**: Distinct colors and icons per template
- **Interactive**: Hover effects and click handling

## Workflow Execution

### Execution Tracking

Real-time execution visualization:

```typescript
// Execution path tracking
const executionPath = extractExecutionPath(executionData);

// Visual highlighting
visualNodes = visualNodes.map(node => {
    const wasExecuted = executionPath.includes(node.id);
    if (wasExecuted) {
        return {
            ...node,
            style: node.style + '; border: 3px solid #00ff00;',
            data: { ...node.data, executed: true }
        };
    }
    return node;
});
```

### Execution Events

The system processes various execution event types:

- `session_start` - Workflow initiation
- `execution_chunk` - Node execution steps
- `interrupt` - User interruptions
- `execution_complete` - Workflow completion
- `error` - Error conditions

### Live Updates

Socket.io integration for real-time updates:

```typescript
// Socket connection for live execution data
socket.on('execution_update', (data) => {
    executionData = [...executionData, data];
    // Update visualization
});
```

## Subgraph System

### Hierarchical Workflows

Subgraphs enable nested workflow structures:

```typescript
// Subgraph node structure
{
    id: "specialist_assignment_agent",
    template: "core.SubGraphNode",
    config: {
        subgraph: {
            graph_name: "Specialist Assignment",
            nodes: [...],
            edges: [...],
            conditional_edges: [...]
        }
    }
}
```

### Expansion Mechanism

Interactive subgraph expansion:

1. **Click Detection**: CustomNode handles subgraph clicks
2. **State Update**: Toggle expansion state in `expandedSubgraphs` Set
3. **Graph Reparse**: Regenerate graph with internal nodes
4. **Visual Update**: Display internal nodes with prefixed IDs

### Internal Node Handling

When expanded, subgraph nodes are added with prefixed IDs:

```typescript
// Example: subgraph "workflow_A" with internal node "step_1"
// Results in: "workflow_A.step_1"
const internalNodeId = `${parentSubgraphId}.${internalNodeId}`;
```

## Configuration

### Agent Configuration Structure

```typescript
interface AgentConfig {
    graph_name: string;
    description: string;
    state_schema?: Record<string, any>;
    nodes: Node[];
    edges: Edge[];
    conditional_edges?: ConditionalEdge[];
    llms?: LLM[];
    tool_config?: Record<string, any>;
}
```

### Validation System

Comprehensive validation in `agentValidation.ts`:

- **Required Fields**: Ensure all mandatory fields are present
- **Type Checking**: Validate data types and structures
- **Reference Integrity**: Check edge references and dependencies
- **Tool Configuration**: Validate tool_names, tool_config, or tools fields

### Configuration Examples

**Simple Tool Node:**
```json
{
    "id": "search_node",
    "template": "core.ToolNode",
    "config": {
        "target": "messages",
        "tool_names": ["web_search", "image_search"]
    }
}
```

**Complex Tool Node:**
```json
{
    "id": "analysis_node",
    "template": "core.ToolNode", 
    "config": {
        "target": "results",
        "tool_config": {
            "analyzer": {
                "depth": "detailed",
                "format": "json"
            },
            "formatter": {
                "style": "markdown"
            }
        }
    }
}
```

## API Integration

### Backend Communication

The agent system integrates with backend APIs for:

- **Agent CRUD**: Create, read, update, delete operations
- **Execution**: Trigger and monitor workflow execution
- **Validation**: Server-side configuration validation
- **Real-time Updates**: Socket.io for live execution data

### Error Handling

Comprehensive error handling throughout the system:

```typescript
try {
    const { nodes, edges } = parseAgentConfig(config);
    // Update visualization
} catch (error) {
    console.error('Graph parsing error:', error);
    // Display user-friendly error message
}
```

## Development Guidelines

### Adding New Node Types

1. **Define Template**: Add template string to node type mapping
2. **Update Styling**: Add color, icon, and styling in `getNodeTypeInfo`
3. **Add Validation**: Update `agentValidation.ts` for new node requirements
4. **Test Integration**: Ensure proper rendering and interaction

### Extending Functionality

- **Custom Layouts**: Modify `calculateNodePositions` for new algorithms
- **Node Interactions**: Extend `handleNodeClick` for new behaviors
- **Visual Enhancements**: Add new styling patterns in `CustomNodes.svelte`
- **Data Processing**: Extend `parseAgentConfig` for new configuration formats

### Debugging

Use comprehensive console logging:

```typescript
console.log('🔬 parseAgentConfig called with config:', config);
console.log('🔍 Expanding subgraph:', nodeId, 'config:', subgraphConfig);
console.log('✅ Graph reparsed with new expansion state');
```

## Performance Considerations

### Optimization Strategies

- **Lazy Loading**: Only render visible nodes
- **Memoization**: Cache expensive calculations
- **Debounced Updates**: Prevent excessive re-renders
- **Efficient State Updates**: Minimize reactive dependencies

### Large Graph Handling

- **Virtualization**: Consider virtual scrolling for large graphs
- **Level-of-Detail**: Show simplified views for complex subgraphs
- **Progressive Loading**: Load subgraphs on demand

## See Also

- [Graph Visualization Guide](graph-visualization.md)
- [Node Configuration Reference](node-configuration.md)
- [Execution Tracking](execution-tracking.md)
- [Component Documentation](../components/agent-graph.md)
