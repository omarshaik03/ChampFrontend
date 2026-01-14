# Agent Services Documentation

## Overview

Agent Services form the backbone of the workflow management system, providing comprehensive APIs for creating, validating, executing, and monitoring intelligent agent workflows. These services handle the complete lifecycle of agent operations, from configuration validation to real-time execution monitoring.

## Architecture

### Service Layer Structure

```
Agent Services Architecture:
├── Core Services
│   ├── agentService.ts          # Main agent management, SSE parsing, and execution handling
│   ├── agentValidation.ts       # Configuration validation
│   └── agent_crud.ts            # CRUD operations for agent graphs
└── Integration Services
    └── codeConversionService.ts # Code conversion service
```

### Data Flow Architecture

```mermaid
graph TD
    A[Client Request] --> B[Agent Service]
    B --> C{Request Type}
    C -->|Create/Update| D[Agent Crud Service]
    C -->|Execute| E[Agent Service (SSE)]
    C -->|Validate| F[Agent Validation]
    
    D --> G[API Backend]
    E --> H[Execution Stream]
    F --> I[Validation Logic]
```

## Core Agent Service (agentService.ts)

The `AgentService` class is responsible for handling Server-Sent Events (SSE) from the agent execution backend and parsing the output for the UI.

### Key Methods

- `parseSSEEvents(rawData: string): any[]`: Parses the raw SSE stream into structured events.
- `parseAgentOutput(events: any[], ...callbacks): string`: Processes the parsed events and constructs the output string for the user. It handles:
    - `session_start`: Session initialization.
    - `execution_chunk`: Real-time execution updates.
    - `interrupt`: User input requests (human-in-the-loop).

## Agent Validation (agentValidation.ts)

The `AgentValidation` class provides static methods to validate agent configurations before they are saved or executed.

### Key Methods

- `validateAgentConfig(config: any): { isValid: boolean; errors: string[] }`: Validates the structure of the agent configuration, ensuring required fields (`graph_name`, `nodes`, `edges`) and correct types are present.

## Agent CRUD Service (agent_crud.ts)

The `AgentCrudService` handles the persistence of agent graph configurations.

### Key Methods

- `saveGraphConfig(request: SaveGraphConfigRequest): Promise<SaveConfigResponse>`: Saves a new or updated graph configuration.
- `getGraphConfig(user_id: number, graph_name: string): Promise<GetConfigResponse>`: Retrieves a specific graph configuration.
- `getAllGraphConfigs(user_id: number): Promise<GetConfigResponse>`: Lists all graph configurations for a user.
- `deleteGraphConfig(user_id: number, graph_name: string): Promise<any>`: Deletes a graph configuration.

## Code Conversion Service (codeConversionService.ts)

Handles the code conversion functionality.

## Best Practices

### Service Design Patterns

1. **Static Methods**: Many services use static methods for utility functions (e.g., parsing, validation).
2. **Type Safety**: Extensive use of TypeScript interfaces for API requests and responses.
3. **Error Handling**: Services include try-catch blocks to handle API errors and parsing failures gracefully.

## See Also

- [Custom Nodes Documentation](custom-nodes.md) - Integration with visual components
- [API Reference](api-reference.md) - Complete API documentation
- [Architecture Documentation](architecture.md) - System design overview
