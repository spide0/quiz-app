# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy the remaining source code and build the project
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only the production dependency manifests
COPY package*.json ./
RUN npm install --only=production

# Copy the built output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port that your app listens on (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
