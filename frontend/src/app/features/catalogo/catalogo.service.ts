import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ProductType {
  id: number;
  code: 'SALEABLE' | 'INGREDIENT' | 'ELABORATED' | 'COFFEE_BEAN';
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
}

export interface Product {
  id: number;
  sku?: string;
  name: string;
  description?: string;
  productTypeId: number;
  productType: ProductType;
  categoryId?: number;
  category?: Category;
  unit: string;
  costPrice: number;
  salePrice: number;
  trackStock: boolean;
  isSoldByWeight: boolean;
  deshabilitado: boolean;
}

export interface CoffeeVariety {
  id: number;
  productId: number;
  product: Product;
  origin: string;
  process?: string;
  roastLevel?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/catalog`;

  // ── PRODUCT TYPES ─────────────────────────────────────────────────────────

  getProductTypes() {
    return this.http.get<ApiResponse<ProductType[]>>(`${this.apiUrl}/product-types`)
      .pipe(map(r => r.data));
  }

  // ── CATEGORIES ────────────────────────────────────────────────────────────

  getCategories() {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`)
      .pipe(map(r => r.data));
  }

  createCategory(data: Partial<Category>) {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, data)
      .pipe(map(r => r.data));
  }

  updateCategory(id: number, data: Partial<Category>) {
    return this.http.patch<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, data)
      .pipe(map(r => r.data));
  }

  deleteCategory(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/categories/${id}`)
      .pipe(map(r => r.data));
  }

  // ── PRODUCTS ──────────────────────────────────────────────────────────────

  getProducts(filters?: { typeCode?: string; categoryId?: number; search?: string }) {
    let params = new HttpParams();
    if (filters?.typeCode) params = params.set('typeCode', filters.typeCode);
    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products`, { params })
      .pipe(map(r => r.data));
  }

  getProduct(id: number) {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`)
      .pipe(map(r => r.data));
  }

  createProduct(data: Partial<Product>) {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, data)
      .pipe(map(r => r.data));
  }

  updateProduct(id: number, data: Partial<Product>) {
    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, data)
      .pipe(map(r => r.data));
  }

  deleteProduct(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/products/${id}`)
      .pipe(map(r => r.data));
  }

  // ── COFFEE VARIETIES ──────────────────────────────────────────────────────

  getCoffeeVarieties() {
    return this.http.get<ApiResponse<CoffeeVariety[]>>(`${this.apiUrl}/coffee-varieties`)
      .pipe(map(r => r.data));
  }

  createCoffeeVariety(data: Partial<CoffeeVariety>) {
    return this.http.post<ApiResponse<CoffeeVariety>>(`${this.apiUrl}/coffee-varieties`, data)
      .pipe(map(r => r.data));
  }

  updateCoffeeVariety(id: number, data: Partial<CoffeeVariety>) {
    return this.http.patch<ApiResponse<CoffeeVariety>>(`${this.apiUrl}/coffee-varieties/${id}`, data)
      .pipe(map(r => r.data));
  }

  deleteCoffeeVariety(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/coffee-varieties/${id}`)
      .pipe(map(r => r.data));
  }
}
