# Etapa de compilación
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm pkg delete scripts.prepare && npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos solo las dependencias de producción
RUN npm pkg delete scripts.prepare && npm install --omit=dev
# Copiamos el build y las llaves JWT
COPY --from=build /app/dist ./dist
COPY --from=build /app/keys ./keys

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Script para ejecutar migraciones y luego iniciar la app
# Es importante que el package.json tenga un script db:migrate
CMD npm run db:migrate:prod && node dist/main.js
