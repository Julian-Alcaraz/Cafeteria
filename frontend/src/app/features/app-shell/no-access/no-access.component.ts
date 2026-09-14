import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="no-access-container">
      <div class="no-access-card">
        <div class="icon-wrapper">
          <i class="pi pi-lock"></i>
        </div>
        <h2>Acceso Denegado</h2>
        <p>No tienes los permisos necesarios para acceder a esta sección o la página solicitada no está disponible para tu rol.</p>
        <a routerLink="/app" class="btn btn-primary mt-4">
          <i class="pi pi-home" style="margin-right: 0.5rem;"></i>
          Volver al Inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    .no-access-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }
    .no-access-card {
      background: white;
      padding: 3rem 2rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      text-align: center;
      max-width: 450px;
      width: 100%;
      border-top: 4px solid #dc3545;
    }
    .icon-wrapper {
      width: 80px;
      height: 80px;
      background-color: #fee2e2;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 1.5rem auto;
    }
    .icon-wrapper i {
      font-size: 2.5rem;
      color: #dc3545;
    }
    h2 {
      color: #111827;
      margin-top: 0;
      margin-bottom: 1rem;
      font-weight: 600;
      font-size: 1.75rem;
    }
    p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background-color: #a78b71;
      color: white;
      border: none;
    }
    .btn-primary:hover {
      background-color: #8c735d;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(167, 139, 113, 0.25);
    }
  `]
})
export class NoAccessComponent {}
