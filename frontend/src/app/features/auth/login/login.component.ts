import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMsg = signal('');
  loading = signal(false);

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMsg.set('');
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: () => {
        // Redirección manejada en el servicio
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Error al iniciar sesión');
      }
    });
  }
}
