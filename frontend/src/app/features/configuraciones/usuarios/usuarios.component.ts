import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService, User } from './usuarios.service';
import { MenusService, Menu } from '../menus/menus.service';
import { MessageService } from 'primeng/api';

import { UsuariosTableComponent } from './components/usuarios-table.component';
import { UsuarioFormComponent } from './components/usuario-form.component';
import { UsuarioPermisosComponent } from './components/usuario-permisos.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, UsuariosTableComponent, UsuarioFormComponent, UsuarioPermisosComponent, ConfirmModalComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private menusService = inject(MenusService);
  private messageService = inject(MessageService);

  usuarios = signal<User[]>([]);
  availableMenus = signal<Menu[]>([]);

  showForm = signal(false);
  showPermissionsForm = signal(false);
  editingUser = signal<User | null>(null);
  selectedUser = signal<User | null>(null);
  userToDelete = signal<number | null>(null);

  isSaving = signal(false);

  ngOnInit() {
    this.loadUsuarios();
    this.loadMenus();
  }

  loadUsuarios() {
    this.usuariosService.getUsuarios().subscribe(res => this.usuarios.set(res));
  }

  loadMenus() {
    this.menusService.getMenus().subscribe(res => {
      this.availableMenus.set(res.filter(m => m.requiredPermission));
    });
  }

  openForm(user?: User) {
    this.editingUser.set(user || null);
    this.showForm.set(true);
  }

  openPermissions(user: User) {
    this.selectedUser.set(user);
    this.showPermissionsForm.set(true);
  }

  closeModals() {
    this.showForm.set(false);
    this.showPermissionsForm.set(false);
    this.editingUser.set(null);
    this.selectedUser.set(null);
    this.userToDelete.set(null);
  }

  saveUser(formData: any) {
    const data: any = { 
      username: formData.username,
      email: formData.email || null,
      telefono: formData.telefono || null,
      nombre: formData.nombre || null,
      apellido: formData.apellido || null
    };
    if (formData.password) data.password_hash = formData.password;

    const user = this.editingUser();
    this.isSaving.set(true);

    const request$ = user 
      ? this.usuariosService.updateUsuario(user.id, data) 
      : this.usuariosService.createUsuario(data);

    request$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: user ? 'Usuario actualizado' : 'Usuario creado' });
        this.loadUsuarios();
        this.closeModals();
        this.isSaving.set(false);
        
        setTimeout(() => {
          const toast = document.querySelector('p-toast');
          if (toast) {
            console.log("TOAST DOM:", toast.outerHTML);
          }
        }, 500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el usuario' });
        this.isSaving.set(false);
      }
    });
  }

  deleteUser(id: number) {
    this.userToDelete.set(id);
  }

  confirmDeleteUser() {
    const id = this.userToDelete();
    if (id !== null) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado' });
          this.loadUsuarios();
          this.userToDelete.set(null);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
        }
      });
    }
  }

  savePermissions(permissionIds: number[]) {
    const user = this.selectedUser();
    if (!user) return;
    
    this.isSaving.set(true);
    this.usuariosService.updateUsuario(user.id, { permissionIds }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Permisos actualizados' });
        this.loadUsuarios();
        this.closeModals();
        this.isSaving.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar permisos' });
        this.isSaving.set(false);
      }
    });
  }
}

