import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PosAccount } from '../../pos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, ToastModule, DatePipe],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="header-actions" style="margin-bottom: 1.5rem;">
        <div>
          <h2>Historial de Ventas</h2>
          <p style="color: var(--text-muted, #6b7280); margin-top: 0.5rem; font-size: 0.95rem;">Visualizá el detalle de todas las cuentas cerradas.</p>
        </div>
      </div>

      <div class="table-responsive" style="border: 1px solid var(--border-subtle, #e5e7eb); border-radius: 8px; overflow: hidden; background: white;">
        <table>
          <thead>
            <tr>
              <th style="width: 3rem; text-align: center;"></th>
              <th>ID / Ref</th>
              <th>Creado Por</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Método Pago</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            @if (isLoading()) {
              <tr>
                <td colspan="7" class="text-center py-4" style="text-align: center;">
                  <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
                  <p class="mt-2 text-muted">Cargando historial...</p>
                </td>
              </tr>
            } @else if (sales().length === 0) {
              <tr>
                <td colspan="7" class="text-center py-4 text-muted" style="text-align: center;">No hay ventas registradas.</td>
              </tr>
            } @else {
              @for (sale of sales(); track sale.id) {
                <!-- Fila Principal -->
                <tr class="main-row" [class.expanded]="expandedRows.has(sale.id)">
                  <td style="text-align: center;">
                    <button class="btn-icon" (click)="toggleRow(sale.id)">
                      <i [class]="expandedRows.has(sale.id) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
                    </button>
                  </td>
                  <td><strong>#{{ sale.id }}</strong> <br> <small style="color: var(--text-muted, #6b7280);">{{ sale.customerName }}</small></td>
                  <td>{{ sale.user?.username || 'Sistema' }}</td>
                  <td>{{ sale.createdAt | date:'short' }}</td>
                  <td>{{ sale.updatedAt | date:'short' }}</td>
                  <td>
                    {{ sale.paymentMethodInfo || 'N/A' }} 
                    <br> 
                    @if (sale.tip > 0) {
                      <small style="color: var(--text-muted, #6b7280);">Propina: \${{ sale.tip | number:'1.2-2' }}</small>
                    }
                  </td>
                  <td><strong>\${{ sale.totalAmount | number:'1.2-2' }}</strong></td>
                </tr>

                <!-- Fila Expandida (Detalles) -->
                @if (expandedRows.has(sale.id)) {
                  <tr class="expanded-row">
                    <td colspan="7" style="padding: 0; border-bottom: 2px solid var(--border-subtle, #e5e7eb);">
                      <div class="detail-wrapper" style="padding: 1.5rem; background: #fafafa; border-left: 3px solid var(--color-primary); margin: 0 1rem 1rem 1rem; border-radius: 0 0 8px 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                        <h5 style="margin-bottom: 1rem; color: var(--color-primary); font-family: 'Inter', sans-serif;">Detalle de Ítems</h5>
                        @if (sale.items && sale.items.length > 0) {
                          <table class="inner-table" style="width: 100%; border-collapse: collapse; background: white; border: 1px solid var(--border-subtle); border-radius: 6px; overflow: hidden;">
                            <thead>
                              <tr style="background-color: rgba(0,0,0,0.02);">
                                <th>Producto</th>
                                <th style="text-align: center;">Cantidad</th>
                                <th style="text-align: right;">Precio Unit.</th>
                                <th style="text-align: right;">Subtotal</th>
                                <th style="text-align: center;">Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (item of sale.items; track item.id) {
                                <tr>
                                  <td><strong>{{ item.product?.name }}</strong></td>
                                  <td style="text-align: center;">{{ item.quantity | number:'1.0-2' }}</td>
                                  <td style="text-align: right;">\${{ item.price | number:'1.2-2' }}</td>
                                  <td style="text-align: right;">\${{ (item.price * item.quantity) | number:'1.2-2' }}</td>
                                  <td style="text-align: center;"><span class="badge" [ngClass]="item.status">{{ item.status }}</span></td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        } @else {
                          <p class="text-muted mb-0">No hay ítems en esta cuenta.</p>
                        }
                      </div>
                    </td>
                  </tr>
                }
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border-subtle, #e5e7eb); }
    th { font-weight: 600; color: var(--text-title, #111827); background-color: rgba(0,0,0,0.02); }
    
    .main-row { transition: background-color 0.2s; }
    .main-row:hover { background-color: rgba(0,0,0,0.02); }
    .main-row.expanded td { border-bottom: none; background-color: rgba(0,0,0,0.01); }
    
    .inner-table th, .inner-table td { padding: 0.75rem; border-bottom: 1px solid var(--border-subtle, #e5e7eb); }
    .inner-table th { background-color: rgba(0,0,0,0.02); border-bottom: 2px solid var(--border-subtle, #e5e7eb); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .inner-table td { font-size: 0.9rem; }
    
    .btn-icon { background: white; border: 1px solid var(--border-subtle); cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .btn-icon:hover { background-color: var(--color-primary); color: white; border-color: var(--color-primary); }
    
    .badge { padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.02em; }
    .badge.DELIVERED { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge.PENDING { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
    .text-muted { color: var(--text-muted, #6b7280); }
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
  `]
})
export class SalesHistoryComponent implements OnInit {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  sales = signal<PosAccount[]>([]);
  isLoading = signal<boolean>(false);
  
  // Guardamos los IDs de las filas expandidas
  expandedRows = new Set<number>();

  ngOnInit() {
    this.loadSales();
  }

  toggleRow(id: number) {
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
    } else {
      this.expandedRows.add(id);
    }
  }

  loadSales() {
    this.isLoading.set(true);
    this.http.get<any>(`${environment.apiUrl}/pos/sales`).subscribe({
      next: (res) => {
        this.sales.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las ventas' });
        this.isLoading.set(false);
      }
    });
  }
}
