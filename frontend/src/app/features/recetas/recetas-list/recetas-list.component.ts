import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecetasService, Recipe } from '../recetas.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';

@Component({
  selector: 'app-recetas-list',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ConfirmModalComponent],
  templateUrl: './recetas-list.component.html',
  styleUrls: ['./recetas-list.component.css'],
})
export class RecetasListComponent implements OnInit {
  private recetasService = inject(RecetasService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  recetas = signal<Recipe[]>([]);
  recetaToDelete = signal<number | null>(null);

  columns: TableColumn[] = [
    { field: 'product', header: 'Producto', sortable: true, valueGetter: (r: Recipe) => r.product?.name },
    { field: 'name', header: 'Nombre Receta', sortable: true },
    { field: 'version', header: 'Versión', sortable: true },
    { field: 'isActive', header: 'Estado', valueGetter: (r: Recipe) => r.isActive ? '✅ Activa' : '⛔ Inactiva' },
    { field: 'ingredients', header: 'Ingredientes', valueGetter: (r: Recipe) => `${r.ingredients?.length ?? 0} ingredientes` },
    { field: 'validFrom', header: 'Vigente desde', sortable: true, valueGetter: (r: Recipe) => new Date(r.validFrom).toLocaleDateString('es-AR') },
  ];

  ngOnInit() {
    this.loadRecetas();
  }

  loadRecetas() {
    this.recetasService.getRecetas().subscribe(data => this.recetas.set(data));
  }

  goToForm(recipe?: Recipe) {
    if (recipe) {
      this.router.navigate(['/app/recetas', recipe.id, 'editar'], { state: { fromList: true } });
    } else {
      this.router.navigate(['/app/recetas/nueva'], { state: { fromList: true } });
    }
  }

  deleteReceta(id: number) {
    this.recetaToDelete.set(id);
  }

  confirmDeleteReceta() {
    const id = this.recetaToDelete();
    if (id === null) return;
    this.recetasService.deleteReceta(id).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Receta deshabilitada' });
        this.loadRecetas();
        this.recetaToDelete.set(null);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo deshabilitar la receta' });
      },
    });
  }
}
