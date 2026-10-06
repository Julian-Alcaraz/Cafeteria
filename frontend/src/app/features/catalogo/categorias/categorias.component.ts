import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CatalogoService, Category } from '../catalogo.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';
import { ModalComponent } from '@shared/components/modal.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTableComponent, ConfirmModalComponent, ModalComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  private catalogoService = inject(CatalogoService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  categorias = signal<Category[]>([]);
  showForm = signal(false);
  editingCategory = signal<Category | null>(null);
  isCopyMode = signal(false);
  categoryToDelete = signal<number | null>(null);
  isSaving = signal(false);

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'slug', header: 'Slug', sortable: true },
    { field: 'parent', header: 'Categoría Padre', valueGetter: (c: Category) => c.parent?.name ?? '—' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    parentId: [null as number | null],
  });

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.catalogoService.getCategories().subscribe(data => this.categorias.set(data));
  }

  openForm(category?: Category) {
    this.editingCategory.set(category ?? null);
    this.isCopyMode.set(false);
    if (category) {
      this.form.patchValue({ name: category.name, slug: category.slug, parentId: category.parentId ?? null });
    } else {
      this.form.reset();
    }
    this.showForm.set(true);
  }

  duplicateCategory(category: Category) {
    this.editingCategory.set(category);
    this.isCopyMode.set(true);
    this.form.patchValue({
      name: category.name + ' (Copia)',
      slug: category.slug + '-copia',
      parentId: category.parentId ?? null,
    });
    this.showForm.set(true);
  }

  closeModals() {
    this.showForm.set(false);
    this.editingCategory.set(null);
    this.isCopyMode.set(false);
    this.categoryToDelete.set(null);
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const category = this.editingCategory();
    this.isSaving.set(true);

    const val = this.form.value;
    const payload = {
      ...val,
      parentId: val.parentId,
    } as Partial<Category>;

    const request$ = category && !this.isCopyMode()
      ? this.catalogoService.updateCategory(category.id, payload)
      : this.catalogoService.createCategory(payload);

    request$.subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: category && !this.isCopyMode() ? 'Categoría actualizada' : 'Categoría creada' });
        this.loadCategorias();
        this.closeModals();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar la categoría' });
        this.isSaving.set(false);
      },
    });
  }

  deleteCategoria(id: number) {
    this.categoryToDelete.set(id);
  }

  confirmDeleteCategoria() {
    const id = this.categoryToDelete();
    if (id === null) return;
    this.catalogoService.deleteCategory(id).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría deshabilitada' });
        this.loadCategorias();
        this.categoryToDelete.set(null);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo deshabilitar la categoría' });
      },
    });
  }

  autoSlug(name: string) {
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    this.form.patchValue({ slug });
  }
}
