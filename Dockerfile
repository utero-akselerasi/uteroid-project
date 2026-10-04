# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────
# utero.id — production image (Next.js 16 standalone output)
#
# Multi-stage: deps → builder → runner. Only the runner ships, so the
# final image carries no source, no dev deps, and no npm cache.
# Node 22 (alpine) satisfies Next 16's engines: node >=20.9.0
# ─────────────────────────────────────────────────────────────────────

# ── Stage 1: install dependencies ────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Copy lockfile first so this layer caches until dependencies change.
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ───────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_GA4_MEASUREMENT_ID
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID \
    NEXT_PUBLIC_GA4_MEASUREMENT_ID=$NEXT_PUBLIC_GA4_MEASUREMENT_ID \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

# Disable telemetry during build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: runtime ─────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as non-root: a compromised process should not own the filesystem.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# standalone/ already contains server.js plus the traced node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# public/ and .next/static are NOT included in standalone — copy explicitly.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
# 0.0.0.0 so the port is reachable from outside the container.
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
