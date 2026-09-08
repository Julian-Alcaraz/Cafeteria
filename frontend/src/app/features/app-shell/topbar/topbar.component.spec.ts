import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';
import { AuthService } from '@core/services/auth.service';
import { signal } from '@angular/core';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      session: signal({ username: 'testuser', menus: [] }),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleMenu event when button is clicked', () => {
    const emitSpy = vi.spyOn(component.toggleMenu, 'emit');
    const button = fixture.nativeElement.querySelector('.menu-toggle');
    button.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should display username from session', () => {
    const usernameEl = fixture.nativeElement.querySelector('.username');
    expect(usernameEl.textContent).toContain('testuser');
  });
});
