import { Component, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../pos.service';

@Component({
  selector: 'app-pos-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="catalog-header">
      <h2>Menú</h2>
      <div class="categories-tabs">
        <button 
          *ngFor="let cat of categories()" 
          [class.active]="selectedCategory()?.id === cat.id"
          (click)="selectCategory(cat)"
          class="cat-btn">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div class="products-grid">
      @for (prod of products(); track prod.id) {
        <div class="product-card" (click)="productSelected.emit(prod)">
          <i class="pi prod-icon" [ngClass]="getIconForCategory(prod.category?.name)"></i>
          <div class="prod-info">
            <h4>{{ prod.name }}</h4>
            <p class="price">\${{ prod.salePrice | number:'1.2-2' }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .catalog-header { margin-bottom: 1.5rem; }
    .categories-tabs { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; }
    .cat-btn { padding: 0.6rem 1.2rem; border: 2px solid var(--color-border); background: var(--bg-surface); border-radius: 25px; cursor: pointer; white-space: nowrap; transition: all 0.2s; font-weight: 600; color: var(--color-text-muted); }
    .cat-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .cat-btn.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
    
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.2rem; padding-top: 0.5rem; }
    .product-card { 
      background: #faf6f0; 
      border: 2px solid var(--color-primary); 
      border-radius: 16px; 
      padding: 1.5rem 1rem; 
      cursor: pointer; 
      transition: all 0.2s ease; 
      text-align: center; 
      display: flex; 
      flex-direction: column; 
      align-items: center;
      justify-content: center; 
      min-height: 140px; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.04);
    }
    .product-card:active { transform: scale(0.96); }
    .product-card:hover { 
      transform: translateY(-4px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.1); 
      background: var(--color-primary);
    }
    .product-card:hover h4, .product-card:hover .price, .product-card:hover .prod-icon { color: white; }
    
    .prod-icon { font-size: 2rem; color: var(--color-primary); margin-bottom: 0.8rem; transition: color 0.2s; }
    .prod-info h4 { margin: 0 0 0.5rem 0; font-size: 1.05rem; font-weight: 700; transition: color 0.2s; line-height: 1.2; }
    .price { margin: 0; color: var(--color-primary); font-weight: 800; font-size: 1.2rem; transition: color 0.2s; }
  `]
})
export class PosCatalogComponent implements OnInit {
  private http = inject(HttpClient);
  
  categories = signal<any[]>([]);
  selectedCategory = signal<any | null>(null);
  products = signal<any[]>([]);

  @Output() productSelected = new EventEmitter<any>();

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/catalog/categories`).pipe(map(r => r.data)).subscribe(cats => {
      this.categories.set(cats);
      if (cats.length > 0) this.selectCategory(cats[0]);
    });
  }

  selectCategory(cat: any) {
    this.selectedCategory.set(cat);
    this.loadProducts(cat.id);
  }

  loadProducts(categoryId: number) {
    this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/catalog/products?categoryId=${categoryId}`).pipe(map(r => r.data)).subscribe(prods => {
      const saleable = prods.filter(p => p.productType?.code === 'SALEABLE' || p.productType?.code === 'ELABORATED' || p.salePrice > 0);
      this.products.set(saleable);
    });
  }

  getIconForCategory(catName?: string): string {
    if (!catName) return 'pi-tag';
    const name = catName.toLowerCase();
    if (name.includes('bebida') || name.includes('café') || name.includes('cafe')) {
      return 'pi-coffee';
    }
    if (name.includes('comida') || name.includes('consumible')) {
      return 'pi-box';
    }
    return 'pi-tag';
  }
}
