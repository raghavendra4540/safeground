# Stage 1: Build Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Server & Runtime
FROM node:20-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Copy built frontend assets to server's client dist location
COPY --from=client-builder /app/client/dist ./client/dist

# Expose production port
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start server
CMD ["node", "server/src/server.js"]
