import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetasService, Recipe, CreateRecipePayload, CreateRecipeIngredientPayload } from '../recetas.service';
import { CatalogoService, Product } from '../../catalogo/catalogo.service';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './receta-form.component.html',
  styleUrls: ['./receta-form.component.css'],
})
export class RecetaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private recetasService = inject(RecetasService);
  private catalogoService = inject(CatalogoService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isSaving = signal(false);
  isLoading = signal(false);
  isEditMode = signal(false);
  currentRecipeId = signal<number | null>(null);

  elaboratedProducts = signal<Product[]>([]);
  ingredientProducts = signal<Product[]>([]);
  coffeeBeanProducts = signal<Product[]>([]);

  readonly units = ['UNIT', 'KG', 'GR', 'LT', 'ML'];

  form = this.fb.group({
    productId: [null as number | null, Validators.required],
    name: ['', Validators.required],
    yieldQty: [1, [Validators.required, Validators.min(0.0001)]],
    yieldUnit: ['UNIT', Validators.required],
    ingredients: this.fb.array([]),
  });

  showBackButton = signal(false);

  get ingredientsFormArray() {
    return this.form.get('ingredients') as FormArray;
  }

  ngOnInit() {
    this.showBackButton.set(history.state?.fromList === true);
    this.loadProducts();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.currentRecipeId.set(+idParam);
      this.loadRecipe(+idParam);
    } else {
      this.addIngredient(); // Añadir un ingrediente vacío por defecto
    }
  }

  loadProducts() {
    // Productos elaborados (los que tienen receta)
    this.catalogoService.getProducts({ typeCode: 'ELABORATED' }).subscribe(data => this.elaboratedProducts.set(data));
    // Insumos regulares
    this.catalogoService.getProducts({ typeCode: 'INGREDIENT' }).subscribe(data => this.ingredientProducts.set(data));
    // Café en grano (para tolvas)
    this.catalogoService.getProducts({ typeCode: 'COFFEE_BEAN' }).subscribe(data => this.coffeeBeanProducts.set(data));
  }

  loadRecipe(id: number) {
    this.isLoading.set(true);
    this.recetasService.getReceta(id).subscribe({
      next: (recipe) => {
        this.form.patchValue({
          productId: recipe.productId,
          name: recipe.name,
          yieldQty: recipe.yieldQty != null ? Number(recipe.yieldQty) : null,
          yieldUnit: recipe.yieldUnit,
        });

        // Al editar, bloqueamos el producto base
        this.form.controls.productId.disable();

        // Cargar ingredientes
        this.ingredientsFormArray.clear();
        recipe.ingredients.forEach(ing => {
          this.ingredientsFormArray.push(this.createIngredientGroup(ing));
        });

        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la receta' });
        this.isLoading.set(false);
        this.goBack();
      }
    });
  }

  createIngredientGroup(ingredient?: any) {
    return this.fb.group({
      productId: [ingredient?.productId ?? null, Validators.required],
      quantity: [ingredient?.quantity != null ? Number(ingredient.quantity) : null, [Validators.required, Validators.min(0.0001)]],
      unit: [ingredient?.unit ?? 'UNIT', Validators.required],
      isHopperSlot: [ingredient?.isHopperSlot ?? false],
      hopperSlotNumber: [ingredient?.hopperSlotNumber ?? null],
      notes: [ingredient?.notes ?? ''],
    });
  }

  addIngredient() {
    this.ingredientsFormArray.push(this.createIngredientGroup());
  }

  removeIngredient(index: number) {
    this.ingredientsFormArray.removeAt(index);
  }

  toggleHopperMode(index: number, isHopper: boolean) {
    const group = this.ingredientsFormArray.at(index) as FormGroup;
    if (isHopper) {
      group.get('hopperSlotNumber')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      group.get('hopperSlotNumber')?.clearValidators();
      group.get('hopperSlotNumber')?.setValue(null);
    }
    group.get('hopperSlotNumber')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.ingredientsFormArray.length === 0) {
      this.toastService.add({ severity: 'warn', summary: 'Atención', detail: 'La receta debe tener al menos un ingrediente' });
      return;
    }

    this.isSaving.set(true);

    const formValue = this.form.getRawValue();
    const payload: CreateRecipePayload = {
      productId: formValue.productId!,
      name: formValue.name!,
      yieldQty: Number(formValue.yieldQty),
      yieldUnit: formValue.yieldUnit!,
      ingredients: formValue.ingredients.map((ing: any) => ({
        productId: ing.productId,
        quantity: Number(ing.quantity),
        unit: ing.unit,
        isHopperSlot: ing.isHopperSlot,
        hopperSlotNumber: ing.isHopperSlot ? Number(ing.hopperSlotNumber) : undefined,
        notes: ing.notes,
      })),
    };

    const request$ = this.isEditMode()
      ? this.recetasService.updateReceta(this.currentRecipeId()!, payload)
      : this.recetasService.createReceta(payload);

    request$.subscribe({
      next: () => {
        this.toastService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: this.isEditMode() ? 'Nueva versión de receta creada' : 'Receta creada' 
        });
        this.isSaving.set(false);
        this.goBack();
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la receta' });
        this.isSaving.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/app/recetas/lista']);
  }
}
