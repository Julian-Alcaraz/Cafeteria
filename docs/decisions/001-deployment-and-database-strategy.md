# Decisión Arquitectónica 001: Estrategia de Despliegue, Base de Datos y ORM

## Contexto
El proyecto requiere ser desplegado en entornos locales separados (Testing y Producción), cada uno con su propio frontend, backend y base de datos persistente. Además, se requiere un entorno de desarrollo donde la base de datos esté dockerizada pero el frontend y backend se levanten con comandos nativos (`npm run start:dev`, `ng serve`). Para mantener la base de datos separada de la lógica de negocio, se requiere la implementación de un ORM.

## Decisiones Tomadas

1. **Gestor de Contenedores y Entornos:** 
   - Se utilizará **Docker** y **Docker Compose**.
   - Se manejarán archivos `docker-compose` separados para cada entorno para maximizar el aislamiento y evitar colisiones de puertos.
     - `docker-compose.dev.yml`: Solo base de datos y pgAdmin (puertos estándar o definidos para dev).
     - `docker-compose.test.yml`: Front, Back, BD (puerto 5433 expuesto para DBeaver), pgAdmin.
     - `docker-compose.prod.yml`: Front, Back, BD (puerto 5434 expuesto para DBeaver), pgAdmin.

2. **Base de Datos y Persistencia:**
   - **PostgreSQL** como motor principal de base de datos.
   - Para testing y producción se utilizarán **volúmenes de Docker** que permitirán persistir los datos incluso si se hace `down` o `rebuild` de los contenedores, evitando la pérdida de información accidental.

3. **ORM y Migraciones:**
   - **TypeORM** fue seleccionado como el ORM. Su integración nativa con NestJS facilita el trabajo mediante clases y decoradores (`@Entity`).
   - Las migraciones en `testing` y `producción` se configurarán para ejecutarse **automáticamente** antes del inicio del servidor Node (en el comando de inicio o contenedor), asegurando que la estructura de la base de datos se mantenga sin borrar datos preexistentes.
   - Para desarrollo, se proveerán comandos manuales (ej. `npm run db:migrate`, `npm run db:seed`) para controlar la estructura y resetear si es requerido.

4. **Reverse Proxy en Nginx y Exposición a Internet (Cloudflare Tunnel):**
   - **Problema:** Usar una IP privada fija (`192.168.0.16:3000/api`) en el frontend impide que clientes externos a la red local puedan comunicarse con el backend al exponer el servidor a Internet.
   - **Solución de Ruteo Interno:** Se configuró `frontend/nginx.conf` con un bloque `location /api/` que actúa como Reverse Proxy (`proxy_pass http://backend:3000/api/`) a través de la red interna de Docker, y `apiUrl: '/api'` en los archivos de environment (`environment.production.ts` y `environment.staging.ts`). De esta forma, tanto el tráfico web como las llamadas a la API pasan por un único punto de entrada (el puerto 80 del contenedor frontend), funcionando simultáneamente en red local (`http://192.168.0.16:8081`) y en Internet sin depender de una IP fija.
   - **Buffers de Cabecera en Nginx (`400 Request Header Or Cookie Too Large`):** Dado que el JWT generado en `AuthService` almacena el árbol de menús y la lista de permisos del usuario, el header `Authorization: Bearer <token>` para usuarios con muchos permisos (como `superadmin`) supera los 8 KB por defecto de Nginx. Se configuró `client_header_buffer_size 64k` y `large_client_header_buffers 4 64k` (junto con `proxy_buffers`) en `frontend/nginx.conf`.
   - **Exposición a Internet sin abrir puertos (Quick Tunnel):** En `docker-compose.test.yml` se incorporó el servicio `tunnel` (`cloudflare/cloudflared:latest`) apuntando a `http://frontend:80` con `--metrics 0.0.0.0:2000`, generando una URL pública HTTPS (`*.trycloudflare.com`) sin necesidad de configurar Port Forwarding ni lidiar con CGNAT.
   - **Notificación Automática por Correo (`tunnel-notifier`):** Se añadió el servicio `tunnel-notifier` (`curlimages/curl:latest`) en `docker-compose.test.yml`, que consulta periódicamente `http://tunnel:2000/metrics` para detectar la URL pública generada por Cloudflare, resuelve automáticamente el nombre del contenedor levantado (por ejemplo `cafeteria test` a partir de `cafeteria_frontend_test`), y dispara un `POST` a un Webhook de Google Apps Script que envía automáticamente un correo con el nombre del servidor y el nuevo enlace al administrador.

## Consecuencias
- La inicialización por primera vez de un ambiente requiere correr los comandos de migración.
- El servidor backend no iniciará (y el contenedor fallará/reiniciará) si la base de datos no está disponible.
- Los desarrolladores necesitarán ejecutar `docker-compose -f docker-compose.dev.yml up -d` antes de iniciar el backend localmente.
- Para conocer la URL pública generada en el entorno de testing, basta con inspeccionar los logs del contenedor `cafeteria_tunnel_test` (`docker logs cafeteria_tunnel_test`).
