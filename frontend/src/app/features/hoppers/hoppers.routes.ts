import { Routes } from '@angular/router';

export const HOPPERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hoppers.component').then(m => m.HoppersComponent)
  }
];
