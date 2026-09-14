import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';

@Component({
  selector: 'app-menus-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <app-generic-table [data]="menus()" [columns]="columns">
      <ng-template let-menu>
        <button class="btn btn-sm mr-2" (click)="edit.emit(menu)">Editar</button>
        <button class="btn btn-danger btn-sm" (click)="delete.emit(menu.id)">Eliminar</button>
      </ng-template>
    </app-generic-table>
  `,
  styleUrls: ['../menus.component.css']
})
export class MenusTableComponent {
  menus = input.required<any[]>();
  
  edit = output<any>();
  delete = output<number>();

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'label', header: 'Etiqueta', sortable: true },
    { field: 'url', header: 'URL', sortable: true },
    { field: 'icon', header: 'Ícono', sortable: true },
    { field: 'parent', header: 'Padre', sortable: true, valueGetter: (m) => m.parent?.label || '-' },
    { field: 'permission', header: 'Permiso Req.', sortable: true, valueGetter: (m) => m.requiredPermission?.name || '-' }
  ];
}
