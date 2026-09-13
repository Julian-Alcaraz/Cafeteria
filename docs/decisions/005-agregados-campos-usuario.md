# 005 - Campos Opcionales del Usuario

## Contexto
El sistema requería almacenar información de contacto y perfil adicional para los usuarios, más allá del nombre de usuario y la contraseña.

## Decisión
Se agregaron 4 campos opcionales al modelo de `Usuario`:
- `email`: Correo electrónico del usuario (validado estrictamente en backend mediante `class-validator` con `@IsEmail()`).
- `telefono`: Número de contacto del usuario.
- `nombre`: Nombre real del usuario.
- `apellido`: Apellido del usuario.

Estos campos son opcionales (`nullable: true` en base de datos) para mantener la retrocompatibilidad con usuarios previamente creados.

## Implicaciones
- Se actualizaron los DTOs en el backend (`CreateUserDto` y `UpdateUserDto`).
- Se actualizó la interfaz del frontend `User`.
- Se agregó soporte para estos campos en el formulario reactivo de creación/edición de usuarios en el frontend.
- Se agregaron las columnas respectivas en la tabla de listado de usuarios (`usuarios-table.component.ts`).
- Los tests del servicio de usuarios en backend fueron modificados para contemplar los nuevos campos en la creación y actualización.
