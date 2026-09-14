import { Component, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-permiso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal [title]="permiso() ? 'Editar Permiso' : 'Nuevo Permiso'" (close)="cancel.emit()">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        
        <div class="form-group mb-3">
          <label>Nombre del Permiso</label>
          <input type="text" class="form-control" formControlName="name" placeholder="Ej: user.create">
          @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <small class="text-danger">El nombre es requerido.</small>
          }
        </div>

        <div class="form-group mb-3">
          <label>Descripción</label>
          <textarea class="form-control" formControlName="description" rows="3" placeholder="Ej: Permite crear nuevos usuarios en el sistema"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary mr-2" (click)="cancel.emit()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .text-danger { color: #dc3545; }
  `]
})
export class PermisoFormComponent implements OnInit {
  permiso = input<any>(null);
  
  save = output<any>();
  cancel = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    const p = this.permiso();
    if (p) {
      this.form.patchValue({
        name: p.name,
        description: p.description
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
