import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../usuarios.service';
import { Menu } from '../../menus/menus.service';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-usuario-permisos',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [title]="'Asignar Menús (' + user()?.username + ')'">
      <p>Selecciona los menús a los que este usuario tendrá acceso:</p>
      
      <div class="menu-list">
        @for (menu of menus(); track menu.id) {
          <div class="menu-item">
            <input type="checkbox" 
                   [id]="'menu-'+menu.id" 
                   [checked]="selectedIds.has(menu.requiredPermission!.id)"
                   (change)="toggleMenu(menu, $event)">
            <label [for]="'menu-'+menu.id">{{ menu.label }}</label>
          </div>
        }
      </div>

      <ng-container modal-actions>
        <button type="button" class="btn" (click)="cancel.emit()">Cerrar</button>
        <button type="button" class="btn btn-primary" (click)="onSave()">Guardar Permisos</button>
      </ng-container>
    </app-modal>
  `,
  styleUrls: ['../usuarios.component.css']
})
export class UsuarioPermisosComponent {
  user = input.required<User>();
  menus = input.required<Menu[]>(); // Solo los que tienen requiredPermission

  save = output<number[]>();
  cancel = output<void>();

  selectedIds = new Set<number>();

  constructor() {
    effect(() => {
      const u = this.user();
      this.selectedIds.clear();
      if (u?.permissions) {
        u.permissions.forEach((p: any) => this.selectedIds.add(p.id));
      }
    });
  }

  toggleMenu(menu: Menu, event: any) {
    if (!menu.requiredPermission) return;
    if (event.target.checked) {
      this.selectedIds.add(menu.requiredPermission.id);
    } else {
      this.selectedIds.delete(menu.requiredPermission.id);
    }
  }

  onSave() {
    this.save.emit(Array.from(this.selectedIds));
  }
}
