import { HttpInterceptorFn } from '@angular/common/http';

export const SecurityInterceptor: HttpInterceptorFn = (req, next) => {
  // const auditLogger = inject(AuditLoggerService);

  // // Log sensitive operations
  // if (req.method !== 'GET') {
  //   auditLogger.logApiCall(req.method, req.url, req.body);
  // }

  // Add security headers
  const secureReq = req.clone({
    setHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  });

  return next(secureReq);
};
