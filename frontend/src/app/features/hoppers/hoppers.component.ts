import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HoppersService, HopperConfig } from './hoppers.service';
import { CatalogoService, Product } from '../catalogo/catalogo.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-hoppers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTableComponent, ModalComponent],
  templateUrl: './hoppers.component.html'
})
export class HoppersComponent implements OnInit {
  private hoppersService = inject(HoppersService);
  private catalogoService = inject(CatalogoService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  activeConfigs = signal<HopperConfig[]>([]);
  coffeeBeans = signal<Product[]>([]);
  historyConfigs = signal<HopperConfig[]>([]);

  showForm = signal(false);
  showHistory = signal(false);
  isSaving = signal(false);
  isLoadingHistory = signal(false);

  form = this.fb.group({
    slotNumber: [1, Validators.required],
    productId: [null as number | null, Validators.required],
  });

  columns: TableColumn[] = [
    { field: 'slotNumber', header: 'Tolva N°', sortable: true },
    { field: 'product', header: 'Café Configurado', sortable: true, valueGetter: (c: any) => c.product?.name },
    { field: 'createdAt', header: 'Fecha Configuración', sortable: true, valueGetter: (c: any) => new Date(c.createdAt).toLocaleString() },
  ];

  historyColumns: TableColumn[] = [
    { field: 'createdAt', header: 'Fecha', sortable: true, valueGetter: (c: any) => new Date(c.createdAt).toLocaleString() },
    { field: 'product', header: 'Café', sortable: true, valueGetter: (c: HopperConfig) => c.product?.name },
    { field: 'user', header: 'Configurado Por', sortable: true, valueGetter: (c: HopperConfig) => c.configuredByUser?.name },
    { field: 'isActive', header: 'Estado', sortable: true, valueGetter: (c: HopperConfig) => c.isActive ? 'Activo' : 'Histórico' },
  ];

  ngOnInit() {
    this.loadConfigs();
    this.loadCoffeeBeans();
  }

  loadConfigs() {
    this.hoppersService.getActiveConfigs().subscribe(data => this.activeConfigs.set(data));
  }

  loadCoffeeBeans() {
    // Ideally we should filter productType = COFFEE_BEAN. We assume we fetch all products and filter here,
    // or use a specific endpoint. Let's filter locally for now based on a type condition if possible,
    // or just fetch all varieties. The backend HopperConfig allows any product, but the UI should show beans.
    // In Sprint 1, Coffee Varieties are linked to Products.
    this.catalogoService.getCoffeeVarieties().subscribe(varieties => {
       const productIdsWithVarieties = varieties.map(v => v.productId);
       this.catalogoService.getProducts().subscribe(products => {
         const beans = products.filter(p => productIdsWithVarieties.includes(p.id));
         this.coffeeBeans.set(beans);
       });
    });
  }

  openForm(slot: number = 1) {
    this.form.reset({ slotNumber: slot, productId: null });
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

    const { slotNumber, productId } = this.form.value;
    
    this.isSaving.set(true);
    this.hoppersService.setActiveConfig(slotNumber!, productId!).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Tolva configurada' });
        this.loadConfigs();
        this.closeForm();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo configurar la tolva' });
        this.isSaving.set(false);
      }
    });
  }

  viewHistory(slot: number) {
    this.showHistory.set(true);
    this.isLoadingHistory.set(true);
    this.hoppersService.getHistory(slot).subscribe(data => {
      this.historyConfigs.set(data);
      this.isLoadingHistory.set(false);
    });
  }

  closeHistory() {
    this.showHistory.set(false);
    this.historyConfigs.set([]);
  }
}
