/**
 * Respuesta del backend al registrar una auditoría
 */
export interface AuditResponse {
  success: boolean;
  message: string;
  auditId?: number;        // ID del registro de auditoría creado
  timestamp?: string;
}
