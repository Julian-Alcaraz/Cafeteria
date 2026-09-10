# Decisiones: CRUD de Usuarios, Menús y Gestión de Permisos

## Contexto
Se requirió implementar de manera integral el CRUD para las entidades `Usuarios` y `Menús`, asegurando la gestión de permisos a través de la asignación de menús, manteniendo intacto el comportamiento del Super Admin y respetando la arquitectura preexistente del proyecto (NestJS en backend, Angular con Signals en frontend).

## Decisiones Funcionales

### 1. CRUD de Menús
- Se implementó un listado, alta, edición y eliminación de Menús en el frontend.
- Cada menú puede tener un `parent_id` para crear estructuras de árbol jerárquicas y un `permission_id` que representa el permiso requerido (`requiredPermission`) para que un usuario pueda visualizarlo.
- Se agregó documentación de Swagger (`@ApiProperty`, `@ApiOperation`, etc.) a los DTOs y Controladores existentes para cumplir con las reglas del backend definidas en `backend/AGENTS.md`.

### 2. CRUD de Usuarios
- Se implementó la gestión de usuarios permitiendo la creación con nombre de usuario y contraseña (hasheada en backend mediante bcrypt).
- En la edición, se habilita el cambio de contraseña de manera opcional.
- Se reutilizó el servicio de backend existente que soporta el parcheado (Patch) de `permissionIds`.

### 3. Asignación de Permisos de Menús por Usuario
- La gestión de accesos se enfocó directamente en la selección de **Menús** por parte del administrador. 
- En el frontend (`UsuariosComponent`), se agregó una funcionalidad separada para administrar los accesos: se le listan al administrador todos los menús que tienen un permiso requerido, permitiéndole marcarlos con casillas de verificación (checkboxes).
- Internamente, al guardar los accesos, la UI extrae y consolida los IDs de los permisos (`requiredPermission.id`) de los menús seleccionados y actualiza el arreglo de `permissions` del usuario mediante el endpoint `PATCH /users/:id`.
- Este enfoque abstrae la complejidad de los permisos para el administrador final, dándole la visión directa de "asignar menús" a un usuario.

### 4. Preservación del Super Admin
- El comportamiento del usuario `superadmin` establecido en los seeders y en el core de la aplicación no ha sido alterado. El Super Admin mantendrá todos los permisos, por lo que su visualización de los menús generados será siempre completa en la estructura calculada por el endpoint de `login`.
