import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [title]="title()">
      <p>{{ message() }}</p>
      
      <ng-container modal-actions>
        <button type="button" class="btn" (click)="cancel.emit()">{{ cancelText() }}</button>
        <button type="button" class="btn" [ngClass]="confirmButtonClass()" (click)="confirm.emit()">
          {{ confirmText() }}
        </button>
      </ng-container>
    </app-modal>
  `
})
export class ConfirmModalComponent {
  title = input<string>('Confirmar');
  message = input<string>('¿Estás seguro de realizar esta acción?');
  confirmText = input<string>('Aceptar');
  cancelText = input<string>('Cancelar');
  btnType = input<'danger' | 'primary'>('danger');

  confirm = output<void>();
  cancel = output<void>();

  confirmButtonClass() {
    return 'btn-' + this.btnType();
  }
}
