import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaConfigService, AuditIgnoreRule } from './auditoria-config.service';
import { AuditoriaConfigTableComponent } from './components/auditoria-config-table.component';
import { AuditoriaConfigFormComponent } from './components/auditoria-config-form.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal.component';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-auditoria-config',
  standalone: true,
  imports: [CommonModule, AuditoriaConfigTableComponent, AuditoriaConfigFormComponent, ConfirmModalComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h2>Reglas de Exclusión de Auditoría</h2>
        <button class="btn btn-primary" (click)="openForm()">Nueva Regla</button>
      </div>

      <p class="description">
        Las rutas configuradas aquí no serán registradas en la tabla de logs de auditoría. 
        Útil para peticiones muy frecuentes o sensibles como login.
      </p>

      <app-auditoria-config-table
        [rules]="rules()"
        (edit)="openForm($event)"
        (delete)="deleteRule($event)"
      ></app-auditoria-config-table>

      @if (showForm()) {
        <app-auditoria-config-form
          [rule]="editingRule()"
          (save)="saveRule($event)"
          (cancel)="closeForm()"
        ></app-auditoria-config-form>
      }

      @if (ruleToDelete() !== null) {
        <app-confirm-modal
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar esta regla? Las peticiones a esta ruta volverán a ser auditadas."
          confirmText="Eliminar"
          cancelText="Cancelar"
          btnType="danger"
          (confirm)="confirmDeleteRule()"
          (cancel)="ruleToDelete.set(null)"
        ></app-confirm-modal>
      }
    </div>
  `,
  styles: [`
    .container { padding: 2rem; background-color: var(--bg-surface, #ffffff); border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    h2 { color: var(--text-title, #111827); margin: 0; }
    .description { color: #6b7280; margin-bottom: 2rem; }
  `]
})
export class AuditoriaConfigComponent implements OnInit {
  private configService = inject(AuditoriaConfigService);
  private toastService = inject(ToastService);

  rules = signal<AuditIgnoreRule[]>([]);
  showForm = signal(false);
  editingRule = signal<AuditIgnoreRule | null>(null);
  ruleToDelete = signal<number | null>(null);

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.configService.getRules().subscribe({
      next: (res) => this.rules.set(res),
      error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las reglas' })
    });
  }

  openForm(rule?: AuditIgnoreRule) {
    this.editingRule.set(rule || null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingRule.set(null);
    this.ruleToDelete.set(null);
  }

  saveRule(formData: Partial<AuditIgnoreRule>) {
    const rule = this.editingRule();
    if (rule) {
      this.configService.updateRule(rule.id, formData).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Regla actualizada' });
          this.loadRules();
          this.closeForm();
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar' })
      });
    } else {
      this.configService.createRule(formData).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Regla creada' });
          this.loadRules();
          this.closeForm();
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al crear' })
      });
    }
  }

  deleteRule(id: number) {
    this.ruleToDelete.set(id);
  }

  confirmDeleteRule() {
    const id = this.ruleToDelete();
    if (id !== null) {
      this.configService.deleteRule(id).subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Regla eliminada' });
          this.loadRules();
          this.ruleToDelete.set(null);
        },
        error: () => this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la regla' })
      });
    }
  }
}
