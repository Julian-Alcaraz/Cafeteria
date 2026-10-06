import { Routes } from '@angular/router';

export const CATALOGO_ROUTES: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: 'categorias',
    loadComponent: () => import('./categorias/categorias.component').then(m => m.CategoriasComponent)
  },
  {
    path: 'variedades-cafe',
    loadComponent: () => import('./variedades-cafe/variedades-cafe.component').then(m => m.VariedadesCafeComponent)
  },
];
