# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - lightweight image
FROM node:18-alpine AS production

WORKDIR /app

# Install serve globally to serve static files
RUN npm install -g serve

# Copy only the built dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3000"]
