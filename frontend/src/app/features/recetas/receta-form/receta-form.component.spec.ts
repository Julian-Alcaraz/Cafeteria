import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RecetasService } from '../recetas.service';
import { CatalogoService } from '../../catalogo/catalogo.service';
import { RecetaFormComponent } from './receta-form.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { of } from 'rxjs';

describe('RecetaFormComponent', () => {
  let component: RecetaFormComponent;
  let fixture: ComponentFixture<RecetaFormComponent>;
  let mockRecetasService: any;
  let mockCatalogoService: any;

  beforeEach(async () => {
    mockRecetasService = {
      getReceta: vi.fn().mockReturnValue(of({
        productId: 1, name: 'Test', yieldQty: 1, yieldUnit: 'UNIT', ingredients: []
      })),
      createReceta: vi.fn().mockReturnValue(of({})),
      updateReceta: vi.fn().mockReturnValue(of({}))
    };

    mockCatalogoService = {
      getProducts: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [RecetaFormComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: RecetasService, useValue: mockRecetasService },
        { provide: CatalogoService, useValue: mockCatalogoService },
        ToastService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and add default ingredient', () => {
    expect(component).toBeTruthy();
    expect(component.ingredientsFormArray.length).toBe(1); // Añade 1 por defecto en ngOnInit
  });

  it('should add and remove ingredients', () => {
    component.addIngredient();
    expect(component.ingredientsFormArray.length).toBe(2);
    
    component.removeIngredient(0);
    expect(component.ingredientsFormArray.length).toBe(1);
  });

  it('should toggle hopper mode validators', () => {
    const group = component.ingredientsFormArray.at(0);
    
    component.toggleHopperMode(0, true);
    expect(group.get('hopperSlotNumber')?.validator).toBeTruthy();

    component.toggleHopperMode(0, false);
    expect(group.get('hopperSlotNumber')?.validator).toBeNull();
  });
});
