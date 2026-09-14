import { Component, input, output, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../usuarios.service';
import { Menu } from '@features/configuraciones/menus/menus.service';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-usuario-permisos',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [title]="'Asignar Menús (' + user()?.username + ')'">
      <p>Selecciona los menús a los que este usuario tendrá acceso:</p>
      
      <div class="menu-list">
        <ng-template #menuNode let-node="node" let-level="level">
          <div class="menu-item" [style.marginLeft.px]="level * 24" [style.marginBottom.px]="level === 0 ? 8 : 4">
            <input type="checkbox" 
                   [id]="'menu-'+node.id" 
                   [checked]="selectedIds.has(node.requiredPermission!.id)"
                   (change)="toggleMenu(node, $event)">
            <label [for]="'menu-'+node.id" [style.fontWeight]="level === 0 && node._children.length > 0 ? '600' : 'normal'">
              {{ node.label }}
            </label>
          </div>
          @for (child of node._children; track child.id) {
            <ng-container *ngTemplateOutlet="menuNode; context: { node: child, level: level + 1 }"></ng-container>
          }
        </ng-template>

        @for (root of menuHierarchy(); track root.id) {
          <ng-container *ngTemplateOutlet="menuNode; context: { node: root, level: 0 }"></ng-container>
        }
      </div>

      <ng-container modal-actions>
        <button type="button" class="btn" (click)="cancel.emit()" [disabled]="isSaving()">Cerrar</button>
        <button type="button" class="btn btn-primary" (click)="onSave()" [disabled]="isSaving()">
          @if (isSaving()) {
            <i class="pi pi-spinner pi-spin"></i> Cargando...
          } @else {
            Guardar Permisos
          }
        </button>
      </ng-container>
    </app-modal>
  `,
  styleUrls: ['../usuarios.component.css']
})
export class UsuarioPermisosComponent {
  user = input.required<User>();
  menus = input.required<Menu[]>(); // Solo los que tienen requiredPermission
  isSaving = input<boolean>(false);

  save = output<number[]>();
  cancel = output<void>();

  selectedIds = new Set<number>();

  menuHierarchy = computed(() => {
    const allMenus = this.menus();
    const menuMap = new Map<number, any>();
    allMenus.forEach(m => menuMap.set(m.id, { ...m, _children: [] }));
    
    const roots: any[] = [];
    
    menuMap.forEach(m => {
      if (m.parent_id && menuMap.has(m.parent_id)) {
        menuMap.get(m.parent_id)._children.push(m);
      } else {
        roots.push(m);
      }
    });
    
    return roots;
  });

  constructor() {
    effect(() => {
      const u = this.user();
      this.selectedIds.clear();
      if (u?.permissions) {
        u.permissions.forEach((p: any) => this.selectedIds.add(p.id));
      }
    });
  }

  toggleMenu(node: any, event: any) {
    const checked = event.target.checked;
    this.setMenuSelection(node, checked);
  }

  setMenuSelection(node: any, checked: boolean) {
    if (node.requiredPermission) {
      if (checked) {
        this.selectedIds.add(node.requiredPermission.id);
      } else {
        this.selectedIds.delete(node.requiredPermission.id);
      }
    }
    
    if (node._children && node._children.length > 0) {
      node._children.forEach((child: any) => {
        this.setMenuSelection(child, checked);
      });
    }
  }

  onSave() {
    this.save.emit(Array.from(this.selectedIds));
  }
}
