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

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80
CMD ["npm", "start"]
