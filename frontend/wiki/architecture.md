# Architecture

## System Architecture Overview

This application follows a modern, component-based architecture built on SvelteKit with TypeScript, emphasizing modularity, type safety, and reactive state management.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Components    │ │      Routes     │ │      Stores     ││
│  │   (Svelte)      │ │   (SvelteKit)   │ │   (Reactive)    ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │    Services     │ │   Validation    │ │     Utils       ││
│  │  (API Calls)    │ │    (Types)      │ │   (Helpers)     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   API Client    │ │   Local Store   │ │   Socket.io     ││
│  │   (REST/HTTP)   │ │  (Browser)      │ │  (Real-time)    ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Core Architectural Patterns

### 1. Component-Based Architecture

#### Hierarchical Organization
```
Components/
├── Pages (Route Components)
│   ├── Layout Components
│   └── Feature Components
├── Common Components (Reusable)
├── Domain Components (Feature-specific)
└── Utility Components (Low-level)
```

#### Component Responsibility Levels

**Page Components** (`src/routes/`)
- Route handling and navigation
- High-level data fetching
- Layout coordination
- Authentication checks

**Feature Components** (`src/components/apps/`)
- Domain-specific functionality
- Business logic integration
- Complex user interactions
- State management coordination

**Common Components** (`src/components/common/`)
- Reusable UI elements
- Cross-cutting concerns
- Generic behaviors
- Design system implementation

### 2. State Management Architecture

#### Store Hierarchy
```typescript
// Global Application State
├── userStore (Authentication & Permissions)
├── toastStore (Notifications)
├── socketStore (Real-time Communication)
├── llmConfigStore (LLM Configuration)
├── appStore (Application State)
└── cartStore (Shopping Cart / Selections)
```

#### State Flow Pattern
```
User Action → Component Event → Store Update → Reactive UI Update
     ↑                                              ↓
     └── Async Operations ← Service Layer ← Store Action
```

### 3. Routing Architecture

#### Route Structure
```
Routes/
├── +layout.svelte (Root Layout)
├── (app)/ (Authenticated Routes)
│   ├── +layout.svelte (App Layout)
│   ├── +layout.server.ts (Server Logic)
│   ├── +page.svelte (Dashboard)
│   ├── admin/ (Admin Tools)
│   ├── auth/ (Profile Management)
│   ├── code/ (Code Tools)
│   └── [feature]/ (Other Features)
└── auth/ (Authentication)
    ├── login/
    ├── signup/
    └── profile/
```

#### Route Protection Pattern
```typescript
// Layout-based protection
export async function load({ cookies, url }) {
    const token = cookies.get('auth_token');
    if (!token && isProtectedRoute(url)) {
        throw redirect(302, '/auth/login');
    }
    return { user: await getUser(token) };
}
```

## Data Flow Architecture

### 1. Unidirectional Data Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Actions   │───▶│    Stores    │───▶│ Components  │
│ (User Input)│    │  (State)     │    │    (UI)     │
└─────────────┘    └──────────────┘    └─────────────┘
       ▲                   │                   │
       │                   ▼                   │
┌─────────────┐    ┌──────────────┐           │
│  Services   │◀───│   Effects    │◀──────────┘
│ (API Calls) │    │ (Side Effects)│
└─────────────┘    └──────────────┘
```

### 2. Reactive Patterns

#### Svelte 5 Runes Pattern
```typescript
// State Declaration
let count = $state(0);
let items = $state<Item[]>([]);

// Derived State
let filteredItems = $derived(
    items.filter(item => item.category === selectedCategory)
);

// Effects
$effect(() => {
    // Side effects when dependencies change
    logAnalytics('items_filtered', { count: filteredItems.length });
});
```

#### Store Integration
```typescript
// Store Definition
export const userStore = writable<User | null>(null);

// Component Usage
import { userStore } from '$lib/stores/userStore';

// Reactive statement
$: isAdmin = $userStore?.role === 'admin';
```

## Service Architecture

### 1. Service Layer Pattern

```typescript
// Service Interface
interface AgentService {
    getAgents(): Promise<Agent[]>;
    createAgent(config: AgentConfig): Promise<Agent>;
    executeAgent(id: string): Promise<ExecutionResult>;
    validateConfig(config: AgentConfig): ValidationResult;
}

// Implementation
export class AgentServiceImpl implements AgentService {
    constructor(
        private apiClient: ApiClient,
        private validator: AgentValidator
    ) {}
    
    async getAgents(): Promise<Agent[]> {
        // Implementation
    }
}
```

### 2. API Client Architecture

```typescript
// HTTP Client
class ApiClient {
    private baseUrl: string;
    private token: string;
    
    async get<T>(endpoint: string): Promise<T> {
        // HTTP GET implementation
    }
    
    async post<T>(endpoint: string, data: any): Promise<T> {
        // HTTP POST implementation
    }
}

// Socket Client
class SocketClient {
    private socket: Socket;
    
    connect(): void {
        // Socket.io connection
    }
    
    subscribe<T>(event: string, handler: (data: T) => void): void {
        // Event subscription
    }
}
```

## Security Architecture

### 1. Authentication Flow

```
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Login      │───▶│   Server    │───▶│   JWT Token  │
│   Request    │    │   Auth      │    │   Response   │
└──────────────┘    └─────────────┘    └──────────────┘
                            │                   │
                            ▼                   ▼
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Store      │◀───│  Client     │◀───│   Client     │
│   Token      │    │  Storage    │    │   Redirect   │
└──────────────┘    └─────────────┘    └──────────────┘
```

### 2. Authorization Pattern

```typescript
// Route-level Authorization
export async function load({ cookies, url }) {
    const user = await getUser(cookies.get('auth_token'));
    const requiredApp = getRequiredApp(url.pathname);
    
    if (requiredApp && !user.allowed_apps.includes(requiredApp)) {
        throw redirect(302, '/unauthorized');
    }
    
    return { user };
}

// Component-level Authorization
$: canAccess = $userStore?.allowed_apps?.includes('Admin') ?? false;
```

## Agent System Architecture

### 1. Graph Processing Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Agent Config   │───▶│  Graph Parser   │───▶│  Visual Graph   │
│     (JSON)      │    │  (Validation)   │    │ (SvelteFlow)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Execution     │    │    Layout       │    │   Interactive   │
│    Engine       │    │   Algorithm     │    │    Controls     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. Node Type System

```typescript
// Abstract Node Interface
interface Node {
    id: string;
    template: string;
    config: NodeConfig;
}

// Concrete Node Types
interface LLMNode extends Node {
    template: 'core.LLMToolNode';
    config: LLMConfig;
}

interface ToolNode extends Node {
    template: 'core.ToolNode';
    config: ToolConfig;
}

interface SubGraphNode extends Node {
    template: 'core.SubGraphNode';
    config: SubGraphConfig;
}
```

## Performance Architecture

### 1. Optimization Strategies

#### Code Splitting
```typescript
// Route-based splitting
const AdminPage = lazy(() => import('./AdminPage.svelte'));
const CodeConversion = lazy(() => import('./CodeConversion.svelte'));
```

#### Reactive Optimization
```typescript
// Efficient derived state
let expensiveComputation = $derived.by(() => {
    if (!needsComputation) return cached;
    return performExpensiveOperation(data);
});

// Debounced effects
let debouncedSearch = $derived(debounce(searchTerm, 300));
```

### 2. Memory Management

#### Store Cleanup
```typescript
// Component lifecycle
onDestroy(() => {
    unsubscribeFromStore();
    socketClient.disconnect();
    cancelPendingRequests();
});
```

#### Event Cleanup
```typescript
// Event listener management
onMount(() => {
    const handler = (event) => { /* handle */ };
    document.addEventListener('custom-event', handler);
    
    return () => {
        document.removeEventListener('custom-event', handler);
    };
});
```

## Error Handling Architecture

### 1. Error Boundaries

```typescript
// Component Error Handling
try {
    const result = await riskyOperation();
    // Handle success
} catch (error) {
    console.error('Operation failed:', error);
    toastStore.addToast({
        type: 'error',
        message: getErrorMessage(error)
    });
}
```

### 2. Global Error Handler

```typescript
// Global error interceptor
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Report to error tracking service
});

// API error handling
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.status === 401) {
            // Handle authentication error
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);
```

## Build Architecture

### 1. Development Build

```
Development Pipeline:
Source Files → TypeScript Compiler → Svelte Compiler → Vite Dev Server
     ↓                ↓                     ↓               ↓
Type Check → Component Transform → Module Bundle → Hot Reload
```

### 2. Production Build

```
Production Pipeline:
Source Files → TypeScript → Svelte → Vite Build → Static Assets
     ↓            ↓          ↓          ↓            ↓
Type Check → Transform → Bundle → Optimize → Deploy
```

## Design Principles

### 1. Separation of Concerns
- **Components**: UI logic and presentation
- **Services**: Business logic and API communication  
- **Stores**: State management and data flow
- **Utils**: Pure functions and helpers

### 2. Single Responsibility
- Each component has one primary responsibility
- Services handle one domain or API
- Stores manage one aspect of application state

### 3. Dependency Inversion
- Components depend on abstractions (stores, services)
- Services depend on interfaces, not implementations
- Easy testing and mocking

### 4. Open/Closed Principle
- Extensible through configuration and composition
- Closed for modification of core functionality
- Plugin-based architecture for features

## Scalability Considerations

### 1. Horizontal Scaling
- Component reusability across features
- Service modularity for team distribution
- Independent feature development

### 2. Vertical Scaling
- Performance optimization at each layer
- Efficient state management
- Lazy loading and code splitting

### 3. Maintainability
- Clear architectural boundaries
- Comprehensive documentation
- Consistent coding patterns
- Type safety throughout

## See Also

- [Component Architecture](components/README.md)
- [State Management](stores/README.md)
- [Agent System Architecture](agent-system/README.md)
- [Service Layer Documentation](services/README.md)
