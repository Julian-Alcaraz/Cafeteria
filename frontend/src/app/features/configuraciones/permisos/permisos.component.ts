import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosService, Permission } from './permisos.service';
import { PermisosTableComponent } from './components/permisos-table.component';
import { PermisoFormComponent } from './components/permiso-form.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, PermisosTableComponent, PermisoFormComponent, ConfirmModalComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h2>Gestión de Permisos</h2>
        <button class="btn btn-primary" (click)="openForm()">Nuevo Permiso</button>
      </div>

      <app-permisos-table
        [permisos]="permisos()"
        (edit)="openForm($event)"
        (delete)="deletePermiso($event)"
      ></app-permisos-table>

      @if (showForm()) {
        <app-permiso-form
          [permiso]="editingPermiso()"
          (save)="savePermiso($event)"
          (cancel)="closeForm()"
        ></app-permiso-form>
      }

      @if (permisoToDelete() !== null) {
        <app-confirm-modal
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este permiso? Esta acción no se puede deshacer y podría afectar a los usuarios y menús que lo tengan asignado."
          confirmText="Eliminar"
          cancelText="Cancelar"
          btnType="danger"
          (confirm)="confirmDeletePermiso()"
          (cancel)="permisoToDelete.set(null)"
        ></app-confirm-modal>
      }
    </div>
  `,
  styles: [`
    .container { padding: 2rem; background-color: var(--bg-surface, #ffffff); border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h2 { color: var(--text-title, #111827); margin: 0; }
  `]
})
export class PermisosComponent implements OnInit {
  private permisosService = inject(PermisosService);
  private toastService = inject(ToastService);

  permisos = signal<Permission[]>([]);
  showForm = signal(false);
  editingPermiso = signal<Permission | null>(null);
  permisoToDelete = signal<number | null>(null);

  ngOnInit() {
    this.loadPermisos();
  }

  loadPermisos() {
    this.permisosService.getPermisos().subscribe(res => this.permisos.set(res));
  }

  openForm(permiso?: Permission) {
    this.editingPermiso.set(permiso || null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingPermiso.set(null);
    this.permisoToDelete.set(null);
  }

  savePermiso(formData: any) {
    const p = this.editingPermiso();
    if (p) {
      this.permisosService.updatePermiso(p.id, formData).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Permiso actualizado' });
          this.loadPermisos();
          this.closeForm();
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error' })
      });
    } else {
      this.permisosService.createPermiso(formData).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Permiso creado' });
          this.loadPermisos();
          this.closeForm();
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error' })
      });
    }
  }

  deletePermiso(id: number) {
    this.permisoToDelete.set(id);
  }

  confirmDeletePermiso() {
    const id = this.permisoToDelete();
    if (id !== null) {
      this.permisosService.deletePermiso(id).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Permiso eliminado' });
          this.loadPermisos();
          this.permisoToDelete.set(null);
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el permiso' })
      });
    }
  }
}
