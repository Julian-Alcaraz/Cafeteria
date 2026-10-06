import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CatalogoService, CoffeeVariety, Product } from '../catalogo.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-variedades-cafe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTableComponent, ConfirmModalComponent, ModalComponent],
  templateUrl: './variedades-cafe.component.html',
  styleUrls: ['./variedades-cafe.component.css'],
})
export class VariedadesCafeComponent implements OnInit {
  private catalogoService = inject(CatalogoService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  variedades = signal<CoffeeVariety[]>([]);
  coffeeBeans = signal<Product[]>([]); // Productos tipo COFFEE_BEAN
  showForm = signal(false);
  editingVariety = signal<CoffeeVariety | null>(null);
  isCopyMode = signal(false);
  varietyToDelete = signal<number | null>(null);
  isSaving = signal(false);

  availableCoffeeBeans = computed(() => {
    const allBeans = this.coffeeBeans();
    const usedProductIds = new Set(this.variedades().map(v => v.productId));
    const currentEdit = this.editingVariety();
    const isCopy = this.isCopyMode();

    return allBeans.filter(bean => {
      if (currentEdit && !isCopy && bean.id === currentEdit.productId) {
        return true; // Keep the one already assigned if editing
      }
      return !usedProductIds.has(bean.id); // Otherwise, only unassigned ones
    });
  });

  columns: TableColumn[] = [
    { field: 'product', header: 'Producto', sortable: true, valueGetter: (v: CoffeeVariety) => v.product?.name },
    { field: 'origin', header: 'Origen', sortable: true },
    { field: 'process', header: 'Proceso', valueGetter: (v: CoffeeVariety) => v.process ?? '—' },
    { field: 'roastLevel', header: 'Tueste', valueGetter: (v: CoffeeVariety) => v.roastLevel ?? '—' },
    { field: 'notes', header: 'Notas de cata', valueGetter: (v: CoffeeVariety) => v.notes ?? '—' },
  ];

  form = this.fb.group({
    productId: [null as number | null, Validators.required],
    origin: ['', Validators.required],
    process: [''],
    roastLevel: [''],
    notes: [''],
  });

  ngOnInit() {
    this.loadVariedades();
    this.loadCoffeeBeans();
  }

  loadVariedades() {
    this.catalogoService.getCoffeeVarieties().subscribe(data => this.variedades.set(data));
  }

  loadCoffeeBeans() {
    this.catalogoService.getProducts({ typeCode: 'COFFEE_BEAN' }).subscribe(data => this.coffeeBeans.set(data));
  }

  openForm(variety?: CoffeeVariety) {
    this.editingVariety.set(variety ?? null);
    this.isCopyMode.set(false);
    if (variety) {
      this.form.patchValue({
        productId: variety.productId,
        origin: variety.origin,
        process: variety.process ?? '',
        roastLevel: variety.roastLevel ?? '',
        notes: variety.notes ?? '',
      });
      // No se permite cambiar el producto en edición
      this.form.controls.productId.disable();
    } else {
      this.form.reset();
      this.form.controls.productId.enable();
    }
    this.showForm.set(true);
  }

  duplicateVariety(variety: CoffeeVariety) {
    this.editingVariety.set(variety);
    this.isCopyMode.set(true);
    this.form.patchValue({
      productId: null, // Debe elegir un producto nuevo (relación 1 a 1)
      origin: variety.origin,
      process: variety.process ?? '',
      roastLevel: variety.roastLevel ?? '',
      notes: variety.notes ?? '',
    });
    this.form.controls.productId.enable();
    this.showForm.set(true);
  }

  closeModals() {
    this.showForm.set(false);
    this.editingVariety.set(null);
    this.isCopyMode.set(false);
    this.varietyToDelete.set(null);
    this.form.reset();
    this.form.controls.productId.enable();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const variety = this.editingVariety();
    this.isSaving.set(true);

    const formVal = this.form.getRawValue();
    const payload = {
      ...formVal,
      productId: formVal.productId,
    } as Partial<CoffeeVariety>;

    const request$ = variety && !this.isCopyMode()
      ? this.catalogoService.updateCoffeeVariety(variety.id, payload)
      : this.catalogoService.createCoffeeVariety(payload);

    request$.subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: variety && !this.isCopyMode() ? 'Variedad actualizada' : 'Variedad creada' });
        this.loadVariedades();
        this.closeModals();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar la variedad de café' });
        this.isSaving.set(false);
      },
    });
  }

  deleteVariedad(id: number) {
    this.varietyToDelete.set(id);
  }

  confirmDeleteVariedad() {
    const id = this.varietyToDelete();
    if (id === null) return;
    this.catalogoService.deleteCoffeeVariety(id).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Variedad deshabilitada' });
        this.loadVariedades();
        this.varietyToDelete.set(null);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo deshabilitar la variedad' });
      },
    });
  }
}
