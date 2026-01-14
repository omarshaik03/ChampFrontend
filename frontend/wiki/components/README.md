# Components Documentation

## Component Overview

This application is built with a modular component architecture, organizing components by functionality and reusability.

## Component Categories

### 🔐 Authentication Components (`src/components/auth/`)
- [`login.svelte`](auth.md#login-component) - User login form
- [`profile.svelte`](auth.md#profile-component) - User profile management
- [`signup.svelte`](auth.md#signup-component) - User registration form

### 🧩 Common Components (`src/components/common/`)
- [`navbar.svelte`](common.md#navbar) - Main navigation bar
- [`hamburger.svelte`](common.md#hamburger) - Mobile menu toggle
- [`chatbox.svelte`](common.md#chatbox) - Chat interface
- [`searchbar.svelte`](common.md#searchbar) - Search functionality
- [`selector.svelte`](common.md#selector) - Multi-option selector
- [`timer.svelte`](common.md#timer) - Timer display
- [`ToastNotifications.svelte`](common.md#toast-notifications) - Notification system
- [`userFeedback.svelte`](common.md#user-feedback) - User feedback forms

### 🤖 Agent System Components (`src/lib/components/`)
- [`AgentGraphModal.svelte`](agent-graph.md#agent-graph-modal) - Graph visualization modal
- [`CustomNodes.svelte`](agent-graph.md#custom-nodes) - Custom node components
- [`AgentGraphUtils.ts`](agent-graph.md#agent-graph-utils) - Graph utilities
- [`agents/AgentsTab.svelte`](agent-graph.md#agents-tab) - Agent management interface

### 📱 Application-Specific Components (`src/components/apps/`)

#### Admin Tools
- User management interfaces
- System configuration panels

#### Code Tools
- Code conversion interfaces
- Code analysis displays

#### Data Insights
- Database query builders
- Document processing interfaces
- Web analysis tools

## Component Architecture Patterns

### 1. Svelte 5 Runes Pattern

All components use modern Svelte 5 syntax:

```typescript
<script lang="ts">
    // Props with default values
    let { title = "Default Title", items = [] }: {
        title?: string;
        items?: any[];
    } = $props();
    
    // Local state
    let isLoading = $state(false);
    
    // Derived state
    let itemCount = $derived(items.length);
    
    // Effects
    $effect(() => {
        console.log('Items changed:', items);
    });
</script>
```

### 2. Event Handling Pattern

Components use proper event dispatching:

```typescript
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

function handleClick() {
    dispatch('customEvent', { data: 'example' });
}
```

### 3. Accessibility Pattern

All interactive components include accessibility features:

```svelte
<button
    type="button"
    onclick={handleClick}
    onkeydown={(e) => e.key === 'Enter' && handleClick()}
    role="button"
    tabindex="0"
    aria-label="Descriptive label"
>
    Button Text
</button>
```

### 4. Styling Pattern

Components use a combination of Bootstrap classes and custom styles:

```svelte
<style>
    .custom-component {
        /* Component-specific styles */
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .custom-component:hover {
        transform: translateY(-2px);
    }
</style>
```

## Component Guidelines

### Props and State
- Use TypeScript for all prop definitions
- Provide default values where appropriate
- Use `$state()` for local component state
- Use `$derived()` for computed values

### Event Handling
- Use descriptive event names
- Include relevant data in event payloads
- Handle keyboard events for accessibility

### Styling
- Prefer Bootstrap classes for layout and common styles
- Use component-specific styles for unique designs
- Follow the existing color scheme and spacing

### Accessibility
- Include proper ARIA labels
- Support keyboard navigation
- Use semantic HTML elements
- Test with screen readers

## Common Patterns

### Loading States
```typescript
let isLoading = $state(false);

async function handleSubmit() {
    isLoading = true;
    try {
        await apiCall();
    } finally {
        isLoading = false;
    }
}
```

### Form Validation
```typescript
let errors = $state<string[]>([]);

function validate() {
    errors = [];
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    return errors.length === 0;
}
```

### Modal Management
```typescript
let isOpen = $state(false);

function openModal() {
    isOpen = true;
}

function closeModal() {
    isOpen = false;
}
```

## Testing Components

### Unit Testing
- Test component rendering
- Test event handling
- Test prop validation
- Test accessibility features

### Integration Testing
- Test component interactions
- Test data flow
- Test error handling

## Performance Considerations

### Optimization Tips
- Use `$derived()` for expensive computations
- Implement proper loading states
- Minimize re-renders with proper state management
- Use lazy loading for heavy components

### Memory Management
- Clean up event listeners in `onDestroy`
- Unsubscribe from stores
- Cancel pending requests

## See Also

- [Agent Graph Components](agent-graph.md) - Detailed documentation for graph components
- [Authentication Components](auth.md) - Auth system components
- [Common Components](common.md) - Shared UI components
- [Styling Guide](../styling.md) - Design system and styling guidelines
