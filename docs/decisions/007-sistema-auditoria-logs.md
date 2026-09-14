# Decisión Funcional: Sistema de Auditoría y Logs (HTTP Level)

## Contexto y Motivación
Se requería un sistema de auditoría capaz de registrar todos los cambios (`INSERT`, `UPDATE`, `DELETE`) en la base de datos, capturando qué se envió (request) y qué se devolvió (response/error).
Requisitos principales:
1. Sin agregar delay a las peticiones (asíncrono).
2. Diferenciar entre éxito y error.
3. Permitir configurar desde BD rutas a ignorar.

## Decisión
En lugar de interceptar a nivel BD (TypeORM subscribers), se decidió interceptar a **nivel HTTP** (Interceptor y Filtro de excepciones). 
Esto permite:
- Capturar los errores HTTP de validación antes de que toquen la BD.
- Registrar el JSON exacto de entrada y el JSON exacto de salida o error.
- Procesar asincrónicamente el guardado para no demorar la respuesta al cliente.

Se han implementado:
1. **AuditLog**: Entidad y tabla que guarda `userId`, `method`, `url`, `requestPayload` (jsonb), `responsePayload` (jsonb), `statusCode`, `isSuccess` y `executionTimeMs`.
2. **AuditIgnoreRule**: Entidad y ABM que permite configurar (mediante su patrón de ruta) qué peticiones NO se deben auditar (ej. `/api/logs/*`).
3. **AuditInterceptor**: Intercepta modificaciones exitosas (`POST`, `PUT`, `PATCH`, `DELETE`) y emite el guardado asíncrono enmascarando contraseñas/tokens.
4. **Filtro de Excepciones**: Se modificó `AllExceptionsFilter` para inyectar `AuditService` y guardar como fallidos (`isSuccess=false`) los errores en los métodos de modificación.

## Impacto
El sistema cuenta ahora con un endpoint `/api/audit-ignore-rules` para configurar excepciones, y la tabla `audit_logs` que mantendrá el historial auditable completo sin comprometer rendimiento.
