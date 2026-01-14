# API Reference

## Overview

This document provides a comprehensive reference for all APIs used by the frontend application, including authentication, agent management, and various tool integrations.

## Base Configuration

### Runtime Configuration

The application uses a runtime configuration system to handle API URLs. This allows the application to be configured at runtime (e.g., via Docker) without rebuilding.

Configuration is accessed via `src/lib/runtime-config.ts`:

```typescript
import { runtimeConfig } from '$lib/runtime-config';

// Example usage
const apiUrl = runtimeConfig.AI_AGENTIC_URL;
```

### API Interaction

The application uses the native `fetch` API for making HTTP requests. There is no centralized `ApiClient` wrapper. Services are responsible for constructing requests and handling responses.

```typescript
const response = await fetch(`${runtimeConfig.AI_AGENTIC_URL}/endpoint`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

## Authentication API

### POST /auth/login

Authenticate user and receive access token.

**Request:**
```typescript
interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
}
```

**Response:**
```typescript
interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    allowed_apps: string[];
    tokens_left: number;
    tokens_allocated: number;
}
```

**Example:**
```typescript
const response = await apiClient.post('/auth/login', {
    email: 'user@example.com',
    password: 'password123'
});

if (response.success) {
    const { user, token } = response.data;
    userStore.set(user);
    setAuthToken(token);
}
```

### POST /auth/refresh

Refresh authentication token.

**Request:**
```typescript
interface RefreshRequest {
    refreshToken: string;
}
```

**Response:**
```typescript
interface RefreshResponse {
    token: string;
    expiresIn: number;
}
```

### POST /auth/logout

Logout user and invalidate token.

**Request:**
```typescript
// No body required, uses Authorization header
```

**Response:**
```typescript
interface LogoutResponse {
    message: string;
}
```

## Agent Management API

### GET /agents

Retrieve list of available agents.

**Query Parameters:**
```typescript
interface AgentListParams {
    limit?: number;      // Default: 50
    offset?: number;     // Default: 0
    search?: string;     // Search by name or description
    category?: string;   // Filter by category
    running?: boolean;   // Filter by running status
}
```

**Response:**
```typescript
interface AgentListResponse {
    agents: Agent[];
    total: number;
    hasMore: boolean;
}

interface Agent {
    graph_name: string;
    description: string;
    running: boolean;
    full_config: AgentConfig;
    config_id?: number;
    created_date?: string;
}
```

**Example:**
```typescript
const agents = await agentService.getAgents({
    limit: 20,
    search: 'healthcare'
});
```

### GET /agents/:id

Retrieve specific agent configuration.

**Parameters:**
- `id` (string): Agent identifier

**Response:**
```typescript
interface AgentResponse {
    agent: Agent;
}
```

### POST /agents

Create new agent configuration.

**Request:**
```typescript
interface CreateAgentRequest {
    graph_name: string;
    description: string;
    full_config: AgentConfig;
}

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

**Response:**
```typescript
interface CreateAgentResponse {
    agent: Agent;
    validation: ValidationResult;
}
```

**Example:**
```typescript
const newAgent = await agentService.createAgent({
    graph_name: 'my_workflow',
    description: 'Custom workflow for data processing',
    full_config: {
        // Agent configuration
    }
});
```

### PUT /agents/:id

Update existing agent configuration.

**Parameters:**
- `id` (string): Agent identifier

**Request:**
```typescript
interface UpdateAgentRequest {
    graph_name?: string;
    description?: string;
    full_config?: AgentConfig;
}
```

**Response:**
```typescript
interface UpdateAgentResponse {
    agent: Agent;
    validation: ValidationResult;
}
```

### DELETE /agents/:id

Delete agent configuration.

**Parameters:**
- `id` (string): Agent identifier

**Response:**
```typescript
interface DeleteAgentResponse {
    success: boolean;
    message: string;
}
```

## Agent Execution API

### POST /agents/:id/execute

Execute agent workflow.

**Parameters:**
- `id` (string): Agent identifier

**Request:**
```typescript
interface ExecuteAgentRequest {
    input?: any;           // Initial input data
    options?: {
        timeout?: number;   // Execution timeout in ms
        debug?: boolean;    // Enable debug mode
        async?: boolean;    // Asynchronous execution
    };
}
```

**Response:**
```typescript
interface ExecuteAgentResponse {
    executionId: string;
    status: 'started' | 'completed' | 'failed';
    result?: any;          // Only present if completed synchronously
    error?: string;        // Only present if failed
}
```

**Example:**
```typescript
const execution = await agentService.executeAgent('agent-id', {
    input: { query: 'Find healthcare providers' },
    options: { timeout: 60000 }
});

// Monitor execution progress via WebSocket
socketService.on('execution_update', (update) => {
    if (update.executionId === execution.executionId) {
        console.log('Progress:', update);
    }
});
```

### GET /agents/:id/executions/:executionId

Get execution status and results.

**Parameters:**
- `id` (string): Agent identifier
- `executionId` (string): Execution identifier

**Response:**
```typescript
interface ExecutionStatusResponse {
    executionId: string;
    status: ExecutionStatus;
    progress: number;      // 0-100
    result?: any;
    error?: string;
    events: ExecutionEvent[];
    startTime: string;
    endTime?: string;
}

type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

interface ExecutionEvent {
    type: string;
    timestamp: string;
    data: any;
    nodeId?: string;
}
```

### POST /agents/:id/executions/:executionId/cancel

Cancel running execution.

**Parameters:**
- `id` (string): Agent identifier
- `executionId` (string): Execution identifier

**Response:**
```typescript
interface CancelExecutionResponse {
    success: boolean;
    message: string;
}
```

## Agent Validation API

### POST /agents/validate

Validate agent configuration without saving.

**Request:**
```typescript
interface ValidateAgentRequest {
    config: AgentConfig;
}
```

**Response:**
```typescript
interface ValidateAgentResponse {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

interface ValidationError {
    code: string;
    message: string;
    path?: string;      // Path to the invalid field
    context?: any;      // Additional context
}

interface ValidationWarning {
    code: string;
    message: string;
    path?: string;
    suggestion?: string;
}
```

**Example:**
```typescript
const validation = await agentService.validateConfig({
    graph_name: 'test_workflow',
    nodes: [/* ... */],
    edges: [/* ... */]
});

if (!validation.valid) {
    console.error('Validation errors:', validation.errors);
}
```

## Code Conversion API

### POST /code/convert

Convert code between programming languages.

**Request:**
```typescript
interface ConvertCodeRequest {
    sourceCode: string;
    sourceLanguage: string;
    targetLanguage: string;
    options?: {
        preserveComments?: boolean;
        includeExplanation?: boolean;
        optimizeOutput?: boolean;
    };
}
```

**Response:**
```typescript
interface ConvertCodeResponse {
    convertedCode: string;
    explanation?: string;
    warnings: string[];
    metadata: {
        sourceLines: number;
        targetLines: number;
        conversionTime: number;
        confidence: number;   // 0-1
    };
}
```

**Example:**
```typescript
const result = await codeService.convertCode({
    sourceCode: 'def hello():\n    print("Hello, World!")',
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
    options: {
        preserveComments: true,
        includeExplanation: true
    }
});
```

### GET /code/languages

Get supported programming languages.

**Response:**
```typescript
interface LanguagesResponse {
    languages: Language[];
}

interface Language {
    code: string;        // e.g., 'python', 'javascript'
    name: string;        // e.g., 'Python', 'JavaScript'
    extensions: string[]; // e.g., ['.py'], ['.js', '.mjs']
    category: string;    // e.g., 'scripting', 'compiled'
}
```

## Database Insights API

### POST /database/query

Execute database query and get insights.

**Request:**
```typescript
interface DatabaseQueryRequest {
    query: string;
    database: string;
    options?: {
        limit?: number;
        timeout?: number;
        explain?: boolean;
    };
}
```

**Response:**
```typescript
interface DatabaseQueryResponse {
    results: any[];
    columns: string[];
    rowCount: number;
    executionTime: number;
    insights?: {
        performance: PerformanceInsight[];
        suggestions: string[];
    };
}

interface PerformanceInsight {
    type: 'warning' | 'optimization' | 'info';
    message: string;
    impact: 'low' | 'medium' | 'high';
}
```

### GET /database/schema

Get database schema information.

**Query Parameters:**
```typescript
interface SchemaParams {
    database: string;
    table?: string;
}
```

**Response:**
```typescript
interface SchemaResponse {
    tables: Table[];
    views: View[];
    relationships: Relationship[];
}

interface Table {
    name: string;
    columns: Column[];
    indexes: Index[];
    constraints: Constraint[];
}

interface Column {
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: any;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
}
```

## Document Insights API

### POST /documents/analyze

Analyze document content and extract insights.

**Request:**
```typescript
interface AnalyzeDocumentRequest {
    content?: string;     // Text content
    file?: File;          // File upload
    url?: string;         // Document URL
    options?: {
        extractEntities?: boolean;
        summarize?: boolean;
        sentiment?: boolean;
        keywords?: boolean;
    };
}
```

**Response:**
```typescript
interface AnalyzeDocumentResponse {
    summary?: string;
    entities?: Entity[];
    sentiment?: SentimentAnalysis;
    keywords?: Keyword[];
    metadata: {
        wordCount: number;
        readingTime: number;
        language: string;
    };
}

interface Entity {
    text: string;
    type: string;        // e.g., 'PERSON', 'ORGANIZATION', 'LOCATION'
    confidence: number;
}

interface SentimentAnalysis {
    score: number;       // -1 to 1
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
}

interface Keyword {
    text: string;
    relevance: number;   // 0-1
    frequency: number;
}
```

## WebSocket Events

### Connection

```typescript
// Connect to WebSocket
const socket = io(VITE_SOCKET_URL, {
    auth: {
        token: getAuthToken()
    }
});

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
});
```

### Agent Execution Events

```typescript
// Subscribe to execution updates
socket.on('execution_update', (data: ExecutionUpdate) => {
    // Handle execution progress
});

interface ExecutionUpdate {
    executionId: string;
    agentId: string;
    type: 'started' | 'progress' | 'completed' | 'failed' | 'cancelled';
    timestamp: string;
    data?: any;
    progress?: number;
    error?: string;
}
```

### System Events

```typescript
// System notifications
socket.on('notification', (data: Notification) => {
    // Handle system notifications
});

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string;
    userId?: string;
}
```

## Error Handling

### Standard Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `AUTH_001` | Invalid credentials | Re-authenticate |
| `AUTH_002` | Token expired | Refresh token |
| `AUTH_003` | Insufficient permissions | Contact admin |
| `AGENT_001` | Invalid configuration | Fix config errors |
| `AGENT_002` | Execution failed | Check logs |
| `AGENT_003` | Agent not found | Verify agent ID |
| `API_001` | Rate limit exceeded | Retry after delay |
| `API_002` | Server error | Try again later |
| `VALIDATION_001` | Required field missing | Provide required data |
| `VALIDATION_002` | Invalid data type | Check data format |

### Error Response Format

```typescript
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
        requestId: string;
    };
}
```

### Handling Errors

```typescript
try {
    const result = await apiClient.post('/agents', agentConfig);
    return result.data;
} catch (error) {
    if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        
        switch (apiError.code) {
            case 'AUTH_002':
                await refreshToken();
                // Retry request
                break;
            case 'VALIDATION_001':
                // Show validation errors
                showValidationErrors(apiError.details);
                break;
            default:
                // Show generic error
                showError(apiError.message);
        }
    } else {
        // Network or other error
        showError('Network error occurred');
    }
    
    throw error;
}
```

## Rate Limiting

### Rate Limit Headers

```typescript
// Response headers include rate limit information
interface RateLimitHeaders {
    'X-RateLimit-Limit': string;      // Requests per window
    'X-RateLimit-Remaining': string;  // Remaining requests
    'X-RateLimit-Reset': string;      // Reset timestamp
    'X-RateLimit-Window': string;     // Window duration
}

// Check rate limit status
function checkRateLimit(response: Response) {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining && parseInt(remaining) < 10) {
        console.warn('Approaching rate limit');
    }
}
```

### Rate Limit Handling

```typescript
// Implement retry with exponential backoff
async function apiCallWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3
): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error: any) {
            lastError = error;
            
            if (error.response?.status === 429) {
                // Rate limited, wait before retry
                const retryAfter = error.response.headers['Retry-After'];
                const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, i) * 1000;
                
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            
            // Non-retryable error
            throw error;
        }
    }
    
    throw lastError;
}
```

## Pagination

### Standard Pagination

```typescript
interface PaginatedRequest {
    limit?: number;      // Items per page (default: 20, max: 100)
    offset?: number;     // Items to skip (default: 0)
    sort?: string;       // Sort field
    order?: 'asc' | 'desc'; // Sort order
}

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        limit: number;
        offset: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}
```

### Cursor-based Pagination

```typescript
interface CursorRequest {
    limit?: number;
    cursor?: string;     // Opaque cursor for next page
}

interface CursorResponse<T> {
    data: T[];
    meta: {
        nextCursor?: string;
        hasNext: boolean;
        limit: number;
    };
}
```

## See Also

- [Services Documentation](services/README.md) - Service layer implementation
- [Agent System](agent-system/README.md) - Agent system architecture
- [Authentication](authentication.md) - Authentication and authorization
- [Development Guide](development.md) - Development setup and patterns
