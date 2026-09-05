# Cafetería - Guía de Inicio Rápido (Desarrollo / Testing)

Esta guía detalla los pasos para levantar el entorno completo de desarrollo de manera sencilla.

## 1. Levantar Infraestructura (Base de Datos)
En la raíz del proyecto, asegúrate de tener Docker abierto y ejecuta:
```bash
docker-compose -f docker-compose.dev.yml up -d
```
*(Esto levantará PostgreSQL y pgAdmin en segundo plano)*

## 2. Iniciar el Backend
Abre una terminal, ingresa a la carpeta `backend` e inicializa la base de datos y el servidor:
```bash
cd backend
npm run db:migrate    # Crea las tablas en la BD
npm run db:seed       # Inserta el usuario superadmin y los permisos/menús base
npm run start:dev     # Inicia el servidor backend en modo desarrollo (http://localhost:3000)
```
*(Nota: Si hiciste cambios en las entidades, antes de `db:migrate` corre `npm run db:migrate:generate -- src/migrations/NombreMigracion` para generar el archivo de migración).*

## 3. Iniciar el Frontend
Abre **otra terminal**, ingresa a la carpeta `frontend` e inicia la aplicación de Angular:
```bash
cd frontend
npm start
```

## 4. Acceder al Sistema
- **Aplicación web:** [http://localhost:4200](http://localhost:4200)
  - *Usuario:* `superadmin`
  - *Contraseña:* `superadmin`

- **pgAdmin (Gestor de Base de Datos):** [http://localhost:5050](http://localhost:5050)
  - *Usuario:* `admin@cafeteria.com`
  - *Contraseña:* `adminpassword`
  - *(Para registrar el servidor de BD dentro de pgAdmin: Pestaña Connection -> Host: `postgres`, Port: `5432`, Maintenance DB: `cafeteria_dev`, Username: `admin`, Password: `adminpassword`)*
