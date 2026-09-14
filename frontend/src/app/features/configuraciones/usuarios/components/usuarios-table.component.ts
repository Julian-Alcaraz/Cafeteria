import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../usuarios.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';

@Component({
  selector: 'app-usuarios-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <app-generic-table [data]="usuarios()" [columns]="columns">
      <ng-template let-user>
        <button class="btn btn-sm mr-2" (click)="edit.emit(user)">Editar</button>
        <button class="btn btn-sm mr-2" (click)="managePermissions.emit(user)">Menús / Permisos</button>
        <button class="btn btn-danger btn-sm" (click)="delete.emit(user.id)">Eliminar</button>
      </ng-template>
    </app-generic-table>
  `,
  styleUrls: ['../usuarios.component.css']
})
export class UsuariosTableComponent {
  usuarios = input.required<User[]>();
  
  edit = output<User>();
  managePermissions = output<User>();
  delete = output<number>();

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'username', header: 'Usuario', sortable: true },
    { field: 'nombre', header: 'Nombre Completo', sortable: true, valueGetter: (u: any) => `${u.nombre} ${u.apellido}` },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'telefono', header: 'Teléfono', sortable: true }
  ];
}
