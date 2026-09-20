import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusService } from './menus.service';
import { PermisosService, Permission } from '@features/configuraciones/permisos/permisos.service';

import { ToastService } from '@shared/components/toast/toast.service';

import { MenusTableComponent } from './components/menus-table.component';
import { MenuFormComponent } from './components/menu-form.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule, MenusTableComponent, MenuFormComponent, ConfirmModalComponent],
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {
  private menusService = inject(MenusService);
  private permisosService = inject(PermisosService);
  private toastService = inject(ToastService);

  menus = signal<any[]>([]);
  parentMenus = signal<any[]>([]);
  permisos = signal<Permission[]>([]);

  showForm = signal(false);
  editingMenu = signal<any | null>(null);
  duplicatingMenu = signal<any | null>(null);
  menuToDelete = signal<number | null>(null);

  ngOnInit() {
    this.loadMenus();
    this.loadPermisos();
  }

  loadMenus() {
    this.menusService.getMenus().subscribe(res => {
      this.menus.set(res);
      this.parentMenus.set(res); // Todos pueden ser padres potencialmente
    });
  }

  loadPermisos() {
    this.permisosService.getPermisos().subscribe(res => this.permisos.set(res));
  }

  openForm(menu?: any) {
    this.editingMenu.set(menu || null);
    this.duplicatingMenu.set(null);
    this.showForm.set(true);
  }

  duplicateMenu(menu: any) {
    this.editingMenu.set(null);
    this.duplicatingMenu.set(menu);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingMenu.set(null);
    this.duplicatingMenu.set(null);
    this.menuToDelete.set(null);
  }

  saveMenu(formData: any) {
    const data: any = {
      label: formData.label,
      url: formData.url || null,
      icon: formData.icon || null,
      parent_id: formData.parent_id || null,
      permission_id: formData.permission_id || null
    };

    const menu = this.editingMenu();
    if (menu) {
      this.menusService.updateMenu(menu.id, data).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Menú actualizado' });
          this.loadMenus();
          this.closeForm();
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error' })
      });
    } else {
      this.menusService.createMenu(data).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Menú creado' });
          this.loadMenus();
          this.closeForm();
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error' })
      });
    }
  }

  deleteMenu(id: number) {
    this.menuToDelete.set(id);
  }

  confirmDeleteMenu() {
    const id = this.menuToDelete();
    if (id !== null) {
      this.menusService.deleteMenu(id).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Menú eliminado' });
          this.loadMenus();
          this.menuToDelete.set(null);
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el menú' })
      });
    }
  }
}

