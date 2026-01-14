# Developer Guide & Architecture Overview

This guide provides a comprehensive overview of the frontend architecture, project structure, and development patterns for the Champ Frontend application. It is designed to help new developers understand how the application is built and how to contribute effectively.

## 🛠 Technology Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **Language**: TypeScript
- **Styling**: 
  - [Bootstrap 5](https://getbootstrap.com/) & [Sveltestrap](https://sveltestrap.js.org/)
  - [Flowbite Svelte](https://flowbite-svelte.com/)
  - SCSS (Custom styles in `src/styles`)
- **State Management**: Svelte Stores
- **Real-time**: [Socket.io-client](https://socket.io/)
- **Graph Visualization**: [Svelte Flow](https://svelteflow.xyflow.com/) & Dagre

## 📂 Project Structure

The project follows a standard SvelteKit structure with some custom organization for enterprise features.

```
frontend/
├── src/
│   ├── components/        # Feature-specific UI components
│   │   ├── apps/          # Components for specific apps (admin, code, etc.)
│   │   ├── auth/          # Login/Signup forms
│   │   └── common/        # Shared UI elements (Navbar, Toast, etc.)
│   │
│   ├── lib/               # Shared library code (aliased as $lib)
│   │   ├── components/    # Core/Complex components (Agent Graph, etc.)
│   │   ├── services/      # API interaction layer
│   │   ├── stores/        # Global state management
│   │   ├── auth.ts        # Auth utilities
│   │   └── runtime-config.ts # Runtime configuration
│   │
│   ├── routes/            # SvelteKit File-based Routing
│   │   ├── (app)/         # Main application group (authenticated)
│   │   │   ├── admin/
│   │   │   ├── code/
│   │   │   ├── graphUI/   # Agent Workflow Editor
│   │   │   └── ...
│   │   └── +layout.svelte # Root layout
│   │
│   └── utils/             # Helper functions and utility components
│
├── static/                # Static assets (images, fonts)
└── wiki/                  # Project documentation
```

## 🏗 Architecture & Patterns

### 1. Routing & Layouts
The application uses SvelteKit's file-based routing. 
- **`(app)` Group**: Most application routes are grouped under `(app)` to share a common layout (likely containing the sidebar/navbar) without affecting the URL structure.
- **Layouts**: `+layout.svelte` files define the persistent UI elements.

### 2. State Management (Stores)
Global state is managed using Svelte Stores, located in `src/lib/stores`.
- **`userStore.ts`**: Manages user authentication state, profile data, and permissions.
- **`appStore.ts`**: Handles general application UI state (sidebar toggle, theme, etc.).
- **`socketStore.ts`**: Manages the WebSocket connection for real-time agent updates.
- **`llmConfigStore.ts`**: Stores configuration for Large Language Models used in the app.
- **`toastStore.ts`**: Manages toast notifications.

### 3. Service Layer
Business logic and API calls are encapsulated in "Services" located in `src/lib/services`.
- **Pattern**: Services are typically classes with static methods or singleton instances.
- **Responsibility**: They handle HTTP requests, error parsing, and data transformation before passing data to components or stores.
- **Examples**: `AgentService` (Agent execution), `AgentCrudService` (Saving graphs).

### 4. Component Organization
- **`src/components`**: Contains "dumb" or display components organized by the feature they belong to (e.g., `components/apps/codeInsights`).
- **`src/lib/components`**: Contains "smart" or complex reusable components. Notably, the **Agent Graph** system (`AgentGraphModal`, `CustomNodes`) lives here as it is a core, complex feature used in `graphUI`.

### 5. Runtime Configuration
The application supports runtime configuration to allow environment variables to be injected without rebuilding (useful for Docker).
- **File**: `src/lib/runtime-config.ts`
- **Usage**: Import `runtimeConfig` to access variables like `AI_AGENTIC_URL`.

## 🧩 Key Subsystems

### Agent Workflow System
The Agent Workflow System allows users to build and execute AI agent chains.
- **Route**: `/graphUI`
- **Core Components**: `src/lib/components/AgentGraphModal.svelte`, `CustomNodes.svelte`.
- **Logic**: Uses `AgentService` to communicate with the backend via SSE (Server-Sent Events) for streaming execution results.

### Authentication
Authentication is token-based.
- **Flow**: Login -> Token received -> Stored in `userStore` & Cookies -> Requests authenticated via Headers.
- **Guard**: `+layout.server.ts` or client-side checks in `userStore` often handle protection of routes.

## 🚀 Development Workflow

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

### Adding a New Feature
1. **Route**: Create a new folder in `src/routes/(app)/<feature-name>`.
2. **Page**: Add `+page.svelte`.
3. **Components**: Add feature-specific components in `src/components/apps/<feature-name>`.
4. **Service**: If it needs a new API, create `src/lib/services/<feature>Service.ts`.

## 📏 Best Practices

- **Type Safety**: Use TypeScript interfaces for all data structures, especially API responses.
- **Store Usage**: Prefer stores for state that needs to be accessed by multiple components. For local component state, use Svelte 5 runes (`$state`) or standard variables.
- **Imports**: Use the `$lib` alias for importing from `src/lib`.
  - ✅ `import { userStore } from '$lib/stores/userStore';`
  - ❌ `import { userStore } from '../../lib/stores/userStore';`
