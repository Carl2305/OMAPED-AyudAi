import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from '@environments/environment.dev';
import { AuditLog } from '@core/models/security/audit-logger.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core/services/auth/auth.service';
import { SecurityEvent } from '@core/models/security/security-event.interface';

@Injectable({
  providedIn: 'root'
})
export class AuditLoggerService {
  private readonly apiUrl = `${environment.apiUrl}/audit`;
  private pendingLogs: AuditLog[] = [];
  private sessionId: string;
  private logQueue$ = new BehaviorSubject<AuditLog[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.sessionId = this.generateSessionId();
    this.initializePeriodicFlush();
  }

  /**
   * Registra una llamada a la API
   */
  logApiCall(method: string, url: string, requestBody?: any, responseStatus?: number): void {
    const currentUser = this.getCurrentUser();

    const logEntry: AuditLog = {
      userId: currentUser?.id || 'anonymous',
      username: currentUser?.username || 'anonymous',
      action: `API_${method.toUpperCase()}`,
      resource: this.cleanUrl(url),
      details: {
        method,
        url,
        requestBody: this.sanitizeRequestBody(requestBody),
        responseStatus,
        timestamp: new Date()
      },
      timestamp: new Date(),
      severity: this.determineApiCallSeverity(method, url, responseStatus),
      module: this.extractModuleFromUrl(url),
      success: responseStatus ? responseStatus < 400 : true,
      sessionId: this.sessionId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.addToQueue(logEntry);
  }

  /**
   * Registra eventos de seguridad específicos
   */
  logSecurityEvent(event: SecurityEvent): void {
    const currentUser = this.getCurrentUser();

    const logEntry: AuditLog = {
      userId: currentUser?.id || 'anonymous',
      username: currentUser?.username || 'anonymous',
      action: event.type,
      resource: 'SECURITY',
      details: event.details,
      timestamp: new Date(),
      severity: event.severity,
      module: 'SECURITY',
      success: !event.type.includes('FAILURE') && !event.type.includes('VIOLATION'),
      sessionId: this.sessionId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.addToQueue(logEntry);

    // Eventos críticos se envían inmediatamente
    if (event.severity === 'CRITICAL') {
      this.flushLogs();
    }
  }

  /**
   * Registra operaciones financieras específicas
   */
  logFinancialOperation(operation: string, details: any, success: boolean = true): void {
    const currentUser = this.getCurrentUser();

    const logEntry: AuditLog = {
      userId: currentUser?.id || 'unknown',
      username: currentUser?.username || 'unknown',
      action: `FINANCIAL_${operation.toUpperCase()}`,
      resource: 'FINANCIAL_DATA',
      details: {
        operation,
        ...this.sanitizeFinancialDetails(details),
        amount: details.amount ? '***MASKED***' : undefined
      },
      timestamp: new Date(),
      severity: 'HIGH',
      module: 'FINANCIAL',
      success,
      sessionId: this.sessionId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.addToQueue(logEntry);
  }

  /**
   * Registra errores del sistema
   */
  logError(error: any, context: string): void {
    const currentUser = this.getCurrentUser();

    const logEntry: AuditLog = {
      userId: currentUser?.id || 'system',
      username: currentUser?.username || 'system',
      action: 'SYSTEM_ERROR',
      resource: context,
      details: {
        error: error.message || error,
        stack: error.stack,
        context,
        timestamp: new Date()
      },
      timestamp: new Date(),
      severity: 'MEDIUM',
      module: 'SYSTEM',
      success: false,
      errorMessage: error.message || 'Unknown error',
      sessionId: this.sessionId
    };

    this.addToQueue(logEntry);
  }

  /**
   * Registra acceso a datos sensibles
   */
  logDataAccess(resource: string, action: 'VIEW' | 'DOWNLOAD' | 'EXPORT', details?: any): void {
    const currentUser = this.getCurrentUser();

    const logEntry: AuditLog = {
      userId: currentUser?.id || 'unknown',
      username: currentUser?.username || 'unknown',
      action: `DATA_${action}`,
      resource,
      details: {
        action,
        resource,
        ...details,
        timestamp: new Date()
      },
      timestamp: new Date(),
      severity: 'HIGH',
      module: 'DATA_ACCESS',
      success: true,
      sessionId: this.sessionId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.addToQueue(logEntry);
  }

  /**
   * Obtiene logs de auditoría con filtros
   */
  getAuditLogs(filters?: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: string;
    module?: string;
  }): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/logs`, { params: filters as any })
      .pipe(
        catchError(error => {
          console.error('Error fetching audit logs:', error);
          throw error;
        })
      );
  }

  /**
   * Fuerza el envío inmediato de logs pendientes
   */
  flushLogs(): void {
    if (this.pendingLogs.length === 0) return;

    const logsToSend = [...this.pendingLogs];
    this.pendingLogs = [];

    this.http.post(`${this.apiUrl}/batch`, logsToSend)
      .pipe(
        catchError(error => {
          // Si falla el envío, reintentamos agregando los logs de vuelta
          console.error('Error sending audit logs:', error);
          this.pendingLogs.unshift(...logsToSend);
          throw error;
        })
      )
      .subscribe({
        next: () => {
          console.log(`Successfully sent ${logsToSend.length} audit logs`);
        },
        error: (error) => {
          console.error('Failed to send audit logs:', error);
        }
      });
  }

  // Métodos privados
  private addToQueue(logEntry: AuditLog): void {
    this.pendingLogs.push(logEntry);
    this.logQueue$.next([...this.pendingLogs]);

    // Envía automáticamente si hay muchos logs pendientes
    if (this.pendingLogs.length >= 10) {
      this.flushLogs();
    }
  }

  private initializePeriodicFlush(): void {
    // Envía logs cada 30 segundos
    setInterval(() => {
      if (this.pendingLogs.length > 0) {
        this.flushLogs();
      }
    }, 30000);

    // También envía logs antes de cerrar la página
    window.addEventListener('beforeunload', () => {
      this.flushLogs();
    });
  }

  private getCurrentUser(): any {
    // Obtiene el usuario actual del AuthService
    let currentUser = null;
    this.authService.currentUser$.subscribe(user => {
      currentUser = user;
    }).unsubscribe();
    return currentUser;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  private cleanUrl(url: string): string {
    // Remueve parámetros sensibles de la URL
    return url.split('?')[0].replace(/\/\d+/g, '/:id');
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return null;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token'];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***MASKED***';
      }
    });

    return sanitized;
  }

  private sanitizeFinancialDetails(details: any): any {
    const sanitized = { ...details };
    const financialFields = ['accountNumber', 'routingNumber', 'cardNumber', 'amount'];

    financialFields.forEach(field => {
      if (sanitized[field]) {
        if (field === 'amount') {
          sanitized[field] = '***AMOUNT***';
        } else {
          sanitized[field] = this.maskSensitiveData(sanitized[field]);
        }
      }
    });

    return sanitized;
  }

  private maskSensitiveData(data: string): string {
    if (!data || data.length < 4) return '***MASKED***';
    return data.substring(0, 4) + '***' + data.substring(data.length - 4);
  }

  private determineApiCallSeverity(method: string, url: string, status?: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (status && status >= 500) return 'CRITICAL';
    if (status && status >= 400) return 'HIGH';
    if (method === 'DELETE') return 'HIGH';
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') return 'MEDIUM';
    if (url.includes('financial') || url.includes('transaction')) return 'HIGH';
    return 'LOW';
  }

  private extractModuleFromUrl(url: string): string {
    const pathSegments = url.split('/');
    return pathSegments[2] || 'UNKNOWN'; // Asume /api/module/...
  }

  private getClientIP(): string {
    // En un entorno real, esto debería obtenerse del servidor
    return 'CLIENT_IP';
  }
};
