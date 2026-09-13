# Decisión Funcional: Entidad Base y Campos de Auditoría

## Contexto y Motivación
Se ha identificado la necesidad de estandarizar la estructura de las entidades en la base de datos para asegurar un rastreo básico de auditoría y soporte para borrados lógicos en todo el sistema.

## Decisión
1. Se ha creado una clase abstracta `BaseEntity` (`backend/src/common/entities/base.entity.ts`).
2. Se requiere obligatoriamente que **todas** las entidades de la base de datos (actuales y futuras) hereden de esta clase.
3. Esta clase provee los siguientes campos estándar:
   - `id`: Identificador principal (PrimaryGeneratedColumn).
   - `createdAt`: Fecha de creación del registro (`timestamp`, por defecto `NOW()`).
   - `updatedAt`: Fecha de última modificación del registro (`timestamp`, se actualiza automáticamente).
   - `deshabilitado`: Bandera booleana para soportar el borrado lógico (`boolean`, por defecto `false`).

## Impacto
- Las entidades `User`, `Menu` y `Permission` han sido actualizadas para extender de `BaseEntity`.
- Los registros existentes en la base de datos de pruebas adoptarán la fecha de la migración como su `createdAt` y `updatedAt`.
- Cualquier entidad futura debe extender `BaseEntity` y omitir la declaración de su propio campo `id`.
