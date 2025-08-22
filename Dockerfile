# Stage 1: Build everything
FROM node:18-alpine AS build

WORKDIR /app

# Backend deps
COPY package*.json tsconfig*.json ./

# Frontend deps
COPY frontend/package*.json frontend/tsconfig*.json ./frontend/

# Install deps (with dev deps) for backend
RUN npm ci

# Install deps (with dev deps) for frontend
RUN cd frontend && npm ci

# Copy source
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Build backend
RUN npm run build


# Stage 2: Production image
FROM node:18-alpine AS prod

WORKDIR /app

# Copy backend package files & install prod deps only
COPY package*.json ./
RUN npm ci --only=production

# Copy backend build output
COPY --from=build /app/dist ./dist

# Copy frontend build output
COPY --from=build /app/frontend/build ./frontend/build

EXPOSE 8080

CMD ["npm", "start"]
