import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassificationPrioritizationService } from '@features/classification-prioritization/services/classification-prioritization.service';
import { BeneficiaryListItem, PagedResponse } from '@core/models/beneficiary/beneficiary-list-item.interface';
import { ExcelExportService } from '@shared/utils/services/excel-export/excel-export.service';

@Component({
  selector: 'app-classification-prioritization',
  standalone: true,
  imports: [CommonModule],
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
        this.beneficiaries = pagedData.items;
        this.currentPage = pagedData.pageNumber;
        this.pageSize = pagedData.pageSize;
        this.totalCount = pagedData.totalCount;
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
    this.currentPage = 1; // Volver a la primera página
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
          serviciosBasicos: 'Servicios Básicos'
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
}
