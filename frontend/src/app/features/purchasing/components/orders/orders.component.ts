import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { PurchasingService, PurchaseOrder, Supplier } from '../../purchasing.service';
import { CatalogoService, Product } from '../../../catalogo/catalogo.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ModalComponent } from '@shared/components/modal.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTableComponent, ModalComponent, ConfirmModalComponent],
  templateUrl: './orders.component.html'
})
export class PurchaseOrdersComponent implements OnInit {
  private purchasingService = inject(PurchasingService);
  private catalogoService = inject(CatalogoService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  orders = signal<PurchaseOrder[]>([]);
  suppliers = signal<Supplier[]>([]);
  products = signal<Product[]>([]);

  showForm = signal(false);
  isSaving = signal(false);
  isReceiving = signal(false);
  
  viewOrder = signal<PurchaseOrder | null>(null);
  orderToReceive = signal<number | null>(null);

  form = this.fb.group({
    supplierId: [null as number | null, Validators.required],
    expectedAt: [''],
    items: this.fb.array([])
  });

  columns: TableColumn[] = [
    { field: 'code', header: 'Código', sortable: true },
    { field: 'supplier', header: 'Proveedor', sortable: true, valueGetter: (o: PurchaseOrder) => o.supplier?.name },
    { field: 'status', header: 'Estado', sortable: true },
    { field: 'totalAmount', header: 'Total', sortable: true, valueGetter: (o: PurchaseOrder) => '$' + Number(o.totalAmount).toFixed(2) },
    { field: 'createdAt', header: 'Creada El', sortable: true, valueGetter: (o: PurchaseOrder) => new Date(o.orderedAt || '').toLocaleDateString() },
  ];

  ngOnInit() {
    this.loadOrders();
    this.loadSuppliers();
    this.loadProducts();
  }

  loadOrders() {
    this.purchasingService.getPurchaseOrders().subscribe(data => this.orders.set(data));
  }

  loadSuppliers() {
    this.purchasingService.getSuppliers().subscribe(data => this.suppliers.set(data));
  }

  loadProducts() {
    this.catalogoService.getProducts().subscribe(data => {
      // Filter out ELABORATED products since we don't purchase them
      const purchasable = data.filter(p => p.productType?.code !== 'ELABORATED');
      this.products.set(purchasable);
    });
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    const itemForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.0001)]],
      unitCost: [0, [Validators.required, Validators.min(0)]],
      unit: ['UNIT', Validators.required]
    });
    
    // Auto-fill unit when product selected
    itemForm.get('productId')?.valueChanges.subscribe(pid => {
      const p = this.products().find(x => x.id == pid);
      if (p) itemForm.get('unit')?.setValue(p.unit);
    });

    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  openForm() {
    this.form.reset();
    this.items.clear();
    this.addItem(); // add at least one item
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSaving.set(true);
    this.purchasingService.createPurchaseOrder(this.form.value).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden creada' });
        this.loadOrders();
        this.closeForm();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear orden' });
        this.isSaving.set(false);
      }
    });
  }

  viewDetails(order: PurchaseOrder) {
    this.purchasingService.getPurchaseOrder(order.id).subscribe(data => {
      this.viewOrder.set(data);
    });
  }

  closeDetails() {
    this.viewOrder.set(null);
  }

  receiveOrder(id: number) {
    this.orderToReceive.set(id);
  }

  confirmReceiveOrder() {
    const id = this.orderToReceive();
    if (id) {
      this.isReceiving.set(true);
      this.purchasingService.receivePurchaseOrder(id).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Recibida', detail: 'Stock inyectado con éxito' });
          this.loadOrders();
          this.closeDetails();
          this.isReceiving.set(false);
          this.orderToReceive.set(null);
        },
        error: (err: any) => {
          this.toastService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo recibir la orden' });
          this.isReceiving.set(false);
          this.orderToReceive.set(null);
        }
      });
    }
  }
}
