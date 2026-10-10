# One image that serves both the API and the built React app.
# Works on any container host: Render, Railway, Fly.io, Koyeb, Google Cloud Run,
# Azure Container Apps, AWS App Runner, or a plain VPS with Docker.

# ---- stage 1: build the React frontend -------------------------------------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# VITE_BACKEND_URL is intentionally unset -> UI calls the API on its own origin.
RUN npm run build

# ---- stage 2: runtime ------------------------------------------------------
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY backend ./backend
COPY assets ./assets
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# The platform injects PORT; the app falls back to 3000.
EXPOSE 3000
USER node
CMD ["node", "backend/index.js"]
