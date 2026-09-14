import { Routes } from '@angular/router';

export const CONFIG_ROUTES: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  { path: 'usuarios', loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent) },
  { path: 'menus', loadComponent: () => import('./menus/menus.component').then(m => m.MenusComponent) },
  { path: 'permisos', loadComponent: () => import('./permisos/permisos.component').then(m => m.PermisosComponent) },
  { path: 'auditoria', loadComponent: () => import('../auditoria/auditoria.component').then(m => m.AuditoriaComponent) },
  { path: 'auditoria-config', loadComponent: () => import('./auditoria-config/auditoria-config.component').then(m => m.AuditoriaConfigComponent) }
];
