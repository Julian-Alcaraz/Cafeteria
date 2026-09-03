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

## Consecuencias
- La inicialización por primera vez de un ambiente requiere correr los comandos de migración.
- El servidor backend no iniciará (y el contenedor fallará/reiniciará) si la base de datos no está disponible.
- Los desarrolladores necesitarán ejecutar `docker-compose -f docker-compose.dev.yml up -d` antes de iniciar el backend localmente.
