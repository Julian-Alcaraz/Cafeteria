# Decisión Arquitectónica 002: Arquitectura General y Normativas de Desarrollo

## Contexto
Antes de iniciar con el desarrollo de los requerimientos de negocio, es necesario establecer las bases arquitectónicas, de estilo de código, flujos de trabajo (CI/CD) y patrones de diseño tanto para el frontend como para el backend. Esto asegura consistencia, calidad de código y un entendimiento compartido en el equipo.

## Decisiones Tomadas

### 1. Seguridad
- Será abordada de forma dedicada en el primer requerimiento de negocio.

### 2. Frontend (Angular)
- **UI y Estilos**: Se utilizará CSS nativo para componentes simples (ej. inputs, botones estándar). **PrimeNG** se reservará estrictamente para componentes complejos que aporten valor significativo (ej. tablas de datos dinámicas, gráficos, modales complejos).
- **Manejo de Estado**: Se utilizarán **Signals** nativos de Angular para el estado reactivo.
- **Estructura y Arquitectura**: 
  - Se utilizarán **Standalone Components**.
  - Todo componente debe mantener la estructura estandarizada de 4 archivos: `.ts`, `.html`, `.css`, y `.spec.ts`.
  - La arquitectura será orientada a **Features** (ej. dominio/funcionalidad agrupada), a excepción del módulo de Autenticación.
  - El enrutamiento debe implementar **Lazy Loading** por defecto para cada feature para optimizar los tiempos de carga.

### 3. Backend (NestJS)
- **Validaciones**: Uso obligatorio de `class-validator` y `class-transformer` a través de DTOs para todas las entradas de datos.
- **Formato Estándar de Respuesta**: Todas las respuestas de la API (tanto exitosas como errores) deben tener la siguiente estructura estandarizada:
  ```json
  {
    "code": number, // Código de estado HTTP o código interno
    "message": string, // Mensaje descriptivo
    "data": any // Carga útil (opcional, null si no aplica)
  }
  ```
  Esto se implementará mediante Interceptors (para éxitos) y Exception Filters (para errores) a nivel global en NestJS.
- **Arquitectura Interna**: Estructura de capas clásica (Controller -> Service -> Repository). 
  - Los **Controladores (Controllers)** deben mantenerse "limpios" (thin controllers) y limitarse a recibir la petición, delegar y devolver la respuesta.
  - Toda la **Lógica de Negocio** debe residir obligatoriamente en los **Servicios (Services)**.

### 4. Control de Versiones, CI/CD y Calidad
- **Convenciones de Commits**: Se utilizará Semantic/Conventional Commits con prefijos claros (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, etc.).
- **Validaciones de Pre-commit**: No se permitirá subir un commit (push o commit local) si no se cumplen las siguientes condiciones:
  - El **Linter** (oxlint en backend / angular-eslint en frontend) debe pasar sin errores.
  - Las **Pruebas Unitarias** deben pasar exitosamente.
  - La **Cobertura de Código (Coverage)** debe ser de un mínimo del **80%**.

### 5. Observabilidad (Logs)
- Se utilizará el sistema de Logs por defecto integrado en NestJS.
- **Obligatoriedad**: Es mandatorio implementar logs en el backend para trazar flujos importantes y errores.
- **Formato**: Cada log debe incluir explícitamente el **archivo**, la **función** donde ocurre y el **mensaje** puntual.

## Consecuencias
- El equipo deberá instalar dependencias adicionales de validación en el backend (`class-validator`, `class-transformer`).
- Será necesario configurar hooks de git (ej. Husky) para aplicar las políticas de validación en los commits.
- Se implementará un Interceptor y un Filtro de Excepciones global en el backend antes del primer caso de uso.
- Todos los desarrolladores deben guiarse por el principio de "Test Driven Development" (o al menos escribir pruebas para todo código nuevo) para mantener el 80% de cobertura.
