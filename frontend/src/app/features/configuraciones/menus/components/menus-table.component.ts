import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menus-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Etiqueta</th>
            <th>URL</th>
            <th>Ícono</th>
            <th>Padre</th>
            <th>Permiso Req.</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (menu of menus(); track menu.id) {
            <tr>
              <td>{{ menu.id }}</td>
              <td>{{ menu.label }}</td>
              <td>{{ menu.url }}</td>
              <td>{{ menu.icon }}</td>
              <td>{{ menu.parent?.label || '-' }}</td>
              <td>{{ menu.requiredPermission?.name || '-' }}</td>
              <td>
                <button class="btn btn-sm" (click)="edit.emit(menu)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="delete.emit(menu.id)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['../menus.component.css']
})
export class MenusTableComponent {
  menus = input.required<any[]>();
  
  edit = output<any>();
  delete = output<number>();
}
