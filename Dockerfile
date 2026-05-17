# syntax=docker/dockerfile:1.6

# ---- Builder: install all deps and produce .next build ----
FROM node:20-alpine AS builder
WORKDIR /app

# better-sqlite3 native build deps
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime: small image with prod deps only ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# libstdc++ is needed by the better-sqlite3 native binding at runtime
RUN apk add --no-cache libstdc++

COPY package.json package-lock.json* ./

# Install prod deps and rebuild native modules; remove toolchain afterwards
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
 && npm ci --omit=dev \
 && apk del .build-deps

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./

# SQLite + config land here. On Railway, mount a Volume at /app/data via the UI.
RUN mkdir -p /app/data

EXPOSE 3000

# Railway/Fly inject PORT; next start respects it.
CMD ["npm", "run", "start"]
