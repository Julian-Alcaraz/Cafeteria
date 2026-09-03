# Etapa de compilación
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Ajustar el nombre de la carpeta según el output de Angular
# El output normal en angular >= 17 es dist/frontend/browser
# Revisar si se llama así o de otra forma
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
