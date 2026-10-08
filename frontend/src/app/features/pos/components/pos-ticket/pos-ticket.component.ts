import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PosAccount, PosService } from '../../pos.service';
import { MessageService } from 'primeng/api';
import { ModalComponent } from '@shared/components/modal.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';

@Component({
  selector: 'app-pos-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ConfirmModalComponent],
  template: `
    <div class="ticket-card" *ngIf="account" [class.expanded]="isExpanded">
      <!-- HEADER COMPRIMIDO -->
      <div class="ticket-header" (click)="toggleExpand()">
        <div class="header-info">
          <h3>#{{ account.id }} {{ account.customerName !== 'Consumidor Final' ? ' - ' + account.customerName : '' }}</h3>
          <span class="status badge" [ngClass]="account.status">{{ account.status }}</span>
        </div>
        <div class="header-right">
          <span class="ticket-total" *ngIf="!isExpanded">\${{ account.totalAmount | number:'1.2-2' }}</span>
          <i class="pi" [ngClass]="isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
        </div>
      </div>

      <!-- CUERPO EXPANDIDO -->
      <div class="ticket-body" *ngIf="isExpanded">
        <div class="ticket-items">
          <div class="item-row" *ngFor="let item of account.items">
            <div class="item-info">
              <span class="qty">{{ item.quantity | number:'1.0-2' }}x</span>
              <span class="name">{{ item.product?.name || 'Producto ' + item.productId }}</span>
              <span class="status-dot" [title]="item.status" [ngClass]="item.status"></span>
            </div>
            <div class="item-price">
              \${{ (item.price * item.quantity) | number:'1.2-2' }}
            </div>
            <div class="item-actions" *ngIf="account.status === 'OPEN'">
              <button *ngIf="item.status === 'PENDING'" class="btn-icon" [disabled]="processingItemId === item.id || isLoading" (click)="deliverItem(item)" title="Entregar/Preparar">
                <i class="pi" [ngClass]="processingItemId === item.id ? 'pi-spinner pi-spin' : 'pi-check'"></i>
              </button>
              <button *ngIf="item.status === 'PENDING'" class="btn-icon danger" [disabled]="isLoading" (click)="removeItem(item)" title="Eliminar ítem">
                <i class="pi pi-trash"></i>
              </button>
              <button *ngIf="item.status === 'DELIVERED'" class="btn-icon warning" [disabled]="isLoading" (click)="remakeItem(item)" title="Rehacer (Merma)">
                <i class="pi pi-refresh"></i>
              </button>
            </div>
          </div>
          <div class="empty-ticket" *ngIf="!account.items || account.items.length === 0">
            Aún no hay ítems en esta cuenta.
          </div>
        </div>

        <div class="ticket-footer">
          <div class="total-row">
            <span>Total</span>
            <h2>\${{ account.totalAmount | number:'1.2-2' }}</h2>
          </div>
          <div class="footer-actions">
            <button class="btn btn-secondary btn-block btn-lg" 
                    *ngIf="hasPendingItems"
                    [disabled]="isLoading"
                    (click)="deliverAll()">
              <i class="pi" [ngClass]="isLoading ? 'pi-spinner pi-spin' : 'pi-check-circle'"></i> Entregar Todo
            </button>
            <button class="btn btn-primary btn-block btn-lg" 
                    [disabled]="account.status !== 'OPEN' || account.items.length === 0 || isLoading"
                    (click)="cobrar()">
              <i *ngIf="isLoading" class="pi pi-spinner pi-spin"></i> Cobrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <app-confirm-modal
      *ngIf="showRemakeConfirm" (cancel)="showRemakeConfirm = false"
      title="Rehacer Ítem"
      message="¿Seguro que deseas registrar una merma y rehacer este ítem? Se descontará stock nuevamente pero no se cobrará."
      (confirm)="confirmRemake()">
    </app-confirm-modal>

    <app-confirm-modal
      *ngIf="showDeleteConfirm" (cancel)="showDeleteConfirm = false"
      title="Eliminar Ítem"
      message="¿Estás seguro que deseas eliminar este ítem de la orden?"
      (confirm)="confirmDelete()">
    </app-confirm-modal>

    <app-modal *ngIf="showChargeModal" title="Cerrar Cuenta y Cobrar" (close)="showChargeModal = false">
      <div class="form-group">
        <label>Medio de Pago / Observaciones</label>
        <input type="text" class="form-control" [(ngModel)]="paymentMethod" placeholder="Efectivo, Tarjeta, etc.">
      </div>
      <div class="form-group">
        <label>Propina (Opcional)</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input type="number" class="form-control" [(ngModel)]="tipAmount" min="0" step="0.01">
        </div>
      </div>
      
      <ng-container modal-actions>
        <button type="button" class="btn btn-secondary" (click)="showChargeModal = false">Cancelar</button>
        <button type="button" class="btn btn-primary" (click)="confirmCobro()">Confirmar Pago</button>
      </ng-container>
    </app-modal>
  `,
  styles: [`
    .ticket-card {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: 12px;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      transition: all 0.2s;
    }
    .ticket-card.expanded {
      border: 2px solid var(--color-primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      cursor: pointer;
      background: #faf6f0;
      transition: background 0.2s;
    }
    .ticket-header:hover { background: #f0e9df; }
    .header-info { display: flex; align-items: center; gap: 1rem; }
    .ticket-header h3 { margin: 0; font-size: 1.1rem; color: var(--color-primary); }
    .header-right { display: flex; align-items: center; gap: 1rem; }
    .ticket-total { font-weight: bold; font-size: 1.1rem; color: var(--color-primary); }

    .ticket-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--color-border);
    }
    .ticket-items {
      max-height: 400px;
      overflow-y: auto;
    }
    .item-row {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--color-border);
    }
    .item-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .qty { font-weight: bold; color: var(--color-primary); }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-dot.PENDING { background: var(--color-warning); }
    .status-dot.DELIVERED { background: var(--color-success); }
    
    .item-price { font-weight: bold; margin-right: 1rem; }
    .item-actions { display: flex; gap: 0.25rem; }
    .btn-icon { background: none; border: none; cursor: pointer; color: var(--color-text-muted); font-size: 1.1rem; padding: 0.25rem; }
    .btn-icon:hover { color: var(--color-success); }
    .btn-icon.warning:hover { color: var(--color-warning); }
    .btn-icon.danger:hover { color: var(--color-danger); }

    .ticket-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px dashed var(--color-border);
    }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .total-row h2 { margin: 0; color: var(--color-primary); }
    .footer-actions { display: flex; gap: 0.5rem; }
    .btn-block { flex: 1; }
  `]
})
export class PosTicketComponent {
  @Input() account: PosAccount | null = null;
  @Input() isExpanded = false;
  @Output() accountChanged = new EventEmitter<void>();
  @Output() onExpand = new EventEmitter<void>();

  private posService = inject(PosService);
  private messageService = inject(MessageService);

  showRemakeConfirm = false;
  itemToRemake: any = null;

  showDeleteConfirm = false;
  itemToDelete: any = null;

  showChargeModal = false;
  paymentMethod = 'Efectivo';
  tipAmount = 0;

  isLoading = false;
  processingItemId: number | null = null;

  toggleExpand() {
    this.onExpand.emit();
  }

  removeItem(item: any) {
    this.itemToDelete = item;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.itemToDelete) return;
    this.isLoading = true;
    this.posService.removeItem(this.itemToDelete.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Ítem eliminado correctamente' });
        this.showDeleteConfirm = false;
        this.itemToDelete = null;
        this.isLoading = false;
        this.accountChanged.emit();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al eliminar' });
        this.showDeleteConfirm = false;
        this.isLoading = false;
      }
    });
  }

  get hasPendingItems(): boolean {
    return this.account?.items?.some(i => i.status === 'PENDING') || false;
  }

  deliverAll() {
    if (!this.account) return;
    const pendingItems = this.account.items.filter(i => i.status === 'PENDING');
    if (pendingItems.length === 0) return;

    this.isLoading = true;
    const requests = pendingItems.map(item => this.posService.deliverItem(item.id));
    
    forkJoin(requests).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Todos los ítems entregados y descontados' });
        this.isLoading = false;
        this.accountChanged.emit();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al entregar algunos ítems' });
        this.isLoading = false;
        this.accountChanged.emit();
      }
    });
  }

  deliverItem(item: any) {
    this.processingItemId = item.id;
    this.posService.deliverItem(item.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Entregado', detail: 'Stock descontado' });
        this.processingItemId = null;
        this.accountChanged.emit();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al entregar' });
        this.processingItemId = null;
      }
    });
  }

  remakeItem(item: any) {
    this.itemToRemake = item;
    this.showRemakeConfirm = true;
  }

  confirmRemake() {
    if (!this.itemToRemake) return;
    this.isLoading = true;
    this.posService.remakeItem(this.itemToRemake.id, 'Error de preparación').subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Rehecho', detail: 'Stock descontado como merma' });
        this.showRemakeConfirm = false;
        this.itemToRemake = null;
        this.isLoading = false;
        this.accountChanged.emit();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al rehacer' });
        this.showRemakeConfirm = false;
        this.isLoading = false;
      }
    });
  }

  cobrar() {
    this.paymentMethod = 'Efectivo';
    this.tipAmount = 0;
    this.showChargeModal = true;
  }

  confirmCobro() {
    if (!this.account) return;
    this.isLoading = true;
    this.posService.closeAccount(this.account.id, { paymentMethodInfo: this.paymentMethod, tip: this.tipAmount }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Cobrado', detail: 'La cuenta ha sido cerrada' });
        this.showChargeModal = false;
        this.isLoading = false;
        this.accountChanged.emit();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al cobrar' });
        this.isLoading = false;
      }
    });
  }
}
