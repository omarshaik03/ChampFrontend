# =============================================================================
# ChampFrontend - Svelte.js Frontend Docker Image
# =============================================================================

FROM node:18-alpine

WORKDIR /app

# --- Build-time overridable arguments (provide --build-arg to change) ---
ARG API_BASE_URL="https://hpcsiaipoc.azurewebsites.net"
ARG AI_AGENTIC_URL="https://hpcsiaipoc-agent-dev.azurewebsites.net"
ARG CODE_CONVERSION_URL="https://hpcsiaipoc-codeconvert.azurewebsites.net"
ARG DOCUMENT_INSIGHTS_URL=""
ARG CODE_INSIGHTS_URL=""
ARG CODE_REVIEW_URL="https://hpcsiaipoc-codereview.azurewebsites.net"

# Vite build-time environment variables
ARG VITE_API_BASE_URL="https://hpcsiaipoc.azurewebsites.net"
ARG VITE_AI_AGENTIC_URL="https://hpcsiaipoc-agent-dev.azurewebsites.net"
ARG VITE_CODE_CONVERSION_URL="https://hpcsiaipoc-codeconvert.azurewebsites.net"
ARG VITE_DOCUMENT_INSIGHTS_URL=""
ARG VITE_CODE_INSIGHTS_URL=""
ARG VITE_CODE_REVIEW_URL="https://hpcsiaipoc-codereview.azurewebsites.net"

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AI_AGENTIC_URL=$VITE_AI_AGENTIC_URL
ENV VITE_CODE_CONVERSION_URL=$VITE_CODE_CONVERSION_URL
ENV VITE_DOCUMENT_INSIGHTS_URL=$VITE_DOCUMENT_INSIGHTS_URL
ENV VITE_CODE_INSIGHTS_URL=$VITE_CODE_INSIGHTS_URL
ENV VITE_CODE_REVIEW_URL=$VITE_CODE_REVIEW_URL

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Use npm ci for reproducible builds
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Copy and prepare entrypoint script (after build so we can override config at runtime)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8001/ || exit 1

# Set entrypoint and default command
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "serve"]
