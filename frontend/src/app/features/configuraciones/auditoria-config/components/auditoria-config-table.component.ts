import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { AuditIgnoreRule } from '../auditoria-config.service';

@Component({
  selector: 'app-auditoria-config-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <app-generic-table [data]="rules()" [columns]="columns">
      <ng-template let-row>
        <button class="btn btn-sm mr-2" style="margin-right: 0.5rem;" (click)="edit.emit(row)">Editar</button>
        <button class="btn btn-danger btn-sm" (click)="delete.emit(row.id)">Eliminar</button>
      </ng-template>
    </app-generic-table>
  `,
  styleUrls: ['../../menus/menus.component.css']
})
export class AuditoriaConfigTableComponent {
  rules = input.required<AuditIgnoreRule[]>();
  
  edit = output<AuditIgnoreRule>();
  delete = output<number>();

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'routePattern', header: 'Ruta Ignorada', sortable: true },
    { 
      field: 'isActive', 
      header: 'Activa', 
      sortable: true,
      valueGetter: (row: AuditIgnoreRule) => row.isActive ? 'Sí' : 'No'
    }
  ];
}
