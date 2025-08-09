# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy all files and build frontend
COPY frontend/ .
RUN npm run build

# Stage 2: Production Node server
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production deps
COPY package*.json tsconfig*.json ./
RUN npm ci

# Copy backend source
COPY . .

# Copy built frontend into backend's public folder
RUN mkdir -p dist
COPY --from=frontend-build /frontend/build ./dist

# Build the backend TypeScript code
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
