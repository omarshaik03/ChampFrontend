# Testing Guide

## Overview

This document covers testing strategies, patterns, and tools for the frontend application. It includes unit testing, component testing, integration testing, and end-to-end testing approaches.

## Testing Stack

### Core Testing Tools

- **Vitest** - Fast unit test runner with Vite integration
- **Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing framework
- **MSW** - Mock Service Worker for API mocking
- **Storybook** - Component development and testing

### Test File Structure

```
src/
  components/
    auth/
      login.svelte
      login.test.ts
      login.stories.ts
  lib/
    services/
      agentService.ts
      agentService.test.ts
    utils/
      validation.ts
      validation.test.ts
  routes/
    (app)/
      +page.svelte
      +page.test.ts
tests/
  e2e/
    auth.spec.ts
    agent-workflow.spec.ts
  integration/
    api.test.ts
    websocket.test.ts
  fixtures/
    agents.json
    users.json
  helpers/
    test-utils.ts
    mock-server.ts
```

## Unit Testing

### Test Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      $lib: new URL('./src/lib', import.meta.url).pathname,
      $app: new URL('./src/app', import.meta.url).pathname
    }
  }
});
```

### Test Setup (src/tests/setup.ts)

```typescript
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
vi.mock('$env/static/public', () => ({
  PUBLIC_API_URL: 'http://localhost:3000/api',
  PUBLIC_WS_URL: 'ws://localhost:3000/ws'
}));

// Mock SvelteKit modules
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn(() => vi.fn())
  },
  navigating: {
    subscribe: vi.fn(() => vi.fn())
  }
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  preloadData: vi.fn()
}));

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
  readyState: 1
}));
```

### Service Testing

```typescript
// src/lib/services/agentService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { agentService } from './agentService';
import { apiClient } from '$lib/api';

// Mock API client
vi.mock('$lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('AgentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAgents', () => {
    it('should fetch agents with default parameters', async () => {
      const mockAgents = [
        { graph_name: 'test-agent', description: 'Test agent' }
      ];
      
      (apiClient.get as any).mockResolvedValue({
        success: true,
        data: { agents: mockAgents, total: 1 }
      });

      const result = await agentService.getAgents();

      expect(apiClient.get).toHaveBeenCalledWith('/agents', {
        params: { limit: 50, offset: 0 }
      });
      expect(result.agents).toEqual(mockAgents);
    });

    it('should handle API errors', async () => {
      (apiClient.get as any).mockRejectedValue(new Error('Network error'));

      await expect(agentService.getAgents()).rejects.toThrow('Network error');
    });

    it('should pass search parameters', async () => {
      await agentService.getAgents({ search: 'healthcare', limit: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/agents', {
        params: { limit: 10, offset: 0, search: 'healthcare' }
      });
    });
  });

  describe('createAgent', () => {
    it('should create new agent', async () => {
      const agentConfig = {
        graph_name: 'new-agent',
        description: 'New agent',
        full_config: { nodes: [], edges: [] }
      };

      const mockResponse = {
        success: true,
        data: { agent: agentConfig, validation: { valid: true } }
      };

      (apiClient.post as any).mockResolvedValue(mockResponse);

      const result = await agentService.createAgent(agentConfig);

      expect(apiClient.post).toHaveBeenCalledWith('/agents', agentConfig);
      expect(result.agent).toEqual(agentConfig);
    });

    it('should handle validation errors', async () => {
      const agentConfig = { graph_name: '', description: '', full_config: {} };

      const mockResponse = {
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Required fields missing',
          details: { fields: ['graph_name'] }
        }
      };

      (apiClient.post as any).mockRejectedValue({
        response: { data: mockResponse }
      });

      await expect(agentService.createAgent(agentConfig)).rejects.toMatchObject({
        response: { data: mockResponse }
      });
    });
  });

  describe('executeAgent', () => {
    it('should execute agent with input', async () => {
      const mockResponse = {
        success: true,
        data: {
          executionId: 'exec-123',
          status: 'started'
        }
      };

      (apiClient.post as any).mockResolvedValue(mockResponse);

      const result = await agentService.executeAgent('agent-123', {
        input: { query: 'test' }
      });

      expect(apiClient.post).toHaveBeenCalledWith('/agents/agent-123/execute', {
        input: { query: 'test' }
      });
      expect(result.executionId).toBe('exec-123');
    });
  });
});
```

### Utility Testing

```typescript
// src/lib/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateAgentConfig, validateEmail, validatePassword } from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should require uppercase, lowercase, and numbers', () => {
      const result = validatePassword('lowercase123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain uppercase letter');
    });
  });

  describe('validateAgentConfig', () => {
    it('should validate complete agent configuration', () => {
      const config = {
        graph_name: 'test-agent',
        description: 'Test agent',
        nodes: [
          { id: 'start', type: 'start' },
          { id: 'end', type: 'end' }
        ],
        edges: [
          { from: 'start', to: 'end' }
        ]
      };

      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const config = {
        description: 'Missing name'
      };

      const result = validateAgentConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('graph_name is required');
    });

    it('should validate node references in edges', () => {
      const config = {
        graph_name: 'test',
        description: 'Test',
        nodes: [{ id: 'node1', type: 'start' }],
        edges: [{ from: 'node1', to: 'nonexistent' }]
      };

      const result = validateAgentConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Edge references unknown node: nonexistent');
    });
  });
});
```

## Component Testing

### Svelte Component Testing

```typescript
// src/components/auth/login.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import Login from './login.svelte';
import { authStore } from '$lib/stores/authStore';

// Mock stores
vi.mock('$lib/stores/authStore', () => ({
  authStore: {
    login: vi.fn(),
    subscribe: vi.fn()
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(Login);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(Login);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await fireEvent.click(submitButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('should call authStore.login on form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    (authStore.login as any) = mockLogin;

    render(Login);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.input(passwordInput, { target: { value: 'password123' } });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should display error message on login failure', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    (authStore.login as any) = mockLogin;

    render(Login);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.input(passwordInput, { target: { value: 'wrongpassword' } });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    render(Login);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
```

### Agent Graph Component Testing

```typescript
// src/components/AgentGraphModal.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AgentGraphModal from './AgentGraphModal.svelte';
import { agentStore } from '$lib/stores/agentStore';

const mockAgent = {
  graph_name: 'test-agent',
  description: 'Test agent for healthcare',
  full_config: {
    nodes: [
      { id: 'start', type: 'start', label: 'Start' },
      { id: 'llm1', type: 'llm', label: 'Process Query' },
      { id: 'end', type: 'end', label: 'End' }
    ],
    edges: [
      { from: 'start', to: 'llm1' },
      { from: 'llm1', to: 'end' }
    ]
  }
};

describe('AgentGraphModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render agent graph', () => {
    render(AgentGraphModal, {
      props: {
        agent: mockAgent,
        isOpen: true
      }
    });

    expect(screen.getByText('test-agent')).toBeInTheDocument();
    expect(screen.getByText('Test agent for healthcare')).toBeInTheDocument();
  });

  it('should display graph nodes', () => {
    render(AgentGraphModal, {
      props: {
        agent: mockAgent,
        isOpen: true
      }
    });

    // Check if nodes are rendered (these would be in the flow diagram)
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Process Query')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('should handle subgraph expansion', async () => {
    const agentWithSubgraph = {
      ...mockAgent,
      full_config: {
        ...mockAgent.full_config,
        nodes: [
          ...mockAgent.full_config.nodes,
          {
            id: 'subgraph1',
            type: 'subgraph',
            label: 'Healthcare Workflow',
            config: {
              subgraph: {
                nodes: [
                  { id: 'sub1', type: 'llm', label: 'Analyze Symptoms' }
                ],
                edges: []
              }
            }
          }
        ]
      }
    };

    render(AgentGraphModal, {
      props: {
        agent: agentWithSubgraph,
        isOpen: true
      }
    });

    const expandButton = screen.getByRole('button', { name: /expand/i });
    await fireEvent.click(expandButton);

    expect(screen.getByText('Analyze Symptoms')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', async () => {
    const mockClose = vi.fn();

    render(AgentGraphModal, {
      props: {
        agent: mockAgent,
        isOpen: true,
        onClose: mockClose
      }
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });
});
```

## Integration Testing

### API Integration Tests

```typescript
// tests/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { agentService } from '$lib/services/agentService';

const server = setupServer(
  rest.get('/api/agents', (req, res, ctx) => {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    
    let agents = [
      { graph_name: 'healthcare-agent', description: 'Healthcare workflow' },
      { graph_name: 'finance-agent', description: 'Financial analysis' }
    ];

    if (search) {
      agents = agents.filter(agent => 
        agent.graph_name.includes(search) || 
        agent.description.includes(search)
      );
    }

    return res(ctx.json({
      success: true,
      data: { agents, total: agents.length }
    }));
  }),

  rest.post('/api/agents', (req, res, ctx) => {
    const config = req.body as any;
    
    if (!config.graph_name) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: {
            code: 'VALIDATION_001',
            message: 'graph_name is required'
          }
        })
      );
    }

    return res(ctx.json({
      success: true,
      data: {
        agent: config,
        validation: { valid: true, errors: [] }
      }
    }));
  }),

  rest.post('/api/agents/:id/execute', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(ctx.json({
      success: true,
      data: {
        executionId: `exec-${id}-${Date.now()}`,
        status: 'started'
      }
    }));
  })
);

describe('API Integration Tests', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  beforeEach(() => server.resetHandlers());

  describe('Agent Management', () => {
    it('should fetch all agents', async () => {
      const result = await agentService.getAgents();
      
      expect(result.agents).toHaveLength(2);
      expect(result.agents[0].graph_name).toBe('healthcare-agent');
    });

    it('should search agents by keyword', async () => {
      const result = await agentService.getAgents({ search: 'healthcare' });
      
      expect(result.agents).toHaveLength(1);
      expect(result.agents[0].graph_name).toBe('healthcare-agent');
    });

    it('should create new agent', async () => {
      const config = {
        graph_name: 'new-agent',
        description: 'New test agent',
        full_config: { nodes: [], edges: [] }
      };

      const result = await agentService.createAgent(config);
      
      expect(result.agent.graph_name).toBe('new-agent');
      expect(result.validation.valid).toBe(true);
    });

    it('should handle validation errors', async () => {
      const config = {
        description: 'Missing name',
        full_config: {}
      };

      await expect(agentService.createAgent(config)).rejects.toMatchObject({
        response: {
          data: {
            error: {
              code: 'VALIDATION_001'
            }
          }
        }
      });
    });

    it('should execute agent', async () => {
      const result = await agentService.executeAgent('test-agent', {
        input: { query: 'test query' }
      });

      expect(result.executionId).toMatch(/^exec-test-agent-\d+$/);
      expect(result.status).toBe('started');
    });
  });
});
```

### WebSocket Integration Tests

```typescript
// tests/integration/websocket.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { socketService } from '$lib/services/socketService';

describe('WebSocket Integration', () => {
  let server: Server;
  let httpServer: any;
  let port: number;

  beforeEach(async () => {
    // Create test server
    httpServer = createServer();
    server = new Server(httpServer, {
      cors: { origin: "*" }
    });

    // Find available port
    port = await new Promise((resolve) => {
      const testServer = httpServer.listen(0, () => {
        const addr = testServer.address();
        resolve(typeof addr === 'object' ? addr?.port : 3000);
        testServer.close();
      });
    });

    // Start server
    httpServer.listen(port);
  });

  afterEach(() => {
    server.close();
    httpServer.close();
    socketService.disconnect();
  });

  it('should connect to WebSocket server', async () => {
    let connected = false;

    server.on('connection', (socket) => {
      connected = true;
      socket.emit('connect_response', { status: 'connected' });
    });

    await socketService.connect(`http://localhost:${port}`);
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(connected).toBe(true);
  });

  it('should receive execution updates', async () => {
    const executionUpdates: any[] = [];

    server.on('connection', (socket) => {
      // Simulate execution update
      setTimeout(() => {
        socket.emit('execution_update', {
          executionId: 'test-exec',
          type: 'progress',
          progress: 50,
          timestamp: new Date().toISOString()
        });
      }, 50);
    });

    await socketService.connect(`http://localhost:${port}`);
    
    socketService.on('execution_update', (data) => {
      executionUpdates.push(data);
    });

    // Wait for message
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(executionUpdates).toHaveLength(1);
    expect(executionUpdates[0].executionId).toBe('test-exec');
    expect(executionUpdates[0].progress).toBe(50);
  });

  it('should handle authentication', async () => {
    let authToken: string | undefined;

    server.on('connection', (socket) => {
      authToken = socket.handshake.auth.token;
      socket.emit('auth_status', { authenticated: !!authToken });
    });

    await socketService.connect(`http://localhost:${port}`, {
      auth: { token: 'test-token' }
    });

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(authToken).toBe('test-token');
  });

  it('should handle connection errors', async () => {
    let errorOccurred = false;

    socketService.on('connect_error', () => {
      errorOccurred = true;
    });

    // Try to connect to non-existent server
    await socketService.connect('http://localhost:99999');

    // Wait for error
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(errorOccurred).toBe(true);
  });
});
```

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],

  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
```

### Authentication E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.getByRole('button', { name: 'User Menu' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    await expect(page).toHaveURL('/auth/login');
  });
});
```

### Agent Workflow E2E Tests

```typescript
// tests/e2e/agent-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display agent list', async ({ page }) => {
    await page.goto('/agents');
    
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Agent' })).toBeVisible();
    
    // Should show agent cards
    await expect(page.locator('[data-testid="agent-card"]').first()).toBeVisible();
  });

  test('should view agent details', async ({ page }) => {
    await page.goto('/agents');
    
    // Click on first agent
    await page.locator('[data-testid="agent-card"]').first().click();
    
    // Should open agent modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Agent Configuration')).toBeVisible();
    
    // Should display graph
    await expect(page.locator('[data-testid="agent-graph"]')).toBeVisible();
  });

  test('should execute agent workflow', async ({ page }) => {
    await page.goto('/agents');
    
    // Find agent with execute button
    const agentCard = page.locator('[data-testid="agent-card"]').first();
    await agentCard.getByRole('button', { name: 'Execute' }).click();
    
    // Should show execution dialog
    await expect(page.getByRole('dialog', { name: 'Execute Agent' })).toBeVisible();
    
    // Enter input
    await page.getByLabel('Input').fill('{"query": "Find healthcare providers"}');
    await page.getByRole('button', { name: 'Start Execution' }).click();
    
    // Should show execution in progress
    await expect(page.getByText('Execution started')).toBeVisible();
    await expect(page.getByTestId('execution-progress')).toBeVisible();
  });

  test('should create new agent', async ({ page }) => {
    await page.goto('/agents');
    
    await page.getByRole('button', { name: 'Create Agent' }).click();
    
    // Should show create agent form
    await expect(page.getByRole('dialog', { name: 'Create Agent' })).toBeVisible();
    
    // Fill form
    await page.getByLabel('Agent Name').fill('Test Agent');
    await page.getByLabel('Description').fill('Test agent description');
    
    // Add nodes (simplified for test)
    await page.getByRole('button', { name: 'Add Node' }).click();
    await page.getByLabel('Node Type').selectOption('start');
    await page.getByLabel('Node Label').fill('Start Node');
    await page.getByRole('button', { name: 'Add Node' }).click();
    
    // Save agent
    await page.getByRole('button', { name: 'Create' }).click();
    
    // Should show success message
    await expect(page.getByText('Agent created successfully')).toBeVisible();
  });

  test('should search agents', async ({ page }) => {
    await page.goto('/agents');
    
    // Use search box
    await page.getByPlaceholder('Search agents...').fill('healthcare');
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Should filter results
    await expect(page.locator('[data-testid="agent-card"]')).toContainText('healthcare');
  });

  test('should expand subgraph in agent view', async ({ page }) => {
    await page.goto('/agents');
    
    // Open agent with subgraph
    await page.locator('[data-testid="agent-card"]').first().click();
    
    // Look for expand button on subgraph node
    const subgraphNode = page.locator('[data-testid="subgraph-node"]').first();
    await subgraphNode.getByRole('button', { name: 'Expand' }).click();
    
    // Should show expanded nodes
    await expect(page.locator('[data-testid="expanded-nodes"]')).toBeVisible();
  });
});
```

## Storybook Testing

### Storybook Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
```

### Component Stories

```typescript
// src/components/auth/login.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import Login from './login.svelte';

const meta = {
  title: 'Auth/Login',
  component: Login,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Login form component for user authentication'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submit' },
    loading: {
      control: 'boolean',
      description: 'Shows loading state'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    }
  }
} satisfies Meta<Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const Loading: Story = {
  args: {
    loading: true
  }
};

export const WithError: Story = {
  args: {
    error: 'Invalid credentials. Please try again.'
  }
};

export const Prefilled: Story = {
  args: {
    email: 'user@example.com'
  }
};

// Interactive test
export const UserFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Type email
    await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com');
    
    // Type password
    await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
  }
};
```

## Mock Service Worker (MSW)

### MSW Setup

```typescript
// src/tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body as any;
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.json({
          success: true,
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              allowed_apps: ['all']
            },
            token: 'mock-jwt-token'
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: {
          code: 'AUTH_001',
          message: 'Invalid credentials'
        }
      })
    );
  }),

  // Agent endpoints
  rest.get('/api/agents', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          agents: [
            {
              graph_name: 'healthcare-workflow',
              description: 'Healthcare provider search workflow',
              running: false,
              full_config: {
                nodes: [
                  { id: 'start', type: 'start', label: 'Start' },
                  { id: 'search', type: 'llm', label: 'Search Providers' },
                  { id: 'end', type: 'end', label: 'End' }
                ],
                edges: [
                  { from: 'start', to: 'search' },
                  { from: 'search', to: 'end' }
                ]
              }
            }
          ],
          total: 1
        }
      })
    );
  }),

  rest.post('/api/agents/:id/execute', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.json({
        success: true,
        data: {
          executionId: `exec-${id}-${Date.now()}`,
          status: 'started'
        }
      })
    );
  })
];
```

```typescript
// src/tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## Test Utilities

### Custom Test Utilities

```typescript
// src/tests/test-utils.ts
import { render, type RenderOptions } from '@testing-library/svelte';
import { vi } from 'vitest';

// Mock all stores by default
vi.mock('$lib/stores/userStore', () => ({
  userStore: {
    subscribe: vi.fn(),
    set: vi.fn(),
    update: vi.fn()
  }
}));

vi.mock('$lib/stores/agentStore', () => ({
  agentStore: {
    subscribe: vi.fn(),
    loadAgents: vi.fn(),
    createAgent: vi.fn(),
    executeAgent: vi.fn()
  }
}));

// Custom render function with providers
export function renderWithProviders(
  component: any,
  options: RenderOptions & { 
    initialStores?: Record<string, any> 
  } = {}
) {
  const { initialStores, ...renderOptions } = options;
  
  // Set up initial store values
  if (initialStores) {
    Object.entries(initialStores).forEach(([storeName, value]) => {
      const store = vi.mocked(require(`$lib/stores/${storeName}`)[storeName]);
      store.subscribe.mockImplementation((callback) => {
        callback(value);
        return () => {};
      });
    });
  }
  
  return render(component, renderOptions);
}

// Mock API responses
export function mockApiResponse(endpoint: string, response: any) {
  const apiClient = vi.mocked(require('$lib/api').apiClient);
  
  if (endpoint.startsWith('GET ')) {
    apiClient.get.mockResolvedValue(response);
  } else if (endpoint.startsWith('POST ')) {
    apiClient.post.mockResolvedValue(response);
  } else if (endpoint.startsWith('PUT ')) {
    apiClient.put.mockResolvedValue(response);
  } else if (endpoint.startsWith('DELETE ')) {
    apiClient.delete.mockResolvedValue(response);
  }
}

// Create mock agent
export function createMockAgent(overrides = {}) {
  return {
    graph_name: 'test-agent',
    description: 'Test agent description',
    running: false,
    full_config: {
      nodes: [
        { id: 'start', type: 'start', label: 'Start' },
        { id: 'end', type: 'end', label: 'End' }
      ],
      edges: [
        { from: 'start', to: 'end' }
      ]
    },
    ...overrides
  };
}

// Create mock user
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    allowed_apps: ['all'],
    tokens_left: 1000,
    tokens_allocated: 5000,
    ...overrides
  };
}

// Wait for async operations
export async function waitForAsync() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

// Mock WebSocket
export function mockWebSocket() {
  const eventHandlers = new Map();
  
  const mockSocket = {
    addEventListener: vi.fn((event, handler) => {
      eventHandlers.set(event, handler);
    }),
    removeEventListener: vi.fn(),
    send: vi.fn(),
    close: vi.fn(),
    readyState: 1,
    
    // Test helpers
    emit: (event: string, data: any) => {
      const handler = eventHandlers.get(event);
      if (handler) handler({ data: JSON.stringify(data) });
    }
  };
  
  global.WebSocket = vi.fn().mockImplementation(() => mockSocket);
  
  return mockSocket;
}
```

## Test Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:component": "vitest src/components",
    "test:services": "vitest src/lib/services",
    "test:integration": "vitest tests/integration",
    "test:watch": "vitest --watch",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test:storybook": "test-storybook"
  }
}
```

### CI/CD Testing

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e

  storybook-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build-storybook
      - run: npm run test:storybook
```

## Best Practices

### Test Organization

1. **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
2. **Test Naming**: Use descriptive names that explain what is being tested
3. **Test Isolation**: Each test should be independent and not rely on others
4. **Mock External Dependencies**: Mock APIs, WebSockets, and external services
5. **Test Data**: Use factories or fixtures for consistent test data

### Coverage Goals

- **Unit Tests**: Aim for 80%+ code coverage
- **Component Tests**: Test all user interactions and edge cases
- **Integration Tests**: Test critical user workflows
- **E2E Tests**: Cover main user journeys

### Performance Testing

```typescript
// Example performance test
it('should render large agent list efficiently', async () => {
  const startTime = performance.now();
  
  const manyAgents = Array.from({ length: 1000 }, (_, i) => 
    createMockAgent({ graph_name: `agent-${i}` })
  );
  
  render(AgentList, { props: { agents: manyAgents } });
  
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  expect(renderTime).toBeLessThan(100); // Should render in <100ms
});
```

## Troubleshooting

### Common Issues

1. **Module Mocking**: Ensure mocks are set up before importing components
2. **Async Testing**: Use proper async/await patterns and waitFor utilities
3. **Store Testing**: Mock Svelte stores correctly with subscribe functions
4. **DOM Testing**: Use proper queries and wait for DOM updates
5. **WebSocket Testing**: Mock WebSocket connections for reliable tests

### Debugging Tests

```typescript
// Add debug utilities
import { screen, debug } from '@testing-library/svelte';

it('should debug component', () => {
  render(MyComponent);
  
  // Print current DOM
  debug();
  
  // Print specific element
  debug(screen.getByRole('button'));
});
```

## See Also

- [Development Guide](development.md) - Development setup and workflow
- [Components Documentation](components/README.md) - Component architecture
- [Services Documentation](services/README.md) - Service layer testing
- [API Reference](api-reference.md) - API testing patterns
