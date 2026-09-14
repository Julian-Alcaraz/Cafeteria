import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuditIgnoreRule } from '../auditoria-config.service';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-auditoria-config-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-modal [title]="rule() ? 'Editar Regla de Auditoría' : 'Nueva Regla de Auditoría'">
        
        <div class="form-group">
          <label>Ruta a Ignorar (Pattern)</label>
          <input type="text" formControlName="routePattern" placeholder="Ej: /api/auth/login o /api/logs/*">
          <small class="text-muted" style="display: block; margin-top: 0.25rem;">
            Se puede usar * al final para ignorar todas las sub-rutas.
          </small>
        </div>
        
        <div class="form-group checkbox-wrapper">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="isActive">
            <span style="margin-left: 0.5rem; font-weight: normal;">Regla Activa</span>
          </label>
        </div>

        <ng-container modal-actions>
          <button type="button" class="btn" (click)="cancel.emit()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar</button>
        </ng-container>

      </app-modal>
    </form>
  `,
  styleUrls: ['../../menus/menus.component.css'],
  styles: [`
    .checkbox-wrapper {
      margin-top: 1.5rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] {
      width: 1.2rem;
      height: 1.2rem;
      margin: 0;
      cursor: pointer;
    }
  `]
})
export class AuditoriaConfigFormComponent {
  rule = input<AuditIgnoreRule | null>(null);
  
  save = output<Partial<AuditIgnoreRule>>();
  cancel = output<void>();

  private fb = inject(FormBuilder);
  form = this.fb.group({
    routePattern: ['', Validators.required],
    isActive: [true]
  });

  constructor() {
    effect(() => {
      const r = this.rule();
      if (r) {
        this.form.patchValue({
          routePattern: r.routePattern,
          isActive: r.isActive
        });
      } else {
        this.form.reset({ isActive: true });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value as Partial<AuditIgnoreRule>);
    }
  }
}
