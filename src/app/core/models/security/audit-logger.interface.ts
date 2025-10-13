export interface AuditLog {
  id?: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  module: string;
  success: boolean;
  errorMessage?: string;
  sessionId?: string;
}
