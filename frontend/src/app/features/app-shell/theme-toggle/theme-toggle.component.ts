import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle-btn" (click)="toggleTheme()" [attr.aria-label]="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
      <!-- Icono de Luna (para pasar a Dark) -->
      <svg *ngIf="!isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <!-- Icono de Sol (para pasar a Light) -->
      <svg *ngIf="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: none;
      border: none;
      color: var(--text-title);
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s, transform 0.2s ease;
    }
    .theme-toggle-btn:hover {
      background-color: var(--bg-primary);
    }
    .theme-toggle-btn:active {
      transform: scale(0.9);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Restaurar preferencia del usuario
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'dark') {
      this.isDark = true;
      this.renderer.addClass(this.document.body, 'dark-theme');
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      localStorage.setItem('app-theme', 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
      localStorage.setItem('app-theme', 'light');
    }
  }
}
