# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm install --frozen-lockfile

# Copy source code and config files
COPY . .

# Build Next.js and TypeScript
RUN pnpm run clean
RUN pnpm run build

# Clean up unnecessary files
RUN rm -rf node_modules src tests *.log

# ---------- PROD Dependencies STAGE ----------
FROM node:20-alpine AS prod-deps
WORKDIR /app

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm install --frozen-lockfile --prod --ignore-scripts \
 && pnpm store prune \
 && rm -rf /root/.pnpm-store

# Remove unnecessary files from node_modules
RUN find node_modules -type d -name "test" -o -name "__tests__" -exec rm -rf {} + \
 && find node_modules -type f -name "*.md" -delete

# ---------- RUNTIME STAGE ----------
FROM gcr.io/distroless/nodejs20:nonroot AS runner
WORKDIR /app

# Install only production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy only necessary files for runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Set environment variables and expose port
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["dist/server.js"]
