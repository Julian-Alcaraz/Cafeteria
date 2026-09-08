import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      session: signal({ username: 'testuser', menus: [] }),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    expect(component.isSidebarOpen).toBe(false);
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(true);
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(false);
  });

  it('should close sidebar', () => {
    component.isSidebarOpen = true;
    component.closeSidebar();
    expect(component.isSidebarOpen).toBe(false);
  });
});
