import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PosCatalogComponent } from '../pos-catalog/pos-catalog.component';
import { PosTicketComponent } from '../pos-ticket/pos-ticket.component';
import { PosService, PosAccount } from '../../pos.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-pos-layout',
  standalone: true,
  imports: [CommonModule, PosCatalogComponent, PosTicketComponent, ToastModule, ModalComponent, FormsModule],
  providers: [MessageService],
  template: `
    <div class="pos-layout" [class.menu-hidden]="isMenuHidden()">
      <!-- Sección Izquierda: Catálogo -->
      <div class="pos-left" *ngIf="!isMenuHidden()">
        <app-pos-catalog (productSelected)="onProductSelected($event)"></app-pos-catalog>
      </div>

      <!-- Sección Derecha: Tickets -->
      <div class="pos-right">
        <div class="right-header">
          <button class="btn btn-secondary toggle-btn" (click)="toggleMenu()" [title]="isMenuHidden() ? 'Mostrar Catálogo' : 'Ocultar Catálogo'">
            <i class="pi" [ngClass]="isMenuHidden() ? 'pi-bars' : 'pi-angle-left'"></i>
          </button>
          <div class="header-spacer"></div>
          <button class="btn btn-primary" (click)="openNewTicketModal()">
            <i class="pi pi-plus"></i> Nuevo Ticket
          </button>
        </div>

        <div class="tickets-list">
          <div class="empty-state" *ngIf="allAccounts().length === 0">
            <i class="pi pi-receipt" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-border)"></i>
            <h3>No hay cuentas abiertas</h3>
            <p>Comienza abriendo un nuevo ticket.</p>
          </div>

          <app-pos-ticket 
            *ngFor="let acc of allAccounts()"
            [account]="acc" 
            [isExpanded]="acc.id === currentAccount()?.id"
            (onExpand)="currentAccount()?.id === acc.id ? currentAccount.set(null) : currentAccount.set(acc)"
            (accountChanged)="loadAccounts()">
          </app-pos-ticket>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Ticket -->
    <app-modal *ngIf="showNewTicketModal" title="Abrir Nuevo Ticket" (close)="showNewTicketModal = false">
      <div class="form-group">
        <label>Referencia o Nombre</label>
        <input type="text" class="form-control" [(ngModel)]="newTicketName" placeholder="Ej: Mesa 3, Pablo, Para llevar..." (keyup.enter)="createTicket()">
      </div>
      <ng-container modal-actions>
        <button class="btn btn-secondary" (click)="showNewTicketModal = false">Cancelar</button>
        <button class="btn btn-primary" (click)="createTicket()">Abrir</button>
      </ng-container>
    </app-modal>

    <!-- Modal Seleccionar Tolva -->
    <app-modal *ngIf="showHopperModal" title="Seleccionar Tolva de Café" (close)="cancelHopperSelection()">
      <p>Este producto requiere seleccionar de qué tolva provendrá el grano de café.</p>
      <div class="hoppers-grid">
        <div class="hopper-card" *ngFor="let h of activeHoppers()" (click)="selectHopperAndRetry(h)">
          <h4>Tolva {{ h.slotNumber }}</h4>
          <p>{{ h.product?.name }}</p>
        </div>
      </div>
      <ng-container modal-actions>
        <button type="button" class="btn btn-secondary" (click)="cancelHopperSelection()">Cancelar</button>
      </ng-container>
    </app-modal>
  `,
  styles: [`
    .pos-layout {
      display: flex;
      gap: 1rem;
      height: calc(100vh - 100px); /* Adjust based on your header */
    }
    .pos-left {
      flex: 2;
      background: var(--bg-surface);
      border-radius: 12px;
      padding: 1rem;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: flex 0.3s ease;
    }
    .pos-right {
      flex: 1;
      background: var(--bg-surface);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: flex 0.3s ease;
      min-width: 350px;
    }
    .pos-layout.menu-hidden .pos-left {
      display: none;
    }
    
    .right-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px dashed var(--color-border);
    }
    .header-spacer { flex: 1; }
    .toggle-btn { padding: 0.5rem 0.8rem; border-radius: 8px; }
    
    .tickets-list {
      flex: 1;
      overflow-y: auto;
      padding-right: 0.5rem;
    }
    .empty-state { text-align: center; color: var(--color-text-muted); margin-top: 3rem; }

    .hoppers-grid { display: flex; gap: 1rem; margin-top: 1rem; }
    .hopper-card { border: 2px solid var(--color-border); border-radius: 8px; padding: 1rem; cursor: pointer; text-align: center; flex: 1; }
    .hopper-card:hover { border-color: var(--color-primary); background: rgba(0,0,0,0.02); }
    
    @media (max-width: 900px) {
      .pos-layout { flex-direction: column; height: auto; }
      .pos-left, .pos-right { flex: none; width: 100%; }
    }
  `]
})
export class PosLayoutComponent implements OnInit {
  private posService = inject(PosService);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);

  currentAccount = signal<PosAccount | null>(null);
  allAccounts = signal<PosAccount[]>([]);
  activeHoppers = signal<any[]>([]);

  isMenuHidden = signal<boolean>(false);
  showNewTicketModal = false;
  newTicketName = '';

  showHopperModal = false;
  pendingProductPayload: any = null;

  ngOnInit() {
    this.loadAccounts();
    this.loadHoppers();
  }

  toggleMenu() {
    this.isMenuHidden.set(!this.isMenuHidden());
  }

  openNewTicketModal() {
    this.newTicketName = '';
    this.showNewTicketModal = true;
  }

  createTicket() {
    if (!this.newTicketName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Requerido', detail: 'Debe ingresar una referencia para el ticket' });
      return;
    }
    this.posService.openAccount({ customerName: this.newTicketName }).subscribe({
      next: (acc) => {
        this.showNewTicketModal = false;
        this.loadAccounts();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo abrir cuenta' })
    });
  }

  loadHoppers() {
    this.http.get<any>(`${environment.apiUrl}/hoppers/active`).subscribe(r => {
      this.activeHoppers.set(r.data);
    });
  }

  loadAccounts() {
    this.posService.getOpenAccounts().subscribe({
      next: (accounts) => {
        this.allAccounts.set(accounts);
        if (accounts.length > 0 && !this.currentAccount()) {
          this.currentAccount.set(accounts[0]);
        } else if (this.currentAccount()) {
          const updated = accounts.find(a => a.id === this.currentAccount()?.id);
          this.currentAccount.set(updated || accounts[0] || null);
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las cuentas' })
    });
  }

  onProductSelected(product: any) {
    if (!this.currentAccount()) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Primero debes abrir o seleccionar una cuenta' });
      return;
    }

    const payload: any = {
      productId: product.id,
      quantity: 1,
      price: product.salePrice,
    };

    // Si solo hay 1 tolva activa, la mandamos siempre por defecto.
    // Si la receta no usa tolva, el backend ignorará el hopperId extra silenciosamente.
    if (this.activeHoppers().length === 1) {
      payload.hopperId = this.activeHoppers()[0].id;
    }

    this.attemptAddItem(payload);
  }

  attemptAddItem(payload: any) {
    this.posService.addItem(this.currentAccount()!.id, payload).subscribe({
      next: () => {
        this.loadAccounts();
      },
      error: (err) => {
        if (err.error?.message === 'Hopper selection required for this recipe') {
          // Requires hopper selection
          this.pendingProductPayload = payload;
          this.showHopperModal = true;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo agregar' });
        }
      }
    });
  }

  selectHopperAndRetry(hopper: any) {
    if (!this.pendingProductPayload) return;
    this.pendingProductPayload.hopperId = hopper.id;
    this.showHopperModal = false;
    this.attemptAddItem(this.pendingProductPayload);
    this.pendingProductPayload = null;
  }

  cancelHopperSelection() {
    this.showHopperModal = false;
    this.pendingProductPayload = null;
  }

  onItemAdded(event: any) {
    this.loadAccounts();
  }
}

