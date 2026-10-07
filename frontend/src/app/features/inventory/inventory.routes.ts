import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  {
    path: 'stock',
    loadComponent: () => import('./components/stock/stock.component').then(m => m.StockComponent)
  },
  {
    path: 'compras',
    loadComponent: () => import('../purchasing/components/orders/orders.component').then(m => m.PurchaseOrdersComponent)
  },
  {
    path: 'proveedores',
    loadComponent: () => import('../purchasing/components/suppliers/suppliers.component').then(m => m.SuppliersComponent)
  },
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full'
  }
];
