# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js app
RUN pnpm run build

# ---------- PROD DEPENDENCIES STAGE ----------
FROM node:20-alpine AS prod-deps
WORKDIR /app

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod --ignore-scripts \
    && pnpm store prune \
    && rm -rf /root/.pnpm-store

# Remove unnecessary files from node_modules
RUN find node_modules -type d -name "test" -o -name "__tests__" -exec rm -rf {} + \
    && find node_modules -type f -name "*.md" -delete

# ---------- RUNNER STAGE ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built app and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy PDF assets
COPY --from=builder /app/src/assets ./src/assets

# Set environment variables and expose port
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start Next.js using the CLI
CMD ["node_modules/.bin/next", "start", "-p", "8080"]

