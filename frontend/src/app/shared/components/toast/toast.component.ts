import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (msg of toastService.messages(); track msg.id) {
        <div class="toast-message" [ngClass]="'toast-' + msg.severity">
          <div class="toast-icon">
            <i class="pi" 
               [ngClass]="{
                 'pi-check-circle': msg.severity === 'success',
                 'pi-times-circle': msg.severity === 'error',
                 'pi-info-circle': msg.severity === 'info',
                 'pi-exclamation-triangle': msg.severity === 'warn'
               }"></i>
          </div>
          <div class="toast-content">
            <div class="toast-summary">{{ msg.summary }}</div>
            <div class="toast-detail">{{ msg.detail }}</div>
          </div>
          <button class="toast-close" (click)="toastService.remove(msg.id)">
            <i class="pi pi-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .toast-message {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 320px;
      animation: slideIn 0.3s ease-out;
      border-left: 6px solid;
    }
    .toast-success { border-left-color: #10b981; }
    .toast-success .toast-icon i { color: #10b981; }
    
    .toast-error { border-left-color: #ef4444; }
    .toast-error .toast-icon i { color: #ef4444; }
    
    .toast-info { border-left-color: #3b82f6; }
    .toast-info .toast-icon i { color: #3b82f6; }
    
    .toast-warn { border-left-color: #f59e0b; }
    .toast-warn .toast-icon i { color: #f59e0b; }

    .toast-icon {
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }
    .toast-content {
      flex: 1;
    }
    .toast-summary {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
    }
    .toast-detail {
      color: #4b5563;
      font-size: 0.875rem;
      line-height: 1.4;
    }
    .toast-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0;
      margin-left: 0.5rem;
    }
    .toast-close:hover {
      color: #4b5563;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
