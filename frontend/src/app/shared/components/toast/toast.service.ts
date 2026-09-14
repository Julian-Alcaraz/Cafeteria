import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  severity: 'success' | 'error' | 'info' | 'warn';
  summary: string;
  detail: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  add(message: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const fullMessage = { ...message, id };
    
    this.messages.update(msgs => [...msgs, fullMessage]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: string) {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }
}
