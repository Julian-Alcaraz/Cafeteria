import { Component, input, output, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../usuarios.service';
import { ModalComponent } from '@shared/components/modal.component';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-modal [title]="user() ? 'Editar Usuario' : 'Nuevo Usuario'">
        
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <input type="text" formControlName="username">
        </div>
        
        <div class="form-group">
          <label>Contraseña</label>
          <div class="input-with-icon">
            <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" [placeholder]="user() ? 'Dejar en blanco para no cambiar' : ''">
            <button type="button" class="icon-btn" (click)="togglePassword()">
              @if (showPassword()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              }
            </button>
          </div>
        </div>

        @if (!user()) {
          <div class="form-group">
            <label>Repetir Contraseña</label>
            <div class="input-with-icon">
              <input [type]="showConfirmPassword() ? 'text' : 'password'" formControlName="confirmPassword">
              <button type="button" class="icon-btn" (click)="toggleConfirmPassword()">
                @if (showConfirmPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                }
              </button>
            </div>
            @if (form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.touched) {
              <span class="error-text">Las contraseñas no coinciden</span>
            }
          </div>
        }

        <ng-container modal-actions>
          <button type="button" class="btn" (click)="cancel.emit()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar</button>
        </ng-container>

      </app-modal>
    </form>
  `,
  styleUrls: ['../usuarios.component.css']
})
export class UsuarioFormComponent {
  user = input<User | null>(null);
  
  save = output<any>();
  cancel = output<void>();

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  private fb = inject(FormBuilder);
  form = this.fb.group({
    username: ['', Validators.required],
    password: [''],
    confirmPassword: ['']
  }, { validators: passwordMatchValidator });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.form.patchValue({ username: u.username, password: '', confirmPassword: '' });
        this.form.get('password')?.clearValidators();
        this.form.get('confirmPassword')?.clearValidators();
      } else {
        this.form.reset();
        this.form.get('password')?.setValidators([Validators.required]);
        this.form.get('confirmPassword')?.setValidators([Validators.required]);
      }
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}

