import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PurchasingService, Supplier } from '../../purchasing.service';
import { GenericTableComponent, TableColumn } from '@shared/components/generic-table.component';
import { ModalComponent } from '@shared/components/modal.component';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTableComponent, ModalComponent],
  templateUrl: './suppliers.component.html'
})
export class SuppliersComponent implements OnInit {
  private purchasingService = inject(PurchasingService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  suppliers = signal<Supplier[]>([]);
  showForm = signal(false);
  isSaving = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    taxId: [''],
    contactName: [''],
    email: ['', Validators.email],
    phone: [''],
  });

  columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'taxId', header: 'CUIT/RUT', sortable: true },
    { field: 'contactName', header: 'Contacto', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'phone', header: 'Teléfono', sortable: true },
  ];

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.purchasingService.getSuppliers().subscribe(data => this.suppliers.set(data));
  }

  openForm() {
    this.form.reset();
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSaving.set(true);
    this.purchasingService.createSupplier(this.form.value as Partial<Supplier>).subscribe({
      next: () => {
        this.toastService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado' });
        this.loadSuppliers();
        this.closeForm();
        this.isSaving.set(false);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el proveedor' });
        this.isSaving.set(false);
      }
    });
  }
}
