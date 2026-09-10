import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  authService = inject(AuthService);
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  expandedMenus: Record<number, boolean> = {};
  showLogoutConfirm = signal(false);

  toggleSubmenu(menuId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.expandedMenus[menuId] = !this.expandedMenus[menuId];
  }

  logout() {
    this.showLogoutConfirm.set(true);
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutConfirm.set(false);
  }
}
