# Deuda Técnica y Errores Pendientes

Este archivo sirve para registrar problemas menores, errores en tests o deuda técnica que no bloquean el desarrollo pero deben ser solucionados eventualmente.

## Frontend
- [ ] **Tests de app.component**: Arreglar `app.spec.ts` ya que ahora falla porque eliminamos el código HTML de bienvenida (`h1`) de Angular.
- [ ] **Tests de AuthService**: `auth.service.spec.ts` falla porque falta configurar un mock para `localStorage` en el entorno jsdom de Vitest, y hay problemas con la inyección del `HttpTestingController`.
- [ ] **Redirección post-login**: En `AuthService.login`, la redirección está hardcodeada a `/app/configuraciones/usuarios`. Debería redirigir al menú dinámico por defecto según los permisos del usuario.

## Backend
- [ ] (Aún no hay problemas registrados)
