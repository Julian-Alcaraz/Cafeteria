# Etapa de compilación
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos solo las dependencias de producción
RUN npm ci --omit=dev
# Copiamos el build
COPY --from=build /app/dist ./dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Script para ejecutar migraciones y luego iniciar la app
# Es importante que el package.json tenga un script db:migrate
CMD npm run db:migrate:prod && node dist/main.js
