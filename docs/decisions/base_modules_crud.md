# Módulos Base (Users, Menus, Permissions)

## Fecha
2026-09-04

## Contexto
Se requieren los módulos base para la gestión de usuarios, menús y permisos dentro del sistema, implementando operaciones CRUD estándar y algunas reglas de negocio específicas de seguridad.

## Decisiones Técnicas y Lógica de Negocio

1. **Gestión de Contraseñas (Users)**:
   - Se ha implementado el hashing de contraseñas utilizando `bcrypt`.
   - El hashing se aplica de manera automática en el `UsersService` al momento de crear un usuario (`create`) o al actualizarlo (`update`), siempre que la contraseña (campo `password_hash`) se provea en los DTOs.
   - Salt rounds definidos: 10.

2. **Validaciones de DTOs**:
   - Para la creación (`create`) se usa `class-validator` para asegurar que los campos obligatorios estén presentes y sean de los tipos correctos (e.g. `@IsString()`, `@IsNotEmpty()`, `@IsNumber()`).
   - Para las actualizaciones (`update`), se utiliza `PartialType` provisto por `@nestjs/mapped-types` de forma que los campos sean opcionales sin repetir la lógica de validación del DTO de creación.

3. **Inyección y Repositorios (TypeORM)**:
   - Cada servicio (`UsersService`, `MenusService`, `PermissionsService`) utiliza la anotación `@InjectRepository` para inyectar su respectivo repositorio TypeORM de manera independiente y controlada.
   - Las operaciones CRUD manejan las respuestas asíncronas de la base de datos de manera directa, verificando la existencia del recurso al momento de eliminarlo o actualizarlo mediante un `findOne`.

4. **Testing de Servicios**:
   - Cada servicio cuenta con pruebas unitarias (`.spec.ts`) mockeando los repositorios de TypeORM.
   - La lógica de negocio como el hashing de contraseñas en `UsersService` cuenta con sus propios mocks (`jest.mock('bcrypt')`) para asegurar que el hash se realiza correctamente sin incurrir en la penalización de rendimiento durante los tests, alcanzando así un alto code coverage.
