import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassificationPrioritizationService } from '@features/classification-prioritization/services/classification-prioritization.service';
import { BeneficiaryListItem, PagedResponse } from '@core/models/beneficiary/beneficiary-list-item.interface';
import { ExcelExportService } from '@shared/utils/services/excel-export/excel-export.service';
import { AuditHistoryModalComponent } from './modals/audit-history-modal/audit-history-modal.component';
import { ShapExplanationModalComponent } from './modals/shap-explanation-modal/shap-explanation-modal.component';

@Component({
  selector: 'app-classification-prioritization',
  standalone: true,
  imports: [CommonModule, FormsModule, AuditHistoryModalComponent, ShapExplanationModalComponent],
  templateUrl: './classification-prioritization.component.html',
  styleUrl: './classification-prioritization.component.scss'
})
export class ClassificationPrioritizationComponent implements OnInit {
  // Datos de la tabla
  beneficiaries: BeneficiaryListItem[] = [];
  
  // Propiedades de paginación
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;
  
  // Estados
  isLoading: boolean = false;
  isExporting: boolean = false;
  errorMessage: string = '';
  
  // Búsqueda
  searchDocument: string = '';
  private searchTimeout: any;
  
  // Ordenamiento
  sortColumn: string = 'nivelRiesgo';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Modal de auditoría
  showAuditModal: boolean = false;
  selectedBeneficiaryId: number | null = null;
  selectedBeneficiaryName: string = '';
  
  // Modal de explicación SHAP
  showShapModal: boolean = false;
  shapBeneficiaryId: number | null = null;
  shapBeneficiaryName: string = '';
  
  // Opciones de tamaño de página
  pageSizeOptions: number[] = [10, 20, 50, 100];

  constructor(
    private classificationService: ClassificationPrioritizationService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  /**
   * Carga los beneficiarios desde el servidor
   */
  async loadBeneficiaries(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.classificationService.getBeneficiariesPaged(
        this.currentPage,
        this.pageSize
      );

      if (response.success && response.data) {
        const pagedData = response.data;
        
        // Aplicar filtro local por número de documento si existe búsqueda
        let filteredItems = pagedData.items;
        if (this.searchDocument && this.searchDocument.trim() !== '') {
          const searchTerm = this.searchDocument.trim().toLowerCase();
          filteredItems = pagedData.items.filter(beneficiary => 
            beneficiary.numeroDocumento.toLowerCase().includes(searchTerm)
          );
        }
        
        // Ordenar por nivel de riesgo: ALTO > MEDIO > BAJO
        filteredItems = this.sortByRiskLevel(filteredItems);
        
        this.beneficiaries = filteredItems;
        this.currentPage = pagedData.pageNumber;
        this.pageSize = pagedData.pageSize;
        this.totalCount = this.searchDocument ? filteredItems.length : pagedData.totalCount;
        this.totalPages = pagedData.totalPages;
        this.hasPreviousPage = pagedData.hasPreviousPage;
        this.hasNextPage = pagedData.hasNextPage;
      } else {
        this.errorMessage = response.message || 'Error al cargar los beneficiarios';
      }
    } catch (error) {
      console.error('Error al cargar beneficiarios:', error);
      this.errorMessage = 'Ocurrió un error al cargar los beneficiarios. Por favor, intente nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navega a una página específica
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadBeneficiaries();
    }
  }

  /**
   * Navega a la página anterior
   */
  previousPage(): void {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Navega a la página siguiente
   */
  nextPage(): void {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Cambia el tamaño de página
   */
  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = parseInt(select.value, 10);
    this.currentPage = 1; // Reset a la primera página
    this.loadBeneficiaries();
  }

  /**
   * Maneja el cambio en el input de búsqueda con debounce
   */
  onSearchChange(): void {
    // Limpiar el timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Establecer un nuevo timeout para buscar después de 500ms
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1; // Reset a la primera página al buscar
      this.loadBeneficiaries();
    }, 500);
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchDocument = '';
    this.currentPage = 1;
    this.loadBeneficiaries();
  }

  /**
   * Genera el array de números de página para mostrar
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con ellipsis
      const halfWindow = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, this.currentPage - halfWindow);
      let endPage = Math.min(this.totalPages, this.currentPage + halfWindow);
      
      // Ajustar si estamos cerca del inicio o fin
      if (this.currentPage <= halfWindow) {
        endPage = maxPagesToShow;
      } else if (this.currentPage >= this.totalPages - halfWindow) {
        startPage = this.totalPages - maxPagesToShow + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  /**
   * Obtiene el rango de items mostrados (ej: "1-20 de 100")
   */
  getDisplayRange(): string {
    if (this.totalCount === 0) return '0 de 0';
    
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalCount);
    
    return `${start}-${end} de ${this.totalCount}`;
  }

  /**
   * Exporta los beneficiarios actuales (página actual) a Excel
   */
  exportCurrentPageToExcel(): void {
    if (this.beneficiaries.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    const customHeaders = {
      tipoDocumento: 'Tipo de Documento',
      numeroDocumento: 'Número de Documento',
      nombreCompleto: 'Nombre Completo',
      tipoDiscapacidad: 'Tipo de Discapacidad',
      edad: 'Edad',
      nivelRiesgo: 'Nivel de Riesgo',
      scoreModelo: 'Score del Modelo',
      rangoIngresos: 'Rango de Ingresos',
      serviciosBasicos: 'Servicios Básicos'
    };

    this.excelExportService.exportToExcel(
      this.beneficiaries,
      'beneficiarios_pagina_actual',
      'Beneficiarios',
      customHeaders
    );
  }

  /**
   * Exporta todos los beneficiarios (todas las páginas) a Excel
   */
  async exportAllToExcel(): Promise<void> {
    if (this.totalCount === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    this.isExporting = true;

    try {
      // Obtener todos los beneficiarios en una sola petición
      const response = await this.classificationService.getBeneficiariesPaged(
        1,
        this.totalCount // Solicitar todos los registros
      );

      if (response.success && response.data) {
        const allBeneficiaries = response.data.items;
        
        const customHeaders = {
          tipoDocumento: 'Tipo de Documento',
          numeroDocumento: 'Número de Documento',
          nombreCompleto: 'Nombre Completo',
          tipoDiscapacidad: 'Tipo de Discapacidad',
          edad: 'Edad',
          serviciosBasicos: 'Servicios Básicos',
          nivelRiesgo: 'Nivel de Riesgo',
          scoreModelo: 'Score del Modelo',
          rangoIngresos: 'Rango de Ingresos'
        };

        this.excelExportService.exportToExcelWithStyles(
          allBeneficiaries,
          'beneficiarios_completo',
          'Beneficiarios',
          customHeaders,
          'Lista Completa de Beneficiarios - Sistema OMAPED'
        );
      } else {
        console.error('Error al exportar:', response.message);
        this.errorMessage = 'No se pudo exportar los datos. Por favor, intente nuevamente.';
      }
    } catch (error) {
      console.error('Error al exportar todos los beneficiarios:', error);
      this.errorMessage = 'Ocurrió un error al exportar. Por favor, intente nuevamente.';
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Abre el modal de bitácora de cambios
   */
  openAuditHistory(beneficiary: BeneficiaryListItem): void {
    this.selectedBeneficiaryId = beneficiary.idBeneficiario;
    this.selectedBeneficiaryName = beneficiary.nombreCompleto;
    this.showAuditModal = true;
  }

  /**
   * Cierra el modal de bitácora de cambios
   */
  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedBeneficiaryId = null;
    this.selectedBeneficiaryName = '';
  }

  /**
   * Abre el modal de explicación SHAP
   */
  openShapExplanation(beneficiary: BeneficiaryListItem): void {
    this.shapBeneficiaryId = beneficiary.idBeneficiario;
    this.shapBeneficiaryName = beneficiary.nombreCompleto;
    this.showShapModal = true;
  }

  /**
   * Cierra el modal de explicación SHAP
   */
  closeShapModal(): void {
    this.showShapModal = false;
    this.shapBeneficiaryId = null;
    this.shapBeneficiaryName = '';
  }

  /**
   * Obtiene la clase CSS según el nivel de riesgo
   */
  getRiskClass(nivelRiesgo: string): string {
    const riesgo = nivelRiesgo?.toUpperCase();
    switch (riesgo) {
      case 'ALTO':
        return 'risk-high';
      case 'MEDIO':
        return 'risk-medium';
      case 'BAJO':
        return 'risk-low';
      default:
        return 'risk-unknown';
    }
  }

  /**
   * Ordena los beneficiarios por nivel de riesgo: ALTO > MEDIO > BAJO
   */
  private sortByRiskLevel(beneficiaries: BeneficiaryListItem[]): BeneficiaryListItem[] {
    const riskOrder: { [key: string]: number } = {
      'ALTO': 1,
      'MEDIO': 2,
      'BAJO': 3
    };

    return beneficiaries.sort((a, b) => {
      const riskA = a.nivelRiesgo?.toUpperCase() || 'ZZZZZ';
      const riskB = b.nivelRiesgo?.toUpperCase() || 'ZZZZZ';
      
      const orderA = riskOrder[riskA] || 999;
      const orderB = riskOrder[riskB] || 999;
      
      return orderA - orderB;
    });
  }

  /**
   * Ordena la tabla por la columna seleccionada
   */
  sortBy(column: string): void {
    // Si es la misma columna, invertir dirección
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Nueva columna, ordenar ascendente por defecto
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.beneficiaries = this.sortBeneficiaries(this.beneficiaries);
  }

  /**
   * Ordena los beneficiarios según la columna y dirección seleccionadas
   */
  private sortBeneficiaries(beneficiaries: BeneficiaryListItem[]): BeneficiaryListItem[] {
    return beneficiaries.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Obtener valores según la columna
      switch (this.sortColumn) {
        case 'tipoDocumento':
          valueA = a.tipoDocumento || '';
          valueB = b.tipoDocumento || '';
          break;
        case 'numeroDocumento':
          valueA = a.numeroDocumento || '';
          valueB = b.numeroDocumento || '';
          break;
        case 'nombreCompleto':
          valueA = a.nombreCompleto || '';
          valueB = b.nombreCompleto || '';
          break;
        case 'tipoDiscapacidad':
          valueA = a.tipoDiscapacidad || '';
          valueB = b.tipoDiscapacidad || '';
          break;
        case 'edad':
          valueA = a.edad || 0;
          valueB = b.edad || 0;
          break;
        case 'nivelRiesgo':
          // Ordenamiento especial para nivel de riesgo
          const riskOrder: { [key: string]: number } = { 'ALTO': 1, 'MEDIO': 2, 'BAJO': 3 };
          valueA = riskOrder[a.nivelRiesgo?.toUpperCase() || ''] || 999;
          valueB = riskOrder[b.nivelRiesgo?.toUpperCase() || ''] || 999;
          break;
        case 'scoreModelo':
          valueA = a.scoreModelo || 0;
          valueB = b.scoreModelo || 0;
          break;
        case 'rangoIngresos':
          valueA = a.rangoIngresos || '';
          valueB = b.rangoIngresos || '';
          break;
        case 'serviciosBasicos':
          valueA = a.serviciosBasicos || '';
          valueB = b.serviciosBasicos || '';
          break;
        default:
          return 0;
      }

      // Comparar valores
      let comparison = 0;
      if (typeof valueA === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        comparison = valueA - valueB;
      }

      // Aplicar dirección
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}
