import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal.component';
import { Product, ProductType, Category } from '../../catalogo.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './producto-form.component.html',
})
export class ProductoFormComponent {
  product = input<Product | null>(null);
  isCopyMode = input<boolean>(false);
  productTypes = input<ProductType[]>([]);
  categories = input<Category[]>([]);
  isSaving = input<boolean>(false);

  save = output<Partial<Product>>();
  cancel = output<void>();

  private fb = inject(FormBuilder);

  readonly units = ['UNIT', 'KG', 'GR', 'LT', 'ML'];

  form = this.fb.group({
    sku: [''],
    name: ['', Validators.required],
    description: [''],
    productTypeId: [null as number | null, Validators.required],
    categoryId: [null as number | null],
    unit: ['UNIT', Validators.required],
    costPrice: [0, [Validators.required, Validators.min(0)]],
    salePrice: [0, [Validators.required, Validators.min(0)]],
    trackStock: [true],
    isSoldByWeight: [false],
  });

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          sku: this.isCopyMode() ? '' : (p.sku ?? ''),
          name: this.isCopyMode() ? p.name + ' (Copia)' : p.name,
          description: p.description ?? '',
          productTypeId: p.productTypeId,
          categoryId: p.categoryId ?? null,
          unit: p.unit,
          costPrice: p.costPrice != null ? Number(p.costPrice) : 0,
          salePrice: p.salePrice != null ? Number(p.salePrice) : 0,
          trackStock: p.trackStock,
          isSoldByWeight: p.isSoldByWeight,
        });
      } else {
        this.form.reset({ unit: 'UNIT', costPrice: 0, salePrice: 0, trackStock: true, isSoldByWeight: false });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value;
      this.save.emit({
        ...val,
        productTypeId: val.productTypeId,
        categoryId: val.categoryId,
        costPrice: val.costPrice != null ? Number(val.costPrice) : 0,
        salePrice: val.salePrice != null ? Number(val.salePrice) : 0,
      } as Partial<Product>);
    }
  }

  get isEditMode() {
    return this.product() !== null && !this.isCopyMode();
  }
}
