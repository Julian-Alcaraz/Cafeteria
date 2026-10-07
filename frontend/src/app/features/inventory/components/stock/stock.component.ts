import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, Stock, StockMovement } from '../../inventory.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ModalComponent],
  templateUrl: './stock.component.html'
})
export class StockComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  stocks = signal<Stock[]>([]);
  movements = signal<StockMovement[]>([]);
  showMovements = signal(false);
  isLoadingMovements = signal(false);
  selectedProductName = signal('');

  columns: TableColumn[] = [
    { field: 'product', header: 'Producto', sortable: true, valueGetter: (s: Stock) => s.product?.name },
    { field: 'quantityAvailable', header: 'Stock Disponible', sortable: true, valueGetter: (s: Stock) => Number(s.quantityAvailable).toFixed(2) },
    { field: 'unit', header: 'Unidad', sortable: true },
  ];

  movColumns: TableColumn[] = [
    { field: 'createdAt', header: 'Fecha', sortable: true, valueGetter: (m: StockMovement) => new Date(m.createdAt).toLocaleString() },
    { field: 'type', header: 'Tipo', sortable: true },
    { field: 'quantity', header: 'Cantidad', sortable: true, valueGetter: (m: StockMovement) => Number(m.quantity).toFixed(2) },
    { field: 'referenceType', header: 'Referencia', sortable: true },
    { field: 'user', header: 'Usuario', sortable: true, valueGetter: (m: StockMovement) => m.performedByUser?.name },
  ];

  ngOnInit() {
    this.loadStock();
  }

  loadStock() {
    this.inventoryService.getGlobalStock().subscribe(data => this.stocks.set(data));
  }

  viewMovements(stock: Stock) {
    this.selectedProductName.set(stock.product?.name || '');
    this.showMovements.set(true);
    this.isLoadingMovements.set(true);
    this.inventoryService.getProductMovements(stock.productId).subscribe({
      next: (data) => {
        this.movements.set(data);
        this.isLoadingMovements.set(false);
      },
      error: () => this.isLoadingMovements.set(false)
    });
  }

  closeMovements() {
    this.showMovements.set(false);
    this.movements.set([]);
  }
}
