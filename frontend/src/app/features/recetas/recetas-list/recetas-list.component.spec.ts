import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RecetasService } from '../recetas.service';
import { RecetasListComponent } from './recetas-list.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('RecetasListComponent', () => {
  let component: RecetasListComponent;
  let fixture: ComponentFixture<RecetasListComponent>;
  let mockService: any;
  let router: Router;

  beforeEach(async () => {
    mockService = {
      getRecetas: vi.fn().mockReturnValue(of([])),
      deleteReceta: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [RecetasListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: RecetasService, useValue: mockService },
        ToastService
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture = TestBed.createComponent(RecetasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load data', () => {
    expect(component).toBeTruthy();
    expect(mockService.getRecetas).toHaveBeenCalled();
  });

  it('should navigate to form on goToForm', () => {
    component.goToForm();
    expect(router.navigate).toHaveBeenCalledWith(['/app/recetas/nueva']);

    component.goToForm({ id: 1 } as any);
    expect(router.navigate).toHaveBeenCalledWith(['/app/recetas', 1, 'editar']);
  });
});
