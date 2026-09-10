import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Permission } from '../../permisos/permisos.service';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-modal [title]="menu() ? 'Editar Menú' : 'Nuevo Menú'">
        
        <div class="form-group">
          <label>Nombre del Menú</label>
          <input type="text" formControlName="label">
        </div>
        
        <div class="form-group">
          <label>URL (opcional)</label>
          <input type="text" formControlName="url">
        </div>

        <div class="form-group">
          <label>Menú Padre (opcional)</label>
          <select formControlName="parent_id">
            <option [ngValue]="null">-- Ninguno (Menú Principal) --</option>
            @for (p of parentMenus(); track p.id) {
              <option [ngValue]="p.id">{{ p.label }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label>Permiso Requerido</label>
          <select formControlName="permission_id">
            <option [ngValue]="null">-- Seleccionar --</option>
            @for (perm of permisos(); track perm.id) {
              <option [ngValue]="perm.id">{{ perm.name }}</option>
            }
          </select>
        </div>

        <ng-container modal-actions>
          <button type="button" class="btn" (click)="cancel.emit()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar</button>
        </ng-container>

      </app-modal>
    </form>
  `,
  styleUrls: ['../menus.component.css']
})
export class MenuFormComponent {
  menu = input<any | null>(null);
  parentMenus = input.required<any[]>();
  permisos = input.required<Permission[]>();
  
  save = output<any>();
  cancel = output<void>();

  private fb = inject(FormBuilder);
  form = this.fb.group({
    label: ['', Validators.required],
    url: [''],
    icon: [''],
    parent_id: [null],
    permission_id: [null]
  });

  constructor() {
    effect(() => {
      const m = this.menu();
      if (m) {
        this.form.patchValue({
          label: m.label,
          url: m.url,
          icon: m.icon,
          parent_id: m.parent?.id || null,
          permission_id: m.requiredPermission?.id || null
        });
      } else {
        this.form.reset({
          parent_id: null,
          permission_id: null
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
