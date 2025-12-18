# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy workspace package files
COPY packages/shared/package.json ./packages/shared/
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies (including dev deps for building)
RUN npm install

# Copy source code
COPY . .

# Build packages
# 1. Shared (dependency for others)
RUN npm run build --workspace=@pickup/shared

# 2. Client (produces dist/)
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build:prod --prefix client

# 3. Server (produces dist/)
# Note: Ensure server tsconfig outputs to dist/
RUN npm run build --prefix server

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
# Root node_modules (pruned for production would be ideal, but for simplicity we copy all or prune here)
# For strictness: install only prod deps. But workspace linking is tricky. 
# We'll copy node_modules from builder for now to ensure workspace links work.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy built artifacts
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

COPY --from=builder /app/client/dist ./client/dist

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/

# Expose port (Cloud Run defaults to 8080)
# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080
ENV PORT=8080

# Start server
CMD ["node", "server/dist/index.js"]
