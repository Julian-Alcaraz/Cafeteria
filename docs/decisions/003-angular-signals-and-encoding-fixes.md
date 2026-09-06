# Decisión: Migración a Signal Forms y Corrección de Codificación (UTF-8)

## Contexto
Durante la revisión inicial del módulo de autenticación (Login End-to-End), se identificaron varias desviaciones respecto a los estándares de desarrollo definidos en `.agents/skills` para el frontend (Angular 22) y el backend (NestJS). Además, se reportó un problema de "Mojibake" (caracteres corruptos) en la lectura del JWT por parte del frontend.

## Decisiones Tomadas

1. **Adopción Estricta de Signal Forms en Angular v22+**
   - **Por qué:** La skill `angular-developer` establece explícitamente que los nuevos desarrollos o refactorizaciones en Angular 22 deben usar `@angular/forms/signals` (Signal Forms) en lugar del obsoleto `ReactiveFormsModule` (`FormBuilder`).
   - **Implementación:** Se refactorizó `login.component.ts` y su template para manejar el estado reactivo con señales (`form`, `submit`, `[formField]`).

2. **Inyección de Dependencias Moderna (Angular)**
   - **Por qué:** Múltiples servicios (`AuthService`) usaban inyección por constructor clásica.
   - **Implementación:** Se actualizó a la función `inject()` para mantener un código limpio y consistente.

3. **Corrección de Decodificación JWT (Frontend)**
   - **Por qué:** La función `atob()` no procesa correctamente strings en UTF-8 (como la palabra "Menús"), generando problemas visuales (ej. "MenÃºs").
   - **Implementación:** Se reemplazó el uso directo de `atob()` por un flujo que convierte el string binario a un `Uint8Array` y luego lo decodifica usando `TextDecoder('utf-8')`.

4. **Configuración Estricta UTF-8 (Backend y Base de Datos)**
   - **Por qué:** Como medida preventiva global para cualquier otro problema de codificación, se estandarizó el flujo de datos.
   - **Implementación:** Se agregó `client_encoding: 'UTF8'` a la configuración de TypeORM y `POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C.UTF-8"` al contenedor de PostgreSQL en Docker Compose.

5. **Documentación Swagger y Tipado Estricto (Backend)**
   - **Por qué:** El endpoint de login no estaba documentado y se utilizaba `any[]` en `auth.service.ts`.
   - **Implementación:** Se agregaron decoradores Swagger (`@ApiOperation`, `@ApiBody`, `@ApiResponse`) y se eliminó `any` aprovechando la estructura jerárquica nativa de la entidad `Menu`.
