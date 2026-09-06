import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);

  protected readonly loginModel = signal({
    username: '',
    password: ''
  });

  protected readonly loginForm = form(this.loginModel, (s) => {
    required(s.username, { message: 'El usuario es requerido' });
    required(s.password, { message: 'La contraseña es requerida' });
  });

  errorMsg = signal('');
  loading = signal(false);

  onSubmit() {
    submit(this.loginForm, async () => {
      this.loading.set(true);
      this.errorMsg.set('');
      const { username, password } = this.loginModel();

      this.authService.login(username, password).subscribe({
        next: () => {
          // Redirección manejada en el servicio
        },
        error: (err: any) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.message || 'Error al iniciar sesión');
        }
      });
    });
  }
}
