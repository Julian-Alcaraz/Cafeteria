import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CatalogoService } from '../catalogo.service';
import { ProductosComponent } from './productos.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { of } from 'rxjs';

describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;
  let mockCatalogoService: any;

  beforeEach(async () => {
    mockCatalogoService = {
      getProducts: vi.fn().mockReturnValue(of([])),
      getProductTypes: vi.fn().mockReturnValue(of([])),
      getCategories: vi.fn().mockReturnValue(of([])),
      deleteProduct: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ProductosComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CatalogoService, useValue: mockCatalogoService },
        ToastService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockCatalogoService.getProducts).toHaveBeenCalled();
  });

  it('should open form to create', () => {
    component.openForm();
    expect(component.showForm()).toBe(true);
    expect(component.editingProduct()).toBeNull();
  });

  it('should call delete service and reload on confirm delete', () => {
    component.deleteProducto(1);
    expect(component.productToDelete()).toBe(1);

    component.confirmDeleteProducto();
    expect(mockCatalogoService.deleteProduct).toHaveBeenCalledWith(1);
    expect(mockCatalogoService.getProducts).toHaveBeenCalledTimes(2); // init + reload
    expect(component.productToDelete()).toBeNull();
  });
});
