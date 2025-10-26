import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { SecureStorageService } from '@shared/utils/services/storage/secure-storage.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const secureStorage = inject(SecureStorageService);
  const token = secureStorage.getItem('access_token');
  const corrId = secureStorage.getItem('x_correlation_id');

  if (token && !req.url.includes('/auth/')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Correlation-Id': corrId ? corrId : ''
      }
    });
    return next(authReq);
  }

  return next(req);
};
