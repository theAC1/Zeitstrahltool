# syntax=docker/dockerfile:1

# Base image with Node.js
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Dependencies stage - install production dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder stage - install ALL dependencies (including devDependencies)
FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
# Install all dependencies including devDependencies (typescript, etc.)
RUN npm ci
COPY . .
# Build the Next.js application
RUN npm run build

# Runner stage - final production image
FROM base AS runner
RUN apk add --no-cache libc6-compat

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
