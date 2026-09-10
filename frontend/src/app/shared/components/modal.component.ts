import { Component, input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal-overlay">
      <div class="modal">
        @if (title()) {
          <div class="modal-header">
            <h3>{{ title() }}</h3>
          </div>
        }
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div class="modal-actions">
          <ng-content select="[modal-actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-header h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: var(--text-title);
    }
    .modal-body {
      margin-bottom: 1.5rem;
    }
  `]
})
export class ModalComponent {
  title = input<string>('');
}
