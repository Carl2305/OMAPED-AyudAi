/**
 * Representa un cambio individual en un campo
 */
export interface AuditFieldChange {
  campoLegible: string;
  valorAnterior: string;
  valorNuevo: string;
  tipoCambio: 'CREADO' | 'MODIFICADO' | 'ELIMINADO';
}

/**
 * Representa un registro de auditoría completo
 */
export interface AuditHistoryItem {
  tipoOperacion: 'CREACION' | 'ACTUALIZACION' | 'ELIMINACION';
  entidadId: number;
  usuario: string;
  fechaRegistro: string;
  cambios: AuditFieldChange[];
}
