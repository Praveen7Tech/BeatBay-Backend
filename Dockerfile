# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Increase Node memory for TypeScript build
ENV NODE_OPTIONS=--max-old-space-size=1024

RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

RUN mkdir -p /app/logs

EXPOSE 5000

CMD ["node", "dist/src/server.js"]