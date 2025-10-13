import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingSpinnerService } from '@shared/utils/services/loading-spinner/loading-spinner.service';

export const LoadingSpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingSpinnerService);

  // Verificar si la petición debe mostrar loading
  // Puedes agregar lógica aquí para excluir ciertas URLs
  const shouldShowLoading = !req.headers.has('X-Skip-Loading');

  if (shouldShowLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (shouldShowLoading) {
        loadingService.hide();
      }
    })
  );
};

