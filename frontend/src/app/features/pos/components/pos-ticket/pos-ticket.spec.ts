import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosTicket } from './pos-ticket';

describe('PosTicket', () => {
  let component: PosTicket;
  let fixture: ComponentFixture<PosTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(PosTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
