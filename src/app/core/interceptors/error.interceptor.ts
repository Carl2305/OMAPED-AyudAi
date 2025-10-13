import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, retry, throwError } from 'rxjs';
import { AuditLoggerService } from '@shared/utils/services/audit-logger/audit-logger.service';

export interface ErrorContext {
  url: string;
  method: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
  // const auditLogger = inject(AuditLoggerService);
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // return next(req).pipe(
  //   retry({
  //     count: 2,
  //     delay: (error) => {
  //       // Solo reintenta para errores 5xx y errores de red
  //       if (error.status >= 500 || error.status === 0) {
  //         return throwError(() => error);
  //       }
  //       return throwError(() => error);
  //     }
  //   }),
  //   catchError((error: HttpErrorResponse) => {
  //     const errorContext: ErrorContext = {
  //       url: req.url,
  //       method: req.method,
  //       timestamp: new Date(),
  //       userId: getCurrentUserId(authService),
  //       sessionId: getSessionId()
  //     };

  //     // Log del error para auditoría
  //     auditLogger.logError({
  //       message: error.message,
  //       status: error.status,
  //       url: error.url,
  //       error: error.error
  //     }, `HTTP_${req.method}_${req.url}`);

  //     // Manejo específico por tipo de error
  //     switch (error.status) {
  //       case 0:
  //         // Error de conexión
  //         handleNetworkError(error, errorContext, auditLogger);
  //         break;

  //       case 400:
  //         // Bad Request
  //         handleBadRequest(error, errorContext, auditLogger);
  //         break;

  //       case 401:
  //         // No autorizado - token expirado o inválido
  //         handleUnauthorized(error, errorContext, auditLogger, authService, router);
  //         break;

  //       case 403:
  //         // Prohibido - falta de permisos
  //         handleForbidden(error, errorContext, auditLogger, router);
  //         break;

  //       case 404:
  //         // No encontrado
  //         handleNotFound(error, errorContext, auditLogger);
  //         break;

  //       case 409:
  //         // Conflicto - datos duplicados o estado inconsistente
  //         handleConflict(error, errorContext, auditLogger);
  //         break;

  //       case 422:
  //         // Entidad no procesable - errores de validación
  //         handleUnprocessableEntity(error, errorContext, auditLogger);
  //         break;

  //       case 429:
  //         // Demasiadas solicitudes - rate limiting
  //         handleRateLimitExceeded(error, errorContext, auditLogger);
  //         break;

  //       case 500:
  //       case 502:
  //       case 503:
  //       case 504:
  //         // Errores del servidor
  //         handleServerError(error, errorContext, auditLogger);
  //         break;

  //       default:
  //         handleGenericError(error, errorContext, auditLogger);
  //         break;
  //     }

  //     // Personaliza el mensaje de error para el usuario
  //     const userFriendlyError = createUserFriendlyError(error);

  //     return throwError(() => userFriendlyError);
  //   })
  // );
};

// Funciones auxiliares para manejo de errores específicos

function handleNetworkError(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logSecurityEvent({
    type: 'API_ERROR',
    severity: 'HIGH',
    details: {
      type: 'NETWORK_ERROR',
      message: 'Connection failed - possible network or server issue',
      context,
      timestamp: new Date()
    }
  });

  console.error('Network Error:', {
    message: 'No connection to server',
    context,
    originalError: error
  });
}

function handleUnauthorized(
  error: HttpErrorResponse,
  context: ErrorContext,
  auditLogger: AuditLoggerService,
  authService: AuthService,
  router: Router
): void {
  auditLogger.logSecurityEvent({
    type: 'UNAUTHORIZED_ACCESS',
    severity: 'HIGH',
    details: {
      reason: 'Token expired or invalid',
      context,
      timestamp: new Date()
    }
  });

  // Limpiar datos de autenticación y redirigir al login
  authService.logout();
  router.navigate(['/auth/login'], {
    queryParams: {
      returnUrl: router.url,
      reason: 'session-expired'
    }
  });

  console.warn('Unauthorized access - redirecting to login:', context);
}

function handleForbidden(
  error: HttpErrorResponse,
  context: ErrorContext,
  auditLogger: AuditLoggerService,
  router: Router
): void {
  auditLogger.logSecurityEvent({
    type: 'UNAUTHORIZED_ACCESS',
    severity: 'CRITICAL',
    details: {
      reason: 'Insufficient permissions',
      context,
      attemptedResource: context.url,
      timestamp: new Date()
    }
  });

  router.navigate(['/unauthorized']);
  console.warn('Forbidden access attempt:', context);
}

function handleBadRequest(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logError({
    message: 'Bad Request - Invalid data sent',
    status: 400,
    details: error.error,
    context
  }, 'BAD_REQUEST');

  console.warn('Bad Request:', {
    context,
    validationErrors: error.error?.errors || error.error
  });
}

function handleNotFound(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logError({
    message: 'Resource not found',
    status: 404,
    context
  }, 'NOT_FOUND');

  console.warn('Resource not found:', context);
}

function handleConflict(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logError({
    message: 'Data conflict - resource already exists or state mismatch',
    status: 409,
    details: error.error,
    context
  }, 'CONFLICT');

  console.warn('Data conflict:', {
    context,
    conflictDetails: error.error
  });
}

function handleUnprocessableEntity(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logError({
    message: 'Validation failed',
    status: 422,
    details: error.error?.errors || error.error,
    context
  }, 'VALIDATION_ERROR');

  console.warn('Validation failed:', {
    context,
    validationErrors: error.error?.errors || error.error
  });
}

function handleRateLimitExceeded(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logSecurityEvent({
    type: 'SECURITY_VIOLATION',
    severity: 'HIGH',
    details: {
      type: 'RATE_LIMIT_EXCEEDED',
      context,
      timestamp: new Date()
    }
  });

  console.warn('Rate limit exceeded:', context);
}

function handleServerError(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logError({
    message: `Server error ${error.status}`,
    status: error.status,
    details: error.error,
    context
  }, 'SERVER_ERROR');

  console.error('Server Error:', {
    status: error.status,
    context,
    serverError: error.error
  });
}

function handleGenericError(error: HttpErrorResponse, context: ErrorContext, auditLogger: AuditLoggerService): void {
  auditLogger.logError({
    message: `Unexpected HTTP error ${error.status}`,
    status: error.status,
    details: error.error,
    context
  }, 'GENERIC_HTTP_ERROR');

  console.error('Generic HTTP Error:', {
    status: error.status,
    context,
    error: error.error
  });
}

function createUserFriendlyError(error: HttpErrorResponse): HttpErrorResponse {
  let userMessage = 'Ha ocurrido un error. Por favor intenta nuevamente.';

  switch (error.status) {
    case 0:
      userMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
      break;
    case 400:
      userMessage = 'Los datos enviados no son válidos. Revisa la información ingresada.';
      break;
    case 401:
      userMessage = 'Tu sesión ha expirado. Serás redirigido al login.';
      break;
    case 403:
      userMessage = 'No tienes permisos para realizar esta acción.';
      break;
    case 404:
      userMessage = 'El recurso solicitado no fue encontrado.';
      break;
    case 409:
      userMessage = 'Los datos ya existen o hay un conflicto con la información actual.';
      break;
    case 422:
      userMessage = 'Hay errores en los datos ingresados. Revisa la información.';
      break;
    case 429:
      userMessage = 'Has realizado demasiadas solicitudes. Espera un momento e intenta nuevamente.';
      break;
    case 500:
      userMessage = 'Error interno del servidor. Contacta al soporte técnico.';
      break;
    case 502:
      userMessage = 'El servidor intermediario no pudo obtener una respuesta válida. Nuestros equipos ya están trabajando para solucionarlo.';
      break;
    case 503:
      userMessage = 'El servicio no está disponible temporalmente debido a mantenimiento o sobrecarga. Por favor, intenta nuevamente en unos minutos.';
      break;
    case 504:
      userMessage = 'El servicio no está disponible temporalmente. Intenta más tarde.';
      break;
  }

  // Crear una nueva instancia del error con mensaje amigable
  const friendlyError = new HttpErrorResponse({
    //...error,
    error: {
      ...error.error,
      userMessage,
      originalError: error.error
    }
  });

  return friendlyError;
}

// Funciones auxiliares
function getCurrentUserId(authService: AuthService): string | undefined {
  let userId: string | undefined;
  authService.currentUser$.subscribe(user => {
    userId = ''; //user?.id;
  }).unsubscribe();
  return userId;
}

function getSessionId(): string {
  // Obtiene o genera un ID de sesión
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}
