import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  authService = inject(AuthService);
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  expandedMenus: Record<number, boolean> = {};

  toggleSubmenu(menuId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.expandedMenus[menuId] = !this.expandedMenus[menuId];
  }

  logout() {
    this.authService.logout();
  }
}
