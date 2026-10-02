# syntax=docker/dockerfile:1

# ── build: Astro gera o site estático ──────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /src
# O Playwright é devDependency do gerador de thumbnails; o build não o usa e não
# precisa do browser (as imagens já estão em public/, versionadas).
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── runtime: nginx servindo o estático, non-root (padrão do homelab) ───────────
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /src/dist /usr/share/nginx/html
RUN mkdir -p /var/cache/nginx /var/run \
 && chown -R nginx:nginx /var/cache/nginx /var/run /usr/share/nginx/html \
 && touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
