import { Component, input, computed, signal, ContentChild, TemplateRef, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  // Optional function to format or resolve nested values (e.g. row.parent?.label)
  valueGetter?: (row: any) => any;
}

@Directive({
  selector: '[tableActions]',
  standalone: true
})
export class TableActionsDirective {}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (searchable()) {
      <div class="mb-3" style="display: flex; justify-content: flex-end;">
        <input type="text" class="form-control" style="max-width: 300px; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;" placeholder="Buscar..." (input)="onSearch($event)">
      </div>
    }
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            @for (col of columns(); track col.field) {
              <th (click)="col.sortable ? sort(col.field) : null" 
                  [style.cursor]="col.sortable ? 'pointer' : 'default'">
                {{ col.header }}
                @if (col.sortable) { <span>{{ getSortIcon(col.field) }}</span> }
              </th>
            }
            @if (actionsTemplate) { <th>Acciones</th> }
          </tr>
        </thead>
        <tbody>
          @for (row of filteredAndSortedData(); track row.id) {
            <tr>
              @for (col of columns(); track col.field) {
                <td>
                  {{ col.valueGetter ? col.valueGetter(row) : row[col.field] }}
                </td>
              }
              @if (actionsTemplate) {
                <td>
                  <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: row }"></ng-container>
                </td>
              }
            </tr>
          }
          @if (filteredAndSortedData().length === 0) {
            <tr>
              <td [attr.colspan]="columns().length + (actionsTemplate ? 1 : 0)" style="text-align: center;">
                No se encontraron resultados
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border-subtle, #e5e7eb); }
    th { font-weight: 600; color: var(--text-title, #111827); background-color: rgba(0,0,0,0.02); }
  `]
})
export class GenericTableComponent {
  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  searchable = input<boolean>(true);

  @ContentChild(TemplateRef) actionsTemplate!: TemplateRef<any>;

  searchTerm = signal('');
  sortState = signal<{column: string, direction: 'asc'|'desc'|null}>({column: '', direction: null});

  filteredAndSortedData = computed(() => {
    let result = [...this.data()];
    
    // Filtro
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(row => {
        return this.columns().some(col => {
          const val = col.valueGetter ? col.valueGetter(row) : row[col.field];
          return val?.toString().toLowerCase().includes(term);
        });
      });
    }

    // Ordenamiento
    const state = this.sortState();
    if (state.direction) {
      const colDef = this.columns().find(c => c.field === state.column);
      result.sort((a, b) => {
        let valA = colDef?.valueGetter ? colDef.valueGetter(a) : a[state.column];
        let valB = colDef?.valueGetter ? colDef.valueGetter(b) : b[state.column];

        // Handle null/undefined
        valA = valA ?? '';
        valB = valB ?? '';

        if (valA < valB) return state.direction === 'asc' ? -1 : 1;
        if (valA > valB) return state.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  onSearch(event: any) {
    this.searchTerm.set(event.target.value);
  }

  sort(column: string) {
    const current = this.sortState();
    if (current.column === column) {
      if (current.direction === 'asc') this.sortState.set({ column, direction: 'desc' });
      else if (current.direction === 'desc') this.sortState.set({ column, direction: null });
      else this.sortState.set({ column, direction: 'asc' });
    } else {
      this.sortState.set({ column, direction: 'asc' });
    }
  }

  getSortIcon(column: string) {
    const state = this.sortState();
    if (state.column !== column || !state.direction) return '↕';
    return state.direction === 'asc' ? '↑' : '↓';
  }
}
