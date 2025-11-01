import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  /**
   * Exporta datos a un archivo Excel
   * @param data Array de objetos a exportar
   * @param fileName Nombre del archivo (sin extensión)
   * @param sheetName Nombre de la hoja
   * @param customHeaders Objeto con mapeo de claves a nombres de columnas personalizados
   */
  exportToExcel<T>(
    data: T[],
    fileName: string = 'export',
    sheetName: string = 'Sheet1',
    customHeaders?: { [key: string]: string }
  ): void {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    // Crear una copia de los datos para no modificar los originales
    let exportData = data.map(item => ({ ...item }));

    // Si hay headers personalizados, renombrar las claves
    if (customHeaders) {
      exportData = exportData.map(item => {
        const newItem: any = {};
        Object.keys(item as any).forEach(key => {
          const newKey = customHeaders[key] || key;
          newItem[newKey] = (item as any)[key];
        });
        return newItem;
      });
    }

    // Crear workbook y worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Ajustar ancho de columnas automáticamente
    const colWidths = this.getColumnWidths(exportData);
    ws['!cols'] = colWidths;

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generar nombre de archivo con timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Escribir archivo
    XLSX.writeFile(wb, fullFileName);
  }

  /**
   * Calcula el ancho de las columnas basándose en el contenido
   */
  private getColumnWidths(data: any[]): { wch: number }[] {
    if (data.length === 0) return [];

    const keys = Object.keys(data[0]);
    const widths: { wch: number }[] = [];

    keys.forEach(key => {
      // Obtener la longitud máxima entre el header y los valores
      let maxLength = key.length;
      data.forEach(item => {
        const value = item[key]?.toString() || '';
        if (value.length > maxLength) {
          maxLength = value.length;
        }
      });
      // Agregar un padding y limitar el ancho máximo
      widths.push({ wch: Math.min(maxLength + 2, 50) });
    });

    return widths;
  }

  /**
   * Exporta datos a Excel con estilos personalizados
   * @param data Array de objetos a exportar
   * @param fileName Nombre del archivo
   * @param sheetName Nombre de la hoja
   * @param customHeaders Headers personalizados
   * @param title Título del documento
   */
  exportToExcelWithStyles<T>(
    data: T[],
    fileName: string = 'export',
    sheetName: string = 'Sheet1',
    customHeaders?: { [key: string]: string },
    title?: string
  ): void {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    // Preparar datos
    let exportData = data.map(item => ({ ...item }));

    if (customHeaders) {
      exportData = exportData.map(item => {
        const newItem: any = {};
        Object.keys(item as any).forEach(key => {
          const newKey = customHeaders[key] || key;
          newItem[newKey] = (item as any)[key];
        });
        return newItem;
      });
    }

    // Crear workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    // Crear worksheet
    let ws: XLSX.WorkSheet;
    
    if (title) {
     // Obtener headers
      const headers = Object.keys(exportData[0] as any);
      
      // Convertir datos a array de arrays
      const dataRows = exportData.map(item => {
        return headers.map(header => (item as any)[header]);
      });
      
      // Crear estructura completa: título, fila vacía, headers, datos
      const wsData: any[][] = [
        [title],           // Fila 1: Título
        [],                // Fila 2: Vacía
        headers,           // Fila 3: Headers
        ...dataRows        // Fila 4+: Datos
      ];
      
      // Crear worksheet desde array de arrays
      ws = XLSX.utils.aoa_to_sheet(wsData);
    } else {
      ws = XLSX.utils.json_to_sheet(exportData);
    }

    // Ajustar anchos de columna
    const colWidths = this.getColumnWidths(exportData);
    ws['!cols'] = colWidths;

    // Agregar worksheet
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generar nombre de archivo
    const timestamp = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Escribir archivo
    XLSX.writeFile(wb, fullFileName);
  }
}
