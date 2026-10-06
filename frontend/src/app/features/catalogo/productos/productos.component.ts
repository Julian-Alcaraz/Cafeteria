import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService, Product, ProductType, Category } from '../catalogo.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';
import { ProductoFormComponent } from './components/producto-form.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ConfirmModalComponent, ProductoFormComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  private catalogoService = inject(CatalogoService);
  private toastService = inject(ToastService);

  productos = signal<Product[]>([]);
  productTypes = signal<ProductType[]>([]);
  categories = signal<Category[]>([]);

  showForm = signal(false);
  editingProduct = signal<Product | null>(null);
  isCopyMode = signal(false);
  productToDelete = signal<number | null>(null);
  isSaving = signal(false);

  columns: TableColumn[] = [
    { field: 'sku', header: 'SKU', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'productType', header: 'Tipo', sortable: true, valueGetter: (p: Product) => p.productType?.name },
    { field: 'category', header: 'Categoría', sortable: true, valueGetter: (p: Product) => p.category?.name ?? '—' },
    { field: 'unit', header: 'Unidad' },
    { field: 'salePrice', header: 'Precio Venta', sortable: true, valueGetter: (p: Product) => `$${Number(p.salePrice).toFixed(2)}` },
    { field: 'costPrice', header: 'Costo', sortable: true, valueGetter: (p: Product) => `$${Number(p.costPrice).toFixed(2)}` },
  ];

  ngOnInit() {
    this.loadProductos();
    this.loadProductTypes();
    this.loadCategories();
  }

  loadProductos() {
    this.catalogoService.getProducts().subscribe(data => this.productos.set(data));
  }

  loadProductTypes() {
    this.catalogoService.getProductTypes().subscribe(data => this.productTypes.set(data));
  }

  loadCategories() {
    this.catalogoService.getCategories().subscribe(data => this.categories.set(data));
  }

  openForm(product?: Product) {
    this.editingProduct.set(product ?? null);
    this.isCopyMode.set(false);
    this.showForm.set(true);
  }

  duplicateProduct(product: Product) {
    this.editingProduct.set(product);
    this.isCopyMode.set(true);
    this.showForm.set(true);
  }

  closeModals() {
    this.showForm.set(false);
    this.editingProduct.set(null);
    this.isCopyMode.set(false);
    this.productToDelete.set(null);
  }

  saveProducto(formData: Partial<Product>) {
    const product = this.editingProduct();
    this.isSaving.set(true);

    const request$ = product && !this.isCopyMode()
      ? this.catalogoService.updateProduct(product.id, formData)
      : this.catalogoService.createProduct(formData);

    request$.subscribe({
      next: () => {
        this.toastService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: product && !this.isCopyMode() ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
        });
        this.loadProductos();
        this.closeModals();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el producto',
        });
        this.isSaving.set(false);
      },
    });
  }

  deleteProducto(id: number) {
    this.productToDelete.set(id);
  }

  confirmDeleteProducto() {
    const id = this.productToDelete();
    if (id === null) return;

    this.catalogoService.deleteProduct(id).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto deshabilitado' });
        this.loadProductos();
        this.productToDelete.set(null);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo deshabilitar el producto' });
      },
    });
  }
}
