import { Routes } from '@angular/router';

export const RECETAS_ROUTES: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  {
    path: 'lista',
    loadComponent: () => import('./recetas-list/recetas-list.component').then(m => m.RecetasListComponent)
  },
  {
    path: 'nueva',
    loadComponent: () => import('./receta-form/receta-form.component').then(m => m.RecetaFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./receta-form/receta-form.component').then(m => m.RecetaFormComponent)
  },
];
