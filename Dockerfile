# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the rest of the files and build
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine AS final
WORKDIR /app

# Copy all package files and install ALL dependencies (including Vite)
COPY package*.json ./
RUN npm install --include=dev

# Copy built files and source files
COPY --from=build /app/dist ./dist
COPY vite.config.js ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80
CMD ["npm", "run", "preview"]
