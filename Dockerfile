# Stage 1: Build
FROM node:22-alpine3.19 AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the NestJS application
RUN npm install -g @nestjs/cli
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine3.19

# Set working directory
WORKDIR /usr/src/app

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Set environment variables (customize as needed)
ENV PORT=9999
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://root:password@mongodb
ENV STATIC_FILE_PATH=/static

# Expose the port the app runs on
EXPOSE $PORT

# Start the application (use the command that matches your project)
CMD [ "node", "dist/main" ]
