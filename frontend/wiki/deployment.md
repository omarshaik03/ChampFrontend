# Deployment Guide

## Overview

This guide covers deployment strategies for the frontend application, including build optimization, environment configuration, and deployment to various platforms.

## Build Process

### Production Build

```bash
# Standard production build
npm run build

# Build with source maps (for debugging)
npm run build -- --mode production-debug

# Analyze bundle size
npm run build && npx vite-bundle-analyzer dist
```

### Build Configuration

#### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],
    build: {
        target: 'es2020',
        minify: 'terser',
        sourcemap: process.env.NODE_ENV === 'development',
        rollupOptions: {
            output: {
                // Manual chunking for better caching
                manualChunks: {
                    // Vendor libraries
                    svelte: ['svelte'],
                    sveltekit: ['@sveltejs/kit'],
                    
                    // UI libraries
                    ui: ['@sveltestrap/sveltestrap', 'bootstrap'],
                    graph: ['@xyflow/svelte', '@dagrejs/dagre'],
                    
                    // Utilities
                    utils: ['dayjs', 'marked', 'diff']
                }
            }
        },
        // Optimize dependencies
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true
            }
        }
    },
    
    // Preview server configuration
    preview: {
        port: 8000,
        host: '0.0.0.0'
    },
    
    // Optimize dependencies
    optimizeDeps: {
        include: [
            '@xyflow/svelte',
            'dayjs',
            'socket.io-client'
        ]
    }
});
```

#### SvelteKit Configuration

```typescript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
    kit: {
        adapter: adapter(),
        
        // Environment variables
        env: {
            privatePrefix: 'PRIVATE_',
            publicPrefix: 'PUBLIC_'
        },
        
        // Service worker
        serviceWorker: {
            register: false // Disable if not needed
        },
        
        // CSP configuration
        csp: {
            mode: 'auto',
            directives: {
                'script-src': ['self', 'unsafe-inline'],
                'style-src': ['self', 'unsafe-inline'],
                'img-src': ['self', 'data:', 'https:'],
                'connect-src': ['self', 'wss:', 'https:']
            }
        }
    }
};
```

## Environment Configuration

### Environment Variables

#### Development (.env.local)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=ws://localhost:3001

# Authentication
VITE_AUTH_COOKIE_NAME=auth_token
VITE_TOKEN_REFRESH_THRESHOLD=300000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
VITE_DEBUG_MODE=true

# Performance
VITE_CACHE_ENABLED=true
VITE_API_TIMEOUT=30000
```

#### Production (.env.production)
```bash
# API Configuration
VITE_API_BASE_URL=https://api.yourapp.com
VITE_SOCKET_URL=wss://socket.yourapp.com

# Authentication
VITE_AUTH_COOKIE_NAME=auth_token
VITE_TOKEN_REFRESH_THRESHOLD=300000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_DEBUG_MODE=false

# Performance
VITE_CACHE_ENABLED=true
VITE_API_TIMEOUT=30000

# Analytics
VITE_ANALYTICS_ID=UA-XXXXXXXX-X
VITE_ERROR_TRACKING_DSN=https://xxx@sentry.io/xxx
```

### Environment-Specific Adapters

#### Static Site (adapter-static)
```typescript
// For static hosting (Netlify, Vercel, S3)
import adapter from '@sveltejs/adapter-static';

export default {
    kit: {
        adapter: adapter({
            pages: 'dist',
            assets: 'dist',
            fallback: 'index.html', // SPA mode
            precompress: false,
            strict: true
        })
    }
};
```

#### Node.js (adapter-node)
```typescript
// For Node.js servers
import adapter from '@sveltejs/adapter-node';

export default {
    kit: {
        adapter: adapter({
            out: 'dist',
            precompress: false,
            envPrefix: 'MY_CUSTOM_'
        })
    }
};
```

#### Cloudflare Pages (adapter-cloudflare)
```typescript
// For Cloudflare Pages
import adapter from '@sveltejs/adapter-cloudflare';

export default {
    kit: {
        adapter: adapter()
    }
};
```

## Deployment Platforms

### Vercel Deployment

#### Configuration (vercel.json)
```json
{
    "framework": "sveltekit",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install",
    "devCommand": "npm run dev",
    "envPrefix": "VITE_",
    "functions": {
        "src/routes/api/**.ts": {
            "runtime": "nodejs18.x"
        }
    },
    "headers": [
        {
            "source": "/build/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=31536000, immutable"
                }
            ]
        }
    ]
}
```

#### Deployment Steps
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or using GitHub integration (automatic)
git push origin main
```

### Netlify Deployment

#### Configuration (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/build/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Environment variables
[context.production.environment]
  VITE_API_BASE_URL = "https://api.yourapp.com"

[context.deploy-preview.environment]
  VITE_API_BASE_URL = "https://staging-api.yourapp.com"
```

#### Deployment Steps
```bash
# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod

# Or connect GitHub repository for automatic deployment
```

### Docker Deployment

#### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

WORKDIR /app

# Copy built application
COPY --from=builder --chown=sveltekit:nodejs /app/dist ./dist
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

USER sveltekit

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/index.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_API_BASE_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped
    
  backend:
    image: your-backend-image
    ports:
      - "8000:8000"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    restart: unless-stopped
```

### Kubernetes Deployment

#### Deployment Manifest
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-app
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: api-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: yourapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

## CI/CD Pipeline

### GitHub Actions

#### Build and Deploy Pipeline
```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run check
        
      - name: Run tests
        run: npm run test
        
      - name: Upload test coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
          
      - name: Deploy to staging
        uses: your-deployment-action@v1
        with:
          target: staging
          artifacts: dist/
          api-key: ${{ secrets.STAGING_API_KEY }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
          
      - name: Deploy to production
        uses: your-deployment-action@v1
        with:
          target: production
          artifacts: dist/
          api-key: ${{ secrets.PRODUCTION_API_KEY }}
          
      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

### GitLab CI

#### GitLab CI Configuration
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_DRIVER: overlay2

cache:
  paths:
    - node_modules/
    - .npm/

before_script:
  - npm ci --cache .npm --prefer-offline

test:
  stage: test
  image: node:$NODE_VERSION-alpine
  script:
    - npm run lint
    - npm run check
    - npm run test
  coverage: '/Coverage: \d+\.\d+%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:$NODE_VERSION-alpine
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop

deploy-staging:
  stage: deploy
  image: alpine:latest
  dependencies:
    - build
  script:
    - apk add --no-cache curl
    - curl -X POST "$STAGING_WEBHOOK_URL" -H "Authorization: Bearer $STAGING_TOKEN"
  environment:
    name: staging
    url: https://staging.yourapp.com
  only:
    - develop

deploy-production:
  stage: deploy
  image: alpine:latest
  dependencies:
    - build
  script:
    - apk add --no-cache curl
    - curl -X POST "$PRODUCTION_WEBHOOK_URL" -H "Authorization: Bearer $PRODUCTION_TOKEN"
  environment:
    name: production
    url: https://yourapp.com
  when: manual
  only:
    - main
```

## Performance Optimization

### Build Optimization

#### Code Splitting Strategy
```typescript
// Route-based splitting
const routes = [
    {
        path: '/admin',
        component: lazy(() => import('./pages/AdminPage.svelte'))
    },
    {
        path: '/code',
        component: lazy(() => import('./pages/CodePage.svelte'))
    }
];

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart.svelte'));
const ImageEditor = lazy(() => import('./components/ImageEditor.svelte'));
```

#### Bundle Analysis
```bash
# Analyze bundle composition
npm run build
npx vite-bundle-analyzer dist

# Check for duplicate dependencies
npm ls --depth=0 | grep -E "UNMET|duplicate"

# Audit package sizes
npx bundlephobia <package-name>
```

### Caching Strategy

#### HTTP Caching Headers
```typescript
// Static assets caching
export async function handle({ event, resolve }) {
    if (event.url.pathname.startsWith('/build/')) {
        const response = await resolve(event);
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return response;
    }
    
    return resolve(event);
}
```

#### Service Worker Caching
```typescript
// service-worker.js (if using)
const CACHE_NAME = 'app-v1';
const STATIC_ASSETS = [
    '/',
    '/build/bundle.css',
    '/build/bundle.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
```

## Monitoring and Analytics

### Error Tracking

#### Sentry Integration
```typescript
// src/lib/error-tracking.ts
import * as Sentry from '@sentry/browser';

if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
    Sentry.init({
        dsn: import.meta.env.VITE_ERROR_TRACKING_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 1.0,
        beforeSend(event) {
            // Filter out non-critical errors
            if (event.exception) {
                const error = event.exception.values?.[0];
                if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
                    return null; // Ignore this common warning
                }
            }
            return event;
        }
    });
}

// Usage in components
export function captureError(error: Error, context?: Record<string, any>) {
    console.error('Application error:', error);
    
    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
        Sentry.captureException(error, {
            extra: context
        });
    }
}
```

### Performance Monitoring

#### Web Vitals
```typescript
// src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
        // Send to your analytics service
        console.log('Web Vital:', metric);
    }
}

// Measure all Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Security Considerations

### Content Security Policy

```typescript
// CSP configuration in svelte.config.js
export default {
    kit: {
        csp: {
            mode: 'hash',
            directives: {
                'default-src': ['self'],
                'script-src': ['self', 'unsafe-inline'],
                'style-src': ['self', 'unsafe-inline', 'fonts.googleapis.com'],
                'font-src': ['self', 'fonts.gstatic.com'],
                'img-src': ['self', 'data:', 'https:'],
                'connect-src': ['self', 'wss:', 'https:'],
                'frame-src': ['none'],
                'object-src': ['none'],
                'base-uri': ['self']
            }
        }
    }
};
```

### Environment Security

```bash
# Production environment variables should be set securely
# Never commit sensitive values to version control

# Use platform-specific secret management
# Vercel: Environment Variables in dashboard
# Netlify: Site settings > Environment variables
# Docker: Use secrets or external secret management
# Kubernetes: Use ConfigMaps and Secrets
```

## Rollback Strategy

### Blue-Green Deployment

```bash
# Maintain two identical production environments
# Deploy to inactive environment first
# Switch traffic after validation

# Example with load balancer
curl -X POST "https://api.loadbalancer.com/switch" \
  -H "Authorization: Bearer $LB_TOKEN" \
  -d '{"target": "green"}'
```

### Feature Flags

```typescript
// Feature flag configuration
const FEATURE_FLAGS = {
    NEW_AGENT_UI: import.meta.env.VITE_FEATURE_NEW_AGENT_UI === 'true',
    ADVANCED_ANALYTICS: import.meta.env.VITE_FEATURE_ADVANCED_ANALYTICS === 'true'
};

// Usage in components
{#if FEATURE_FLAGS.NEW_AGENT_UI}
    <NewAgentInterface />
{:else}
    <LegacyAgentInterface />
{/if}
```

## Maintenance

### Health Checks

```typescript
// Health check endpoint
export async function GET() {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: import.meta.env.VITE_APP_VERSION,
        uptime: process.uptime?.() || 0
    };
    
    return new Response(JSON.stringify(health), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

### Log Management

```typescript
// Structured logging
const logger = {
    info: (message: string, meta?: any) => {
        console.log(JSON.stringify({
            level: 'info',
            message,
            timestamp: new Date().toISOString(),
            ...meta
        }));
    },
    error: (message: string, error?: Error, meta?: any) => {
        console.error(JSON.stringify({
            level: 'error',
            message,
            error: error?.message,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            ...meta
        }));
    }
};
```

## See Also

- [Development Guide](development.md) - Development setup and workflow
- [Architecture](architecture.md) - System architecture overview
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
- [Performance Guide](performance.md) - Performance optimization strategies
