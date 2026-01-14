FROM node:18-alpine

# Set working directory explicitly
WORKDIR /app

# --- Build-time overridable arguments (provide --build-arg to change) ---
ARG API_BASE_URL="https://hpcsiaipoc.azurewebsites.net"
ARG AI_AGENTIC_URL="https://hpcsiaipoc-agent-dev.azurewebsites.net"
ARG CODE_CONVERSION_URL="https://hpcsiaipoc-codeconvert.azurewebsites.net"
# If you also want to alter the inlined Vite values without editing .env, pass the VITE_ versions:
ARG VITE_API_BASE_URL="https://hpcsiaipoc.azurewebsites.net"
ARG VITE_AI_AGENTIC_URL="https://hpcsiaipoc-agent-dev.azurewebsites.net"
ARG VITE_CODE_CONVERSION_URL="https://hpcsiaipoc-codeconvert.azurewebsites.net"

ENV TEST="123"

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Copy entrypoint after build so we can override config at container start
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 8001

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "serve"]