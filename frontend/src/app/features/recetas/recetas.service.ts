import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface RecipeIngredient {
  id: number;
  productId: number;
  product: { id: number; name: string; unit: string };
  quantity: number;
  unit: string;
  isHopperSlot: boolean;
  hopperSlotNumber?: number;
  notes?: string;
}

export interface Recipe {
  id: number;
  productId: number;
  product: { id: number; name: string };
  name: string;
  version: number;
  isActive: boolean;
  yieldQty: number;
  yieldUnit: string;
  validFrom: string;
  ingredients: RecipeIngredient[];
}

export interface CreateRecipeIngredientPayload {
  productId: number;
  quantity: number;
  unit: string;
  isHopperSlot?: boolean;
  hopperSlotNumber?: number;
  notes?: string;
}

export interface CreateRecipePayload {
  productId: number;
  name: string;
  yieldQty?: number;
  yieldUnit?: string;
  ingredients: CreateRecipeIngredientPayload[];
}

@Injectable({ providedIn: 'root' })
export class RecetasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recipes`;

  getRecetas() {
    return this.http.get<ApiResponse<Recipe[]>>(this.apiUrl).pipe(map(r => r.data));
  }

  getReceta(id: number) {
    return this.http.get<ApiResponse<Recipe>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }

  getRecetaActivaProducto(productId: number) {
    return this.http.get<ApiResponse<Recipe>>(`${this.apiUrl}/product/${productId}`).pipe(map(r => r.data));
  }

  createReceta(data: CreateRecipePayload) {
    return this.http.post<ApiResponse<Recipe>>(this.apiUrl, data).pipe(map(r => r.data));
  }

  updateReceta(id: number, data: Partial<CreateRecipePayload>) {
    return this.http.patch<ApiResponse<Recipe>>(`${this.apiUrl}/${id}`, data).pipe(map(r => r.data));
  }

  deleteReceta(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }
}
