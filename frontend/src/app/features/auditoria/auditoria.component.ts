import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService, AuditLog } from './auditoria.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {
  private auditoriaService = inject(AuditoriaService);
  private cdr = inject(ChangeDetectorRef);

  logs: AuditLog[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  
  currentPage: number = 1;
  pageSize: number = 10;
  
  methods = [
    { label: 'Todos', value: null },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' }
  ];
  selectedMethod: string | null = null;
  
  statuses = [
    { label: 'Todos', value: null },
    { label: 'Éxito', value: 'true' },
    { label: 'Error', value: 'false' }
  ];
  selectedStatus: string | null = null;

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.cdr.markForCheck();
    
    const skip = (this.currentPage - 1) * this.pageSize;
    const take = this.pageSize;

    this.auditoriaService.getLogs(skip, take, this.selectedMethod || undefined, this.selectedStatus || undefined)
      .subscribe({
        next: (res) => {
          this.logs = res.data.items;
          this.totalRecords = res.data.total;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching logs', err);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadLogs();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLogs();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadLogs();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }
}
