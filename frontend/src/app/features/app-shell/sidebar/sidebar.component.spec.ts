import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { signal } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      session: signal({ username: 'testuser', menus: [{ label: 'Inicio', url: '/app' }] }),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout on logout click', () => {
    const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
    logoutBtn.click();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should emit close event on overlay click', () => {
    component.isOpen = true;
    fixture.detectChanges();
    
    const emitSpy = vi.spyOn(component.close, 'emit');
    const overlay = fixture.nativeElement.querySelector('.sidebar-overlay');
    overlay.click();
    
    expect(emitSpy).toHaveBeenCalled();
  });
});
