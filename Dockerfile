# Stage 1: Build
FROM node AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Build the NestJS application
RUN npm install -g @nestjs/cli
RUN npm run build

# Stage 2: Runtime
FROM node

# Set working directory
WORKDIR /usr/src/app

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Set environment variables (customize as needed)
ENV PORT=3000
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE $PORT

# Start the application (use the command that matches your project)
CMD [ "node", "dist/main" ]
