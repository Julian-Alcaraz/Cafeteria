import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { LayoutComponent } from './features/app-shell/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NoAccessComponent } from './features/app-shell/no-access/no-access.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [permissionGuard],
    children: [
      {
        path: 'no-access',
        component: NoAccessComponent
      },
      {
        path: 'configuraciones',
        loadChildren: () => import('./features/configuraciones/configuraciones.routes').then(m => m.CONFIG_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
