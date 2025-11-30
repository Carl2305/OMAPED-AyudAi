/**
 * Representa un cambio individual en un campo del formulario
 */
export interface AuditFieldChange {
  campo: string;           // Nombre del campo (ej: 'direccion_actual')
  campoLegible: string;    // Nombre legible (ej: 'Dirección Actual')
  valorAnterior: any;      // Valor antes del cambio (puede ser null, string, number, array, etc.)
  valorNuevo: any;         // Valor después del cambio
  tipoCambio: 'CREADO' | 'MODIFICADO' | 'ELIMINADO'; // Tipo de cambio
}

/**
 * Estructura para enviar al backend de auditoría
 */
export interface AuditRequest {
  tipoOperacion: 'CREACION' | 'ACTUALIZACION' | 'ELIMINACION';
  modulo: string;          // Ej: 'BENEFICIARIO', 'CLASIFICACION', etc.
  entidadId: number;       // ID del registro afectado
  entidadTipo: string;     // Tipo de entidad (ej: 'Beneficiario', 'Usuario')
  usuario?: string;        // Usuario que realizó el cambio (opcional, puede venir del token)
  cambios: AuditFieldChange[]; // Lista de cambios individuales
  metadata?: {             // Información adicional contextual
    ip?: string;
    navegador?: string;
    timestamp?: string;
    comentario?: string;
  };
}

/**
 * Configuración para personalizar el mapeo de campos
 */
export interface AuditFieldConfig {
  campo: string;
  nombreLegible: string;
  ignorar?: boolean;       // Si es true, este campo no se auditará
  esArray?: boolean;       // Si es true, se tratará como array
  formatoValor?: (valor: any) => string; // Función personalizada para formatear el valor
}
