# Getting Started

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** or **yarn**
- **Git** for version control

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create environment files based on your deployment environment:
   ```bash
   cp .env.example .env.local
   ```

## Development

### Starting the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` (or next available port).

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run serve` | Serve on all interfaces (port 8000) |
| `npm run check` | Run Svelte type checking |
| `npm run check:watch` | Run type checking in watch mode |
| `npm run lint` | Check code formatting |
| `npm run format` | Format code with Prettier |

## Project Structure

```
frontend/
├── src/
│   ├── app.html              # HTML template
│   ├── app.css               # Global styles
│   ├── components/           # Reusable components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Shared UI components
│   │   └── apps/            # App-specific components
│   ├── lib/                 # Utilities and services
│   │   ├── components/      # Complex components
│   │   ├── data/           # Data definitions
│   │   ├── services/       # Business logic
│   │   └── stores/         # State management
│   ├── routes/             # SvelteKit routes
│   │   ├── (app)/         # Authenticated routes
│   │   └── auth/          # Authentication routes
│   ├── styles/            # SCSS stylesheets
│   └── utils/             # Utility functions
├── static/                # Static assets
├── wiki/                  # Documentation
└── package.json
```

## First Steps

### 1. Understanding the Layout

The application uses a nested layout structure:
- Root layout (`src/routes/+layout.svelte`)
- App layout (`src/routes/(app)/+layout.svelte`) for authenticated pages
- Individual page layouts

### 2. Authentication Flow

1. Users start at the login page (`/auth/login`)
2. After authentication, they're redirected to the home page (`/`)
3. Access to specific apps is controlled by user permissions

### 3. Available Applications

| App | Route | Description |
|-----|-------|-------------|
| Home | `/` | Dashboard and overview |
| Code Conversion | `/code/convert` | Convert code between languages |
| Code Insights | `/code/insights` | Analyze code quality |
| Database Insights | `/databaseinsights` | Database analysis tools |
| Document Insights | `/documentinsights` | Document processing |
| Web Insights | `/webinsights` | Web content analysis |
| Member Insights | `/memberinsights` | Healthcare member matching |
| Admin | `/admin` | User and system administration |

### 4. Key Components to Explore

#### Navigation
- `src/components/common/navbar.svelte` - Main navigation bar
- `src/components/common/hamburger.svelte` - Mobile menu

#### Agent System
- `src/lib/components/agents/AgentsTab.svelte` - Agent management
- `src/lib/components/AgentGraphModal.svelte` - Graph visualization
- `src/lib/components/CustomNodes.svelte` - Custom node components

#### Common UI
- `src/components/common/chatbox.svelte` - Chat interface
- `src/components/common/ToastNotifications.svelte` - Notifications

## Development Tips

### Working with Svelte 5

This project uses Svelte 5 with runes syntax:

```typescript
// Props
let { propName = defaultValue }: { propName?: string } = $props();

// State
let count = $state(0);

// Derived state
let doubled = $derived(count * 2);

// Effects
$effect(() => {
    console.log('Count changed:', count);
});
```

### TypeScript Integration

- All components use TypeScript
- Type definitions are in `src/lib/data/` and `src/lib/commontypes.ts`
- Use proper typing for component props and events

### Styling Guidelines

- Use Bootstrap classes for layout and common components
- Custom styles go in `src/styles/custom.scss`
- Component-specific styles use `<style>` blocks
- Follow the existing design patterns

### State Management

- Use Svelte stores for global state (`src/lib/stores/`)
- Local component state with `$state()`
- Derived state with `$derived()`

## Next Steps

1. **Explore the codebase**: Start with `src/routes/(app)/+page.svelte` (home page)
2. **Try the agent system**: Navigate to the admin section to see agent graphs
3. **Check out the tools**: Try the code conversion or insights features
4. **Read the architecture guide**: [Architecture](architecture.md)
5. **Learn about components**: [Components](components/README.md)

## Getting Help

- Check the [Troubleshooting Guide](troubleshooting.md)
- Review component documentation in the `components/` wiki section
- Look at existing code patterns in the application
