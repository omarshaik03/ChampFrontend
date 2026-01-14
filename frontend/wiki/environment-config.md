# Environment Configuration

## Overview

This document describes the environment variable configuration for the frontend application. Environment variables are used to configure the application for different environments (development, staging, production) without changing the code.

## Quick Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your specific configuration values

3. Restart the development server to load new variables

## Environment Variable Categories

### 🔧 **Application Settings**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENV` | string | `development` | Application environment |
| `VITE_APP_NAME` | string | `AI Marketplace Frontend` | Application display name |
| `VITE_APP_VERSION` | string | `1.0.0` | Application version |

### 🌐 **API Configuration**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEV_URL` | string | `http://localhost:8000/api` | Development API base URL |
| `VITE_API_BASE_URL` | string | `http://localhost:8000/api` | Main API base URL |
| `VITE_API_TIMEOUT` | number | `30000` | API request timeout (ms) |
| `VITE_API_VERSION` | string | `v1` | API version |

### 🔌 **WebSocket Configuration**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_SOCKET_URL` | string | `ws://localhost:8000/ws` | WebSocket server URL |
| `VITE_WS_RECONNECT_ATTEMPTS` | number | `5` | Max reconnection attempts |
| `VITE_WS_RECONNECT_INTERVAL` | number | `3000` | Reconnection interval (ms) |

### 🔐 **Authentication Settings**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_TOKEN_EXPIRY` | number | `86400` | JWT token expiry (seconds) |
| `VITE_SESSION_TIMEOUT` | number | `3600000` | Session timeout (ms) |
| `VITE_REMEMBER_ME_DURATION` | number | `2592000000` | Remember me duration (ms) |

### 🤖 **Agent System Configuration**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_AGENT_EXECUTION_TIMEOUT` | number | `300000` | Agent execution timeout (ms) |
| `VITE_MAX_CONCURRENT_EXECUTIONS` | number | `5` | Max concurrent agent executions |
| `VITE_VALIDATE_CONFIGS_ON_SAVE` | boolean | `true` | Validate agent configs on save |
| `VITE_MAX_GRAPH_NODES` | number | `1000` | Maximum nodes in graph visualization |

### 🚩 **Feature Flags**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENABLE_CODE_CONVERSION` | boolean | `true` | Enable code conversion feature |
| `VITE_ENABLE_DATABASE_INSIGHTS` | boolean | `true` | Enable database insights |
| `VITE_ENABLE_DOCUMENT_INSIGHTS` | boolean | `true` | Enable document insights |
| `VITE_ENABLE_AGENT_BUILDER` | boolean | `true` | Enable agent builder interface |
| `VITE_ENABLE_SUBGRAPH_EXPANSION` | boolean | `true` | Enable subgraph expansion |

### 🎨 **UI/UX Configuration**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEFAULT_THEME` | string | `light` | Default application theme |
| `VITE_ENABLE_DARK_MODE` | boolean | `true` | Enable dark mode support |
| `VITE_ENABLE_ANIMATIONS` | boolean | `true` | Enable UI animations |
| `VITE_ANIMATION_DURATION` | number | `300` | Animation duration (ms) |

### ⚡ **Performance Settings**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENABLE_CACHING` | boolean | `true` | Enable client-side caching |
| `VITE_CACHE_DURATION` | number | `300000` | Cache duration (ms) |
| `VITE_MAX_CACHE_SIZE` | number | `50` | Maximum cache entries |
| `VITE_ENABLE_LAZY_LOADING` | boolean | `true` | Enable lazy loading |

### 🔍 **Debugging and Logging**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEBUG` | boolean | `false` | Enable debug mode |
| `VITE_VERBOSE_LOGGING` | boolean | `false` | Enable verbose logging |
| `VITE_LOG_LEVEL` | string | `info` | Logging level (error, warn, info, debug) |
| `VITE_LOG_AGENT_OPERATIONS` | boolean | `true` | Log agent operations |

## Environment-Specific Configurations

### Development Environment

```bash
# .env.development
NODE_ENV=development
VITE_ENV=development
VITE_DEV_URL=http://localhost:8000/api
VITE_SOCKET_URL=ws://localhost:8000/ws
VITE_DEBUG=true
VITE_VERBOSE_LOGGING=true
VITE_LOG_API_REQUESTS=true
VITE_ENABLE_ANALYTICS=false
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=production
VITE_ENV=staging
VITE_API_BASE_URL=https://api-staging.your-domain.com/api
VITE_SOCKET_URL=wss://api-staging.your-domain.com/ws
VITE_DEBUG=false
VITE_VERBOSE_LOGGING=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
VITE_ENV=production
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_SOCKET_URL=wss://api.your-domain.com/ws
VITE_DEBUG=false
VITE_VERBOSE_LOGGING=false
VITE_BUILD_SOURCEMAPS=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_OPTIMIZE_DEPS=true
```

## Usage in Code

### Accessing Environment Variables

```typescript
// Accessing environment variables in Svelte/TypeScript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebugMode = import.meta.env.VITE_DEBUG === 'true';
const maxNodes = parseInt(import.meta.env.VITE_MAX_GRAPH_NODES || '1000');

// Type-safe environment variables
interface EnvironmentConfig {
  apiUrl: string;
  socketUrl: string;
  isDebugMode: boolean;
  features: {
    codeConversion: boolean;
    databaseInsights: boolean;
    agentBuilder: boolean;
  };
}

const config: EnvironmentConfig = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000/ws',
  isDebugMode: import.meta.env.VITE_DEBUG === 'true',
  features: {
    codeConversion: import.meta.env.VITE_ENABLE_CODE_CONVERSION === 'true',
    databaseInsights: import.meta.env.VITE_ENABLE_DATABASE_INSIGHTS === 'true',
    agentBuilder: import.meta.env.VITE_ENABLE_AGENT_BUILDER === 'true',
  }
};
```

### Environment Validation

```typescript
// src/lib/config/environment.ts
interface RequiredEnvVars {
  VITE_API_BASE_URL: string;
  VITE_SOCKET_URL: string;
}

interface OptionalEnvVars {
  VITE_DEBUG?: string;
  VITE_LOG_LEVEL?: string;
  VITE_ENABLE_ANALYTICS?: string;
}

function validateEnvironment(): void {
  const required: (keyof RequiredEnvVars)[] = [
    'VITE_API_BASE_URL',
    'VITE_SOCKET_URL'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Validate on app start
validateEnvironment();

// Export typed configuration
export const appConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    version: import.meta.env.VITE_API_VERSION || 'v1'
  },
  websocket: {
    url: import.meta.env.VITE_SOCKET_URL,
    reconnectAttempts: parseInt(import.meta.env.VITE_WS_RECONNECT_ATTEMPTS || '5'),
    reconnectInterval: parseInt(import.meta.env.VITE_WS_RECONNECT_INTERVAL || '3000')
  },
  features: {
    codeConversion: import.meta.env.VITE_ENABLE_CODE_CONVERSION === 'true',
    databaseInsights: import.meta.env.VITE_ENABLE_DATABASE_INSIGHTS === 'true',
    documentInsights: import.meta.env.VITE_ENABLE_DOCUMENT_INSIGHTS === 'true',
    agentBuilder: import.meta.env.VITE_ENABLE_AGENT_BUILDER === 'true'
  },
  ui: {
    theme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
    animationDuration: parseInt(import.meta.env.VITE_ANIMATION_DURATION || '300')
  },
  debug: {
    enabled: import.meta.env.VITE_DEBUG === 'true',
    verbose: import.meta.env.VITE_VERBOSE_LOGGING === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info'
  }
};
```

### Feature Flag Implementation

```typescript
// src/lib/features/featureFlags.ts
export class FeatureFlags {
  private static instance: FeatureFlags;
  private flags: Map<string, boolean>;

  private constructor() {
    this.flags = new Map([
      ['codeConversion', import.meta.env.VITE_ENABLE_CODE_CONVERSION === 'true'],
      ['databaseInsights', import.meta.env.VITE_ENABLE_DATABASE_INSIGHTS === 'true'],
      ['documentInsights', import.meta.env.VITE_ENABLE_DOCUMENT_INSIGHTS === 'true'],
      ['agentBuilder', import.meta.env.VITE_ENABLE_AGENT_BUILDER === 'true'],
      ['subgraphExpansion', import.meta.env.VITE_ENABLE_SUBGRAPH_EXPANSION === 'true'],
      ['realtimeMonitoring', import.meta.env.VITE_ENABLE_REAL_TIME_MONITORING === 'true']
    ]);
  }

  static getInstance(): FeatureFlags {
    if (!this.instance) {
      this.instance = new FeatureFlags();
    }
    return this.instance;
  }

  isEnabled(feature: string): boolean {
    return this.flags.get(feature) || false;
  }

  enable(feature: string): void {
    this.flags.set(feature, true);
  }

  disable(feature: string): void {
    this.flags.set(feature, false);
  }

  getAllFlags(): Record<string, boolean> {
    return Object.fromEntries(this.flags);
  }
}

// Usage in components
import { FeatureFlags } from '$lib/features/featureFlags';

const features = FeatureFlags.getInstance();

// Conditional rendering based on feature flags
{#if features.isEnabled('codeConversion')}
  <CodeConversionTool />
{/if}

{#if features.isEnabled('agentBuilder')}
  <AgentBuilder />
{/if}
```

## Runtime Configuration

### Dynamic Configuration Loading

```typescript
// src/lib/config/runtime.ts
interface RuntimeConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: Record<string, boolean>;
  ui: {
    theme: string;
    branding: {
      logo: string;
      name: string;
    };
  };
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    // Load configuration from API if available
    const response = await fetch('/api/config');
    
    if (response.ok) {
      const serverConfig = await response.json();
      
      // Merge with environment variables
      return {
        api: {
          baseUrl: serverConfig.api?.baseUrl || import.meta.env.VITE_API_BASE_URL,
          timeout: serverConfig.api?.timeout || parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
        },
        features: {
          ...getEnvironmentFeatures(),
          ...serverConfig.features
        },
        ui: {
          theme: serverConfig.ui?.theme || import.meta.env.VITE_DEFAULT_THEME,
          branding: serverConfig.ui?.branding || getDefaultBranding()
        }
      };
    }
  } catch (error) {
    console.warn('Failed to load runtime config, using environment defaults:', error);
  }

  // Fallback to environment variables
  return getEnvironmentConfig();
}

function getEnvironmentFeatures(): Record<string, boolean> {
  return {
    codeConversion: import.meta.env.VITE_ENABLE_CODE_CONVERSION === 'true',
    databaseInsights: import.meta.env.VITE_ENABLE_DATABASE_INSIGHTS === 'true',
    documentInsights: import.meta.env.VITE_ENABLE_DOCUMENT_INSIGHTS === 'true',
    agentBuilder: import.meta.env.VITE_ENABLE_AGENT_BUILDER === 'true'
  };
}
```

## Security Considerations

### Environment Variable Security

```typescript
// ❌ NEVER do this - exposes sensitive data
const apiKey = import.meta.env.VITE_API_KEY; // Exposed to client!

// ✅ Use build-time configuration for non-sensitive data only
const apiUrl = import.meta.env.VITE_API_BASE_URL; // Safe - public endpoint

// ✅ Use server-side configuration for sensitive data
const response = await fetch('/api/config', {
  headers: {
    'Authorization': `Bearer ${userToken}` // Server handles API keys
  }
});
```

### Environment Variable Validation

```typescript
// src/lib/config/validator.ts
interface EnvVarValidation {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'url';
  pattern?: RegExp;
  default?: string;
}

const envValidations: EnvVarValidation[] = [
  {
    name: 'VITE_API_BASE_URL',
    required: true,
    type: 'url'
  },
  {
    name: 'VITE_SOCKET_URL',
    required: true,
    type: 'url',
    pattern: /^wss?:\/\//
  },
  {
    name: 'VITE_API_TIMEOUT',
    required: false,
    type: 'number',
    default: '30000'
  },
  {
    name: 'VITE_DEBUG',
    required: false,
    type: 'boolean',
    default: 'false'
  }
];

export function validateEnvironmentVariables(): void {
  const errors: string[] = [];

  for (const validation of envValidations) {
    const value = import.meta.env[validation.name];

    // Check required variables
    if (validation.required && !value) {
      errors.push(`Required environment variable ${validation.name} is missing`);
      continue;
    }

    // Skip validation if optional and not provided
    if (!validation.required && !value) {
      continue;
    }

    // Type validation
    switch (validation.type) {
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`${validation.name} must be a valid number`);
        }
        break;
        
      case 'boolean':
        if (!['true', 'false'].includes(value?.toLowerCase())) {
          errors.push(`${validation.name} must be 'true' or 'false'`);
        }
        break;
        
      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`${validation.name} must be a valid URL`);
        }
        break;
    }

    // Pattern validation
    if (validation.pattern && value && !validation.pattern.test(value)) {
      errors.push(`${validation.name} does not match required pattern`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}
```

## Build Configuration

### Vite Environment Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  // Environment variable configuration
  envDir: '.', // Directory containing .env files
  envPrefix: 'VITE_', // Only expose variables starting with VITE_
  
  define: {
    // Define compile-time constants
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  build: {
    // Build-time environment handling
    rollupOptions: {
      external: (id) => {
        // Externalize environment-specific modules
        return id.includes('config') && process.env.NODE_ENV === 'production';
      }
    }
  }
});
```

### Environment-Specific Builds

```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "build:dev": "cross-env NODE_ENV=development vite build",
    "build:staging": "cross-env NODE_ENV=production VITE_ENV=staging vite build",
    "build:prod": "cross-env NODE_ENV=production VITE_ENV=production vite build",
    "preview": "vite preview",
    "preview:staging": "cross-env VITE_ENV=staging vite preview",
    "preview:prod": "cross-env VITE_ENV=production vite preview"
  }
}
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   ```bash
   # Ensure variables start with VITE_
   VITE_API_URL=http://localhost:8000  # ✅ Correct
   API_URL=http://localhost:8000       # ❌ Won't work
   ```

2. **Boolean Environment Variables**
   ```typescript
   // Environment variables are always strings
   const isDebug = import.meta.env.VITE_DEBUG === 'true'; // ✅ Correct
   const isDebug = import.meta.env.VITE_DEBUG; // ❌ Always truthy string
   ```

3. **Missing Environment Variables**
   ```typescript
   // Always provide defaults for optional variables
   const timeout = parseInt(import.meta.env.VITE_TIMEOUT || '30000');
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
   ```

4. **Development Server Not Updating**
   ```bash
   # Restart development server after changing .env
   npm run dev
   ```

### Debug Environment Configuration

```typescript
// Add this to your app to debug environment variables
if (import.meta.env.VITE_DEBUG === 'true') {
  console.group('Environment Configuration');
  console.log('Environment:', import.meta.env.VITE_ENV);
  console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL);
  console.log('Features:', {
    codeConversion: import.meta.env.VITE_ENABLE_CODE_CONVERSION === 'true',
    databaseInsights: import.meta.env.VITE_ENABLE_DATABASE_INSIGHTS === 'true',
    agentBuilder: import.meta.env.VITE_ENABLE_AGENT_BUILDER === 'true'
  });
  console.groupEnd();
}
```

## Best Practices

### 1. **Naming Conventions**
- Use `VITE_` prefix for all client-side variables
- Use `SCREAMING_SNAKE_CASE` for variable names
- Group related variables with common prefixes

### 2. **Security**
- Never include API keys or secrets in environment variables
- Use server-side configuration for sensitive data
- Validate all environment variables at startup

### 3. **Documentation**
- Document all environment variables in `.env.example`
- Include type information and descriptions
- Provide sensible defaults

### 4. **Environment Management**
- Use separate `.env` files for different environments
- Never commit actual `.env` files to version control
- Use environment-specific build scripts

### 5. **Type Safety**
- Create TypeScript interfaces for configuration
- Validate environment variables at runtime
- Use centralized configuration objects

## See Also

- [Getting Started Guide](getting-started.md) - Initial setup and installation
- [Development Guide](development.md) - Development workflow and patterns
- [Deployment Guide](deployment.md) - Production deployment configuration
- [Security Guide](security.md) - Security best practices
- [Troubleshooting Guide](troubleshooting.md) - Common issues and solutions
