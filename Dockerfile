FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1


FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts


FROM base AS builder

ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MEDIA_URL
ARG NEXT_PUBLIC_MEDIA_DELIVERY_URL
ARG CSP_MEDIA_ORIGINS

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_MEDIA_URL=${NEXT_PUBLIC_MEDIA_URL}
ENV NEXT_PUBLIC_MEDIA_DELIVERY_URL=${NEXT_PUBLIC_MEDIA_DELIVERY_URL}
ENV CSP_MEDIA_ORIGINS=${CSP_MEDIA_ORIGINS}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN test -n "$NEXT_PUBLIC_SITE_URL" \
  && test -n "$NEXT_PUBLIC_API_URL" \
  && test -n "$NEXT_PUBLIC_MEDIA_URL" \
  && test -n "$CSP_MEDIA_ORIGINS" \
  || (echo "NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_MEDIA_URL, and CSP_MEDIA_ORIGINS build arguments are required" && exit 1)

RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

LABEL maintainer="PML Development Team"
LABEL description="Pharma Metrics Labs website frontend"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Keep application code read-only to the runtime user while preserving the
# cache directory Next.js needs for image optimization and incremental output.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "const http=require('node:http');const host=(process.env.ALLOWED_HOSTS||'').split(',').map(value=>value.trim()).find(Boolean);if(!host)process.exit(1);const request=http.get({hostname:'127.0.0.1',port:process.env.PORT||3000,path:'/internal/health',headers:{Host:host}},response=>{response.resume();process.exit(response.statusCode===200?0:1)});request.setTimeout(4000,()=>request.destroy());request.on('error',()=>process.exit(1));"]

CMD ["node", "server.js"]
