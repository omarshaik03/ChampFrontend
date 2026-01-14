# Troubleshooting Guide

## Common Issues and Solutions

### Development Issues

#### 1. Build Errors

**Problem**: TypeScript compilation errors
```
Error: Type 'string | undefined' is not assignable to type 'string'
```

**Solution**: 
```typescript
// Use proper type guards
if (typeof value === 'string') {
    // Now TypeScript knows value is string
    processString(value);
}

// Or use nullish coalescing
const safeValue = value ?? 'default';

// Or use optional chaining
const result = object?.property?.method?.();
```

**Problem**: Svelte 5 runes syntax errors
```
Error: $: is not valid in runes mode
```

**Solution**: Convert legacy reactive statements to runes:
```typescript
// Old syntax (Svelte 4)
$: doubled = count * 2;

// New syntax (Svelte 5)
let doubled = $derived(count * 2);
```

#### 2. Import/Module Issues

**Problem**: Cannot resolve module imports
```
Error: Cannot resolve module '@/components/MyComponent'
```

**Solution**: Check import paths and aliases:
```typescript
// Use relative imports or configured aliases
import MyComponent from '../components/MyComponent.svelte';
import { userStore } from '$lib/stores/userStore';
```

**Problem**: Socket.io connection issues
```
Error: Socket connection failed
```

**Solution**: 
1. Check if backend server is running
2. Verify CORS configuration
3. Check network connectivity
```typescript
// Debug socket connection
socketService.on('connect', () => {
    console.log('✅ Socket connected');
});

socketService.on('connect_error', (error) => {
    console.error('❌ Socket connection failed:', error);
});
```

### Runtime Issues

#### 1. Authentication Problems

**Problem**: User gets logged out unexpectedly

**Solution**:
1. Check token expiration
2. Verify server-side authentication
3. Check for CORS issues
```typescript
// Add token refresh logic
export async function refreshAuthToken(): Promise<string> {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Token refresh failed');
        }
        
        const { token } = await response.json();
        return token;
    } catch (error) {
        // Redirect to login if refresh fails
        goto('/auth/login');
        throw error;
    }
}
```

**Problem**: Permissions not working correctly

**Solution**: 
1. Check user permissions in store
2. Verify backend permission validation
3. Clear browser storage and re-login
```typescript
// Debug permissions
$effect(() => {
    console.log('🔐 User permissions:', $userStore?.allowed_apps);
    console.log('🔐 Current app access:', canAccessCurrentApp);
});
```

#### 2. Graph Visualization Issues

**Problem**: Agent graph not rendering

**Solution**:
1. Check agent configuration validity
2. Verify SvelteFlow dependencies
3. Check console for parsing errors
```typescript
// Debug graph parsing
try {
    const { nodes, edges } = parseAgentConfig(agent.full_config);
    console.log('📊 Parsed nodes:', nodes.length);
    console.log('📊 Parsed edges:', edges.length);
} catch (error) {
    console.error('❌ Graph parsing failed:', error);
}
```

**Problem**: Subgraph expansion not working

**Solution**:
1. Check subgraph data structure
2. Verify click event handlers
3. Check expansion state management
```typescript
// Debug subgraph expansion
const handleNodeClick = (event) => {
    console.log('🖱️ Node clicked:', event.detail.node.id);
    console.log('📊 Is subgraph:', event.detail.node.data?.isSubgraph);
    console.log('🔍 Current expanded:', Array.from(expandedSubgraphs));
};
```

#### 3. Performance Issues

**Problem**: Application feels slow

**Solution**:
1. Check Network tab for slow API calls
2. Use Performance tab to identify bottlenecks
3. Optimize reactive statements
```typescript
// Use derived state efficiently
let expensiveComputation = $derived.by(() => {
    if (!needsUpdate) return cachedValue;
    return performExpensiveOperation(data);
});

// Debounce frequent operations
let debouncedSearch = $derived(debounce(searchTerm, 300));
```

**Problem**: Memory leaks

**Solution**:
1. Clean up event listeners
2. Unsubscribe from stores
3. Cancel pending requests
```typescript
onDestroy(() => {
    // Clean up subscriptions
    unsubscribe();
    
    // Remove event listeners
    document.removeEventListener('custom-event', handler);
    
    // Cancel pending requests
    abortController.abort();
});
```

### Styling Issues

#### 1. CSS Not Applied

**Problem**: Styles not appearing correctly

**Solution**:
1. Check CSS specificity
2. Verify Bootstrap class names
3. Check for conflicting styles
```css
/* Use more specific selectors if needed */
.custom-component .btn {
    /* Component-specific button styles */
}

/* Check for global style conflicts */
:global(.custom-global-style) {
    /* Global styles */
}
```

#### 2. Responsive Design Issues

**Problem**: Layout breaks on mobile

**Solution**:
1. Use Bootstrap responsive classes
2. Test on different screen sizes
3. Use CSS media queries
```css
/* Mobile-first responsive design */
.component {
    padding: 0.5rem;
}

@media (min-width: 768px) {
    .component {
        padding: 1rem;
    }
}
```

## Error Messages Reference

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AUTH_001` | Invalid authentication token | Re-login or refresh token |
| `AUTH_002` | Insufficient permissions | Contact administrator |
| `GRAPH_001` | Invalid agent configuration | Validate configuration JSON |
| `GRAPH_002` | Graph parsing failed | Check node/edge definitions |
| `API_001` | Network request failed | Check internet connection |
| `API_002` | Server error | Check server status |

### Debugging Agent Configurations

#### Configuration Validation Errors

**Error**: Node validation failed
```json
{
    "error": "Node 'consolidator_node' (Tool node) must have either 'tool_names' (array), 'tool_config' (object), or 'tools' field"
}
```

**Solution**: Add required tool configuration:
```json
{
    "id": "consolidator_node",
    "template": "core.ToolNode", 
    "config": {
        "target": "messages",
        "tool_names": ["consolidation_tool"]
    }
}
```

**Error**: Edge reference validation failed
```json
{
    "error": "Edge at index 2 references non-existent target node 'missing_node'"
}
```

**Solution**: Ensure all edge references point to valid nodes:
```json
{
    "edges": [
        { "from": "__start__", "to": "existing_node" },
        { "from": "existing_node", "to": "__end__" }
    ]
}
```

#### Graph Structure Issues

**Problem**: Disconnected nodes in graph

**Solution**: 
1. Check all nodes have incoming/outgoing edges
2. Verify conditional edge routing
3. Ensure connectivity from `__start__` to `__end__`

**Problem**: Circular dependencies

**Solution**:
1. Review edge definitions for cycles
2. Use conditional edges appropriately
3. Test workflow execution path

## Debugging Tools

### Browser Developer Tools

#### Console Debugging
```typescript
// Structured logging
console.group('🔬 Agent Processing');
console.log('📋 Config:', agentConfig);
console.log('📊 Nodes:', nodes.length);
console.log('🔗 Edges:', edges.length);
console.groupEnd();

// Performance monitoring
console.time('graph-parsing');
const result = parseAgentConfig(config);
console.timeEnd('graph-parsing');
```

#### Network Monitoring
1. Open Network tab in DevTools
2. Filter by XHR/Fetch for API calls
3. Check response status and timing
4. Monitor WebSocket connections

#### Performance Profiling
1. Open Performance tab
2. Record while reproducing issue
3. Analyze call stack and timing
4. Identify bottlenecks

### VS Code Debugging

#### Launch Configuration
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Svelte App",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/node_modules/@sveltejs/kit/src/exports/vite/dev/index.js",
            "args": ["--port", "5173"],
            "console": "integratedTerminal",
            "env": {
                "NODE_ENV": "development"
            }
        }
    ]
}
```

#### Debugging Tips
- Set breakpoints in TypeScript files
- Use "Debug Console" for runtime evaluation
- Inspect variable values and call stack
- Step through code execution

### Testing and Validation

#### Manual Testing Checklist

**Authentication Flow:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Token refresh on expiration
- [ ] Permission-based access control

**Agent System:**
- [ ] Agent list loading
- [ ] Graph visualization opening
- [ ] Node clicking and interaction
- [ ] Subgraph expansion/collapse
- [ ] Execution tracking display

**Navigation:**
- [ ] Menu navigation works
- [ ] Breadcrumbs display correctly
- [ ] Back button functionality
- [ ] Mobile menu operation

#### Automated Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test src/lib/services/agentService.test.ts

# Run tests with coverage
npm run test:coverage
```

## Performance Optimization

### Identifying Performance Issues

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for duplicate dependencies
npm ls --depth=0
```

#### Runtime Performance
```typescript
// Monitor component render times
let renderStart = performance.now();

$effect(() => {
    const renderEnd = performance.now();
    if (renderEnd - renderStart > 16) { // > 1 frame at 60fps
        console.warn(`Slow render: ${renderEnd - renderStart}ms`);
    }
    renderStart = renderEnd;
});
```

### Optimization Strategies

#### Code Splitting
```typescript
// Dynamic imports for large components
const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));

// Route-based splitting
const routes = [
    {
        path: '/admin',
        component: lazy(() => import('./pages/AdminPage.svelte'))
    }
];
```

#### State Optimization
```typescript
// Minimize reactive dependencies
let filteredItems = $derived.by(() => {
    // Only recalculate when necessary dependencies change
    if (!searchTerm && !filterCriteria) return items;
    return items.filter(item => 
        item.name.includes(searchTerm) && 
        matchesCriteria(item, filterCriteria)
    );
});
```

## Environment-Specific Issues

### Development Environment

**Issue**: Hot reload not working
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check file system events
# On Windows, may need to increase watchers
```

**Issue**: TypeScript errors in IDE
```bash
# Restart TypeScript service
# In VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Update dependencies
npm update @types/node @types/* typescript
```

### Production Environment

**Issue**: Build failures
```bash
# Check Node.js version compatibility
node --version
npm --version

# Clear build cache
rm -rf .svelte-kit dist
npm run build
```

**Issue**: Runtime errors in production
1. Check source maps are enabled
2. Review error tracking logs
3. Test production build locally:
```bash
npm run build
npm run preview
```

## Getting Help

### Internal Resources
1. **Code Documentation**: Check component and service documentation
2. **Wiki**: Search this wiki for specific topics
3. **Git History**: Review recent changes for context
4. **Code Comments**: Look for inline documentation

### External Resources
1. **Svelte Documentation**: https://svelte.dev/docs
2. **SvelteKit Documentation**: https://kit.svelte.dev/docs
3. **TypeScript Handbook**: https://www.typescriptlang.org/docs
4. **Bootstrap Documentation**: https://getbootstrap.com/docs

### Community Support
1. **Svelte Discord**: https://svelte.dev/chat
2. **Stack Overflow**: Tag questions with 'svelte', 'sveltekit'
3. **GitHub Issues**: Check project repository for known issues

### Reporting Issues

When reporting issues, include:
1. **Environment details** (Node.js version, browser, OS)
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Console errors** and stack traces
5. **Relevant code snippets**
6. **Screenshots** for UI issues

**Issue Template:**
```markdown
## Environment
- Node.js version: 
- npm version:
- Browser: 
- OS: 

## Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior  
What actually happens

## Console Errors
```
Copy any console errors here
```

## Additional Context
Any other relevant information
```

## See Also

- [Development Guide](development.md) - Development best practices
- [Architecture](architecture.md) - System architecture overview
- [Components](components/README.md) - Component documentation
- [Agent System](agent-system/README.md) - Agent system details
