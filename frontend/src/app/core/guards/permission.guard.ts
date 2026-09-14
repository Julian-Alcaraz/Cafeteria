import { inject } from '@angular/core';
import { Router, CanActivateChildFn } from '@angular/router';
import { AuthService, MenuNode } from '@core/services/auth.service';

export const permissionGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const session = authService.session();
  if (!session) {
    return router.parseUrl('/auth/login');
  }

  if (state.url === '/app' || state.url === '/app/' || state.url.startsWith('/app/no-access')) {
    return true;
  }

  const currentUrl = state.url.split('?')[0];

  // Buscamos si el usuario tiene acceso a la ruta exacta o a una ruta padre válida
  const hasAccess = checkExactOrBestMatch(session.menus, currentUrl);

  if (hasAccess) {
    return true;
  }

  return router.parseUrl('/app/no-access');
};

function checkExactOrBestMatch(menus: MenuNode[], url: string): boolean {
  const flatAllowedMenus: string[] = [];
  
  const flatten = (nodes: MenuNode[]) => {
    for (const node of nodes) {
      if (node.url) {
        let normalized = node.url;
        if (!normalized.startsWith('/app')) {
          normalized = normalized.startsWith('/') ? '/app' + normalized : '/app/' + normalized;
        }
        flatAllowedMenus.push(normalized);
      }
      if (node.children) flatten(node.children);
    }
  };
  
  flatten(menus);

  // Validacion estricta:
  // Si la ruta base (ej. /app/configuraciones/usuarios) no esta en flatAllowedMenus, denegamos.
  // Pero que pasa si la url es /app/configuraciones/usuarios/123 ?
  // Verificamos si existe CUALQUIER menu que sea un match exacto, 
  // o si es prefijo PERO asegurandonos de que la longitud de la coincidencia
  // sea la mayor posible para evitar el bug del padre autorizando al hijo.
  
  // Ordenar de mayor a menor longitud
  flatAllowedMenus.sort((a, b) => b.length - a.length);

  // Para solucionarlo, definimos que los modulos hijo NO deben ser autorizados por un prefijo generico
  // si el hijo es en si mismo un modulo protegido.
  // Dado que no sabemos todos los modulos en el frontend, la mejor aproximacion en Angular
  // cuando las rutas se manejan dinamicamente desde DB es exigir MATCH EXACTO para las URLs de menus.
  // Como en esta aplicacion todo (editar, crear) se maneja en modales (misma URL), 
  // el match exacto es perfectamente seguro y funcional.
  
  for (const menuUrl of flatAllowedMenus) {
     if (url === menuUrl) return true;
  }

  return false;
}
