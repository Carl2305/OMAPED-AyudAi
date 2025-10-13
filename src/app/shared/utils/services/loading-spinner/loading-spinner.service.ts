import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Muestra el loading global
   */
  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Oculta el loading global
   */
  hide(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }

    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Fuerza el ocultamiento del loading (resetea el contador)
   */
  forceHide(): void {
    this.loadingCount = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Obtiene el estado actual del loading
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Ejecuta una función asíncrona mostrando el loading
   */
  async withLoading<T>(asyncFn: () => Promise<T>): Promise<T> {
    this.show();
    try {
      const result = await asyncFn();
      return result;
    } finally {
      this.hide();
    }
  }
}
