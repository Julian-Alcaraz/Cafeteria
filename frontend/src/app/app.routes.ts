import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './features/app-shell/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  // { path: '', redirectTo: 'app/configuraciones/usuarios', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'configuraciones',
        loadChildren: () => import('./features/configuraciones/configuraciones.routes').then(m => m.CONFIG_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
