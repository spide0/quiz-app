# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm install --include=dev

# Copy remaining source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE $PORT

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Start command
CMD ["node", "dist/index.js"]
