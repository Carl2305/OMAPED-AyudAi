import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassificationPrioritizationService } from '@features/classification-prioritization/services/classification-prioritization.service';
import { AuditHistoryItem } from '@core/models/audit/audit-history.interface';

@Component({
  selector: 'app-audit-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-history-modal.component.html',
  styleUrl: './audit-history-modal.component.scss'
})
export class AuditHistoryModalComponent implements OnInit {
  @Input() beneficiaryId!: number;
  @Input() beneficiaryName: string = '';
  @Output() closeModal = new EventEmitter<void>();

  historyData: AuditHistoryItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private classificationService: ClassificationPrioritizationService
  ) {}

  ngOnInit(): void {
    if (this.beneficiaryId) {
      this.loadAuditHistory();
    }
  }

  async loadAuditHistory(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.classificationService.getAuditHistory(this.beneficiaryId);
      this.historyData = response.data || [];
      console.log('📋 Historial cargado:', response.data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      this.errorMessage = 'No se pudo cargar el historial de cambios. Intente nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Cerrar solo si se hace clic en el backdrop, no en el contenido del modal
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getOperationIcon(operation: string): string {
    switch (operation) {
      case 'CREACION':
        return '➕';
      case 'ACTUALIZACION':
        return '✏️';
      case 'ELIMINACION':
        return '🗑️';
      default:
        return '📝';
    }
  }

  getOperationClass(operation: string): string {
    switch (operation) {
      case 'CREACION':
        return 'operation-create';
      case 'ACTUALIZACION':
        return 'operation-update';
      case 'ELIMINACION':
        return 'operation-delete';
      default:
        return 'operation-default';
    }
  }

  getChangeTypeClass(tipoCambio: string): string {
    switch (tipoCambio) {
      case 'CREADO':
        return 'change-created';
      case 'MODIFICADO':
        return 'change-modified';
      case 'ELIMINADO':
        return 'change-deleted';
      default:
        return 'change-default';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  parseValue(value: string): string {
    try {
      // Intentar parsear como JSON para limpiar comillas extras
      const parsed = JSON.parse(value);
      
      // Si es un array, mostrarlo más amigable
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }
      
      return parsed;
    } catch {
      // Si no es JSON válido, retornar el valor original sin comillas
      return value.replace(/^"|"$/g, '');
    }
  }
}
