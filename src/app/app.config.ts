import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { SecurityInterceptor } from '@core/interceptors/security.interceptor';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { LoadingSpinnerInterceptor } from '@core/interceptors/loading-spinner.interceptor';
import { routes } from './app-routing.module';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([
        AuthInterceptor,
        SecurityInterceptor,
        //ErrorInterceptor,
        LoadingSpinnerInterceptor,
      ])
    ),
    provideAnimations()
  ]
};
