import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  expandedMenus: Record<number, boolean> = {};
  showLogoutConfirm = signal(false);
  currentUrl = signal<string>('');

  constructor() {
    this.currentUrl.set(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  toggleSubmenu(menuId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.isOpen) {
      this.expandedMenus[menuId] = true;
      this.toggle.emit();
    } else {
      this.expandedMenus[menuId] = !this.expandedMenus[menuId];
    }
  }

  isMenuOrChildActive(menu: any): boolean {
    if (menu.url) {
      const normalized = this.normalizeUrl(menu.url);
      if (this.currentUrl() === normalized || this.currentUrl().startsWith(normalized + '/')) {
        return true;
      }
    }
    if (menu.children && menu.children.length > 0) {
      return menu.children.some((child: any) => {
        if (!child.url) return false;
        const normalized = this.normalizeUrl(child.url);
        return this.currentUrl() === normalized || this.currentUrl().startsWith(normalized + '/');
      });
    }
    return false;
  }

  normalizeUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/app')) return url;
    return url.startsWith('/') ? '/app' + url : '/app/' + url;
  }

  logout() {
    this.showLogoutConfirm.set(true);
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutConfirm.set(false);
  }
}
