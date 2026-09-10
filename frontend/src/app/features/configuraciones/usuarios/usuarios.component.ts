import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService, User } from './usuarios.service';
import { MenusService, Menu } from '../menus/menus.service';

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

  usuarios = signal<User[]>([]);
  availableMenus = signal<Menu[]>([]);

  showForm = signal(false);
  showPermissionsForm = signal(false);
  editingUser = signal<User | null>(null);
  selectedUser = signal<User | null>(null);
  userToDelete = signal<number | null>(null);

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
    const data: any = { username: formData.username };
    if (formData.password) data.password_hash = formData.password;

    const user = this.editingUser();
    if (user) {
      this.usuariosService.updateUsuario(user.id, data).subscribe(() => {
        this.loadUsuarios();
        this.closeModals();
      });
    } else {
      this.usuariosService.createUsuario(data).subscribe(() => {
        this.loadUsuarios();
        this.closeModals();
      });
    }
  }

  deleteUser(id: number) {
    this.userToDelete.set(id);
  }

  confirmDeleteUser() {
    const id = this.userToDelete();
    if (id !== null) {
      this.usuariosService.deleteUsuario(id).subscribe(() => {
        this.loadUsuarios();
        this.userToDelete.set(null);
      });
    }
  }

  savePermissions(permissionIds: number[]) {
    const user = this.selectedUser();
    if (!user) return;
    
    this.usuariosService.updateUsuario(user.id, { permissionIds }).subscribe(() => {
      this.loadUsuarios();
      this.closeModals();
    });
  }
}

