# Development Guide

## Development Environment Setup

### Prerequisites

- **Node.js** v18+ (Latest LTS recommended)
- **npm** v8+ or **pnpm** v7+ or **yarn** v3+
- **Git** for version control
- **VS Code** (recommended) with Svelte extension

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

```
main
├── develop
├── feature/agent-graph-improvements
├── feature/code-conversion-ui
├── bugfix/navigation-issue
└── hotfix/critical-security-fix
```

**Branch Types:**
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features and enhancements
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Commit Conventions

Follow conventional commits:

```bash
# Feature
git commit -m "feat(agent): add subgraph expansion functionality"

# Bug fix
git commit -m "fix(navigation): resolve mobile menu closing issue"

# Documentation
git commit -m "docs(wiki): add component documentation"

# Refactoring
git commit -m "refactor(services): improve error handling patterns"

# Tests
git commit -m "test(agent): add unit tests for graph parsing"
```

### Code Review Process

1. **Create Feature Branch**
2. **Implement Changes** with tests
3. **Self Review** - check code quality
4. **Create Pull Request** with description
5. **Automated Checks** - linting, tests
6. **Peer Review** - code review
7. **Merge** after approval

## Code Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// Always define interfaces for complex objects
interface User {
    id: string;
    name: string;
    email: string;
    allowed_apps: string[];
    tokens_left?: number; // Optional fields marked clearly
}

// Use union types for constrained values
type AppName = 'CodeConvert' | 'DatabaseInsights' | 'DocumentInsights';

// Prefer explicit return types for functions
function processAgent(config: AgentConfig): Promise<ProcessResult> {
    // Implementation
}
```

#### Generic Patterns
```typescript
// Generic service interfaces
interface CRUDService<T, K = string> {
    getById(id: K): Promise<T>;
    create(item: Omit<T, 'id'>): Promise<T>;
    update(id: K, updates: Partial<T>): Promise<T>;
    delete(id: K): Promise<boolean>;
}

// Utility types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

### Svelte 5 Patterns

#### Component Structure
```typescript
<script lang="ts">
    // 1. Imports
    import { createEventDispatcher } from 'svelte';
    import type { ComponentType } from './types';
    
    // 2. Props with types and defaults
    let { 
        title = "Default Title",
        items = [],
        onItemClick 
    }: {
        title?: string;
        items?: Item[];
        onItemClick?: (item: Item) => void;
    } = $props();
    
    // 3. Local state
    let isLoading = $state(false);
    let selectedItem = $state<Item | null>(null);
    
    // 4. Derived state
    let filteredItems = $derived(
        items.filter(item => item.visible)
    );
    
    // 5. Effects
    $effect(() => {
        console.log('Items changed:', items.length);
    });
    
    // 6. Event handlers
    function handleItemClick(item: Item) {
        selectedItem = item;
        onItemClick?.(item);
    }
    
    // 7. Lifecycle (if needed)
    import { onMount, onDestroy } from 'svelte';
    
    onMount(() => {
        // Setup code
    });
</script>

<!-- Template with clear structure -->
<div class="component-container">
    <header>
        <h2>{title}</h2>
    </header>
    
    <main>
        {#if isLoading}
            <div class="loading">Loading...</div>
        {:else if filteredItems.length > 0}
            {#each filteredItems as item (item.id)}
                <ItemComponent 
                    {item} 
                    selected={item === selectedItem}
                    onclick={() => handleItemClick(item)}
                />
            {/each}
        {:else}
            <div class="empty-state">No items found</div>
        {/if}
    </main>
</div>

<style>
    .component-container {
        /* Component styles */
    }
</style>
```

#### Store Patterns
```typescript
// Store definition
import { writable, derived } from 'svelte/store';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    permissions: string[];
}

function createUserStore() {
    const { subscribe, set, update } = writable<UserState>({
        user: null,
        isAuthenticated: false,
        permissions: []
    });
    
    return {
        subscribe,
        login: (user: User) => update(state => ({
            ...state,
            user,
            isAuthenticated: true,
            permissions: user.allowed_apps
        })),
        logout: () => set({
            user: null,
            isAuthenticated: false,
            permissions: []
        }),
        updateUser: (updates: Partial<User>) => update(state => ({
            ...state,
            user: state.user ? { ...state.user, ...updates } : null
        }))
    };
}

export const userStore = createUserStore();

// Derived stores
export const isAdmin = derived(
    userStore,
    $userStore => $userStore.permissions.includes('Admin')
);
```

### Styling Guidelines

#### Bootstrap Integration
```scss
// Use Bootstrap classes for layout
<div class="container-fluid">
    <div class="row">
        <div class="col-md-6">
            <!-- Content -->
        </div>
    </div>
</div>

// Custom styles for component-specific design
<style lang="scss">
    .custom-component {
        // Use Bootstrap variables when possible
        padding: $spacer;
        border-radius: $border-radius;
        
        // Custom properties
        transition: all 0.2s ease;
        
        &:hover {
            transform: translateY(-2px);
        }
        
        // Responsive design
        @media (max-width: 768px) {
            padding: $spacer * 0.5;
        }
    }
</style>
```

#### Design System Variables
```scss
// Use consistent design tokens
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    
    --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-size-base: 1rem;
    --line-height-base: 1.5;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 3rem;
    
    --border-radius: 0.375rem;
    --box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
```

## Testing Strategy

### Unit Testing

#### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Button from '../Button.svelte';

test('renders button with correct text', () => {
    const { getByText } = render(Button, {
        props: { text: 'Click me' }
    });
    
    expect(getByText('Click me')).toBeInTheDocument();
});

test('calls onclick handler when clicked', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    const { getByRole } = render(Button, {
        props: { text: 'Click me', onclick: handleClick }
    });
    
    await fireEvent.click(getByRole('button'));
    expect(clicked).toBe(true);
});
```

#### Service Testing
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentService } from '../services/agentService';

describe('AgentService', () => {
    let service: AgentService;
    let mockApiClient: any;
    
    beforeEach(() => {
        mockApiClient = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn()
        };
        service = new AgentService(mockApiClient);
    });
    
    it('should fetch agents successfully', async () => {
        const mockAgents = [{ id: '1', name: 'Test Agent' }];
        mockApiClient.get.mockResolvedValue(mockAgents);
        
        const result = await service.getAgents();
        
        expect(result).toEqual(mockAgents);
        expect(mockApiClient.get).toHaveBeenCalledWith('/agents');
    });
});
```

### Integration Testing

#### API Integration
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestServer } from '../test/setup';

describe('Agent API Integration', () => {
    let testServer: TestServer;
    
    beforeAll(async () => {
        testServer = await setupTestServer();
    });
    
    afterAll(async () => {
        await testServer.cleanup();
    });
    
    it('should perform complete agent workflow', async () => {
        // Test agent creation, retrieval, update, deletion
        const agentConfig = createTestAgentConfig();
        
        // Create
        const created = await testServer.post('/agents', agentConfig);
        expect(created.id).toBeDefined();
        
        // Read
        const retrieved = await testServer.get(`/agents/${created.id}`);
        expect(retrieved).toMatchObject(agentConfig);
        
        // Update
        const updates = { description: 'Updated description' };
        const updated = await testServer.put(`/agents/${created.id}`, updates);
        expect(updated.description).toBe(updates.description);
        
        // Delete
        await testServer.delete(`/agents/${created.id}`);
        const deleted = await testServer.get(`/agents/${created.id}`);
        expect(deleted).toBeNull();
    });
});
```

### End-to-End Testing

#### Playwright Setup
```typescript
import { test, expect } from '@playwright/test';

test('agent graph visualization workflow', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to agents
    await page.goto('/admin');
    await page.click('[data-testid="agents-tab"]');
    
    // Open agent graph
    await page.click('[data-testid="agent-graph-button"]');
    await expect(page.locator('[data-testid="agent-graph-modal"]')).toBeVisible();
    
    // Test subgraph expansion
    await page.click('[data-testid="subgraph-node"]');
    await expect(page.locator('[data-testid="expanded-subgraph"]')).toBeVisible();
});
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npx depcheck

# Audit dependencies
npm audit
```

### Code Splitting

```typescript
// Route-based splitting
const AdminPage = lazy(() => import('./AdminPage.svelte'));
const CodeConversion = lazy(() => import('./CodeConversion.svelte'));

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));

// Dynamic imports in components
async function loadFeature() {
    const { FeatureModule } = await import('./feature-module');
    return new FeatureModule();
}
```

### Performance Monitoring

```typescript
// Performance measurement
function measurePerformance<T>(name: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    // Send to analytics
    if (typeof result === 'object' && 'then' in result) {
        result.then(() => {
            analytics.timing(name, end - start);
        });
    } else {
        analytics.timing(name, end - start);
    }
    
    return result;
}

// Usage
const agents = await measurePerformance('load-agents', () => 
    agentService.getAgents()
);
```

## Debugging

### Development Tools

#### Browser DevTools
- **Svelte DevTools**: Install browser extension
- **Console Logging**: Structured logging patterns
- **Network Tab**: API request monitoring
- **Performance Tab**: Rendering performance

#### VS Code Extensions
- **Svelte for VS Code**: Syntax highlighting and IntelliSense
- **TypeScript Hero**: Import management
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Thunder Client**: API testing

### Debugging Patterns

#### Component Debugging
```typescript
// Debug reactive statements
$effect(() => {
    console.log('🔍 Debug - items changed:', {
        count: items.length,
        firstItem: items[0],
        timestamp: new Date().toISOString()
    });
});

// Debug props changes
$effect(() => {
    console.log('🔍 Debug - props changed:', {
        title,
        isOpen,
        selectedId
    });
});
```

#### Service Debugging
```typescript
class AgentService {
    private debug = (message: string, data?: any) => {
        if (import.meta.env.DEV) {
            console.log(`🤖 AgentService: ${message}`, data);
        }
    };
    
    async getAgents(): Promise<Agent[]> {
        this.debug('Fetching agents...');
        
        try {
            const agents = await this.apiClient.get('/agents');
            this.debug('Agents fetched successfully', { count: agents.length });
            return agents;
        } catch (error) {
            this.debug('Failed to fetch agents', error);
            throw error;
        }
    }
}
```

### Error Tracking

#### Error Boundaries
```typescript
// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    errorTracker.capture(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    errorTracker.capture(event.reason);
});

// Component error handling
try {
    await riskyOperation();
} catch (error) {
    console.error('Component error:', error);
    toastStore.addToast({
        type: 'error',
        message: 'Operation failed. Please try again.'
    });
    errorTracker.capture(error, {
        component: 'ComponentName',
        operation: 'riskyOperation'
    });
}
```

## Deployment

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],
    build: {
        target: 'es2020',
        minify: 'terser',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['svelte'],
                    ui: ['@sveltestrap/sveltestrap'],
                    graph: ['@xyflow/svelte']
                }
            }
        }
    },
    optimizeDeps: {
        include: ['@xyflow/svelte', 'dayjs']
    }
});
```

### Environment Configuration

```bash
# Production environment variables
VITE_API_BASE_URL=https://api.production.com
VITE_SOCKET_URL=wss://socket.production.com
VITE_ANALYTICS_ID=prod-analytics-id
VITE_ERROR_TRACKING_DSN=https://error-tracking-dsn
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy
        uses: deployment-action@v1
        with:
          target: production
          artifacts: dist/
```

## Security Considerations

### Authentication Security
- Store tokens securely (httpOnly cookies preferred)
- Implement token refresh mechanisms
- Validate permissions on every route
- Use HTTPS in production

### XSS Prevention
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html);
}

// Use {@html} carefully
{@html sanitizeHtml(userContent)}
```

### CSRF Protection
```typescript
// Include CSRF tokens in forms
<form method="post" use:enhance>
    <input type="hidden" name="_token" value="{csrfToken}" />
    <!-- Form fields -->
</form>
```

## Best Practices Summary

### Code Quality
- Use TypeScript for type safety
- Follow consistent naming conventions
- Write self-documenting code
- Implement comprehensive error handling

### Performance
- Minimize bundle size
- Implement efficient caching
- Use lazy loading for heavy components
- Monitor performance metrics

### Maintainability
- Keep components small and focused
- Use consistent patterns across the codebase
- Write comprehensive tests
- Document complex logic

### Security
- Validate all inputs
- Implement proper authentication
- Use secure communication (HTTPS/WSS)
- Keep dependencies updated

## See Also

- [Architecture Guide](architecture.md)
- [Component Documentation](components/README.md)
- [Service Layer](services/README.md)
- [Troubleshooting](troubleshooting.md)
