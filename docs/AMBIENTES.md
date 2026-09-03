# Guía de Entornos (Ambientes)

Este documento describe los tres ambientes configurados para la aplicación (Desarrollo, Testing y Producción), cómo se levantan, su arquitectura y el tratamiento de los datos en cada uno.

---

## 1. Entorno de Desarrollo (Local)

Este ambiente está pensado para la programación diaria. Aquí buscas velocidad de recarga (hot-reload) y flexibilidad total sobre los datos.

*   **Archivo:** `docker-compose.dev.yml`
*   **¿Cómo funciona?** Docker *solo* se encarga de levantar la base de datos (PostgreSQL) y el gestor web (pgAdmin). El código de Frontend y Backend se ejecuta directamente en tu máquina local usando los comandos nativos de Node/Angular.
*   **Comandos para levantar:**
    1.  Levantar infraestructura: `docker compose -f docker-compose.dev.yml up -d`
    2.  Levantar backend: `cd backend && npm run start:dev`
    3.  Levantar frontend: `cd frontend && ng serve`
*   **Tratamiento de Datos:**
    *   **Base de datos:** `cafeteria_dev` (Puerto host: `5432`).
    *   **Persistencia:** Utiliza un volumen de Docker, pero los datos se consideran "desechables".
    *   **Migraciones y Sembrado:** Tú tienes el control. Puedes modificar la base de datos libremente corriendo los comandos en el backend:
        *   `npm run db:migrate` (Aplicar cambios)
        *   `npm run db:seed` (Poblar con datos de prueba)
        *   `npm run db:reset` (Borrar toda la base de datos y recrearla desde cero).

---

## 2. Entorno de Testing

Este ambiente simula el entorno de producción pero de manera local o en un servidor de pruebas. Sirve para validar que la aplicación "dockerizada" funciona correctamente antes de un pase a producción real.

*   **Archivo:** `docker-compose.test.yml`
*   **¿Cómo funciona?** Todo el stack (Frontend compilado en Nginx, Backend en Node, PostgreSQL y pgAdmin) se ejecuta dentro de contenedores de Docker de forma aislada.
*   **Comandos para levantar:**
    *   `docker compose -f docker-compose.test.yml up -d --build`
*   **Acceso:** Frontend (`http://localhost:8081`), pgAdmin (`http://localhost:5051`).
*   **Tratamiento de Datos:**
    *   **Base de datos:** `cafeteria_test` (Puerto host: `5433` - *esto te permite conectarte con DBeaver simultáneamente con dev*).
    *   **Persistencia:** Los datos están estrictamente **aislados y persistidos** a través del volumen de Docker `postgres_test_data`. Si bajas el contenedor (`docker compose down`) y lo vuelves a subir, los datos seguirán allí.
    *   **Migraciones:** Se ejecutan **automáticamente** al arrancar el contenedor del backend, asegurando que los datos existentes no se pierdan o se pisen, simplemente adaptando la estructura a los nuevos cambios.

---

## 3. Entorno de Producción

Es el ambiente definitivo que usan los usuarios finales. Está optimizado para seguridad, rendimiento y preservación de información.

*   **Archivo:** `docker-compose.prod.yml`
*   **¿Cómo funciona?** Al igual que testing, todo corre en contenedores. Utiliza las versiones más ligeras y productivas de las imágenes (Nginx y Node sin dependencias de desarrollo).
*   **Comandos para levantar:**
    *   `docker compose -f docker-compose.prod.yml up -d --build`
*   **Acceso:** Frontend (`http://localhost:8080`), pgAdmin (`http://localhost:5052`).
*   **Tratamiento de Datos:**
    *   **Base de datos:** `cafeteria_prod` (Puerto host: `5434`).
    *   **Persistencia:** La integridad de los datos es crítica. Utiliza el volumen `postgres_prod_data`.
    *   **Migraciones:** Funcionan de forma **automática y estrictamente aditiva**. Antes de que el servidor NestJS reciba tráfico, aplica cualquier migración nueva a la base de datos. Bajo NINGÚN concepto se deben ejecutar scripts de `seed` o `reset` en este ambiente, ya que borrarían datos reales de clientes.

---

## 💡 Notas sobre Gestión de la Base de Datos

*   **pgAdmin (Recomendado):** Cada entorno levanta su propio pgAdmin web. Accede a ellos desde tu navegador.
    *   **Desarrollo:** `http://localhost:5050`
    *   **Testing:** `http://localhost:5051`
    *   **Producción:** `http://localhost:5052`
    *   **Credenciales de acceso web:** Usuario `admin@cafeteria.com`, Contraseña `adminpassword`.
    *   **Cómo registrar el servidor internamente:** Al registrar el servidor en pgAdmin, en la pestaña "Connection", el campo **Host** debe ser **`postgres`** (no localhost, ya que pgAdmin se comunica internamente dentro de la red de Docker). El usuario y base de datos dependerán del entorno (ej. `admin` / `adminpassword`).

*   **DBeaver (Conexión Directa):** Dado que asignamos puertos diferentes a cada ambiente (Dev: 5432, Test: 5433, Prod: 5434), puedes tener las conexiones configuradas en DBeaver hacia `localhost` y el puerto correspondiente. *(Nota: Si experimentas errores de "invalid TimeZone", deberás añadir `-Duser.timezone=America/Argentina/Buenos_Aires` a tu archivo `dbeaver.ini`).*
