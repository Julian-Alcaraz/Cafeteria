import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosCatalog } from './pos-catalog';

describe('PosCatalog', () => {
  let component: PosCatalog;
  let fixture: ComponentFixture<PosCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(PosCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
