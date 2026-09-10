import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../usuarios.service';

@Component({
  selector: 'app-usuarios-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (user of usuarios(); track user.id) {
            <tr>
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>
                <button class="btn btn-sm" (click)="edit.emit(user)">Editar</button>
                <button class="btn btn-sm" (click)="managePermissions.emit(user)">Menús / Permisos</button>
                <button class="btn btn-danger btn-sm" (click)="delete.emit(user.id)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['../usuarios.component.css']
})
export class UsuariosTableComponent {
  usuarios = input.required<User[]>();
  
  edit = output<User>();
  managePermissions = output<User>();
  delete = output<number>();
}
