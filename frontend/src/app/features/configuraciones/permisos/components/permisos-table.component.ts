import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Permission } from '../permisos.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';

@Component({
  selector: 'app-permisos-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <app-generic-table [data]="permisos()" [columns]="columns">
      <ng-template let-permiso>
        <button class="btn btn-sm mr-2" (click)="edit.emit(permiso)">Editar</button>
        <button class="btn btn-danger btn-sm" (click)="delete.emit(permiso.id)">Eliminar</button>
      </ng-template>
    </app-generic-table>
  `
})
export class PermisosTableComponent {
  permisos = input.required<Permission[]>();
  
  edit = output<Permission>();
  delete = output<number>();

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'description', header: 'Descripción', sortable: true }
  ];
}
