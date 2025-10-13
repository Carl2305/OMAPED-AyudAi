import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { KeyboardVirtualRequest, KeyboardVirtualResponse } from '@core/models/auth/keyboard-virtual.interface';

@Injectable({
  providedIn: 'root'
})
export class KeyboardVirtualService {
  private readonly apiUrl = `${environment.apiUrl}/Seguridad/teclado`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el teclado virtual desde el backend usando async/await
   * @param request - Solicitud con código para generar el teclado
   * @returns Promise con la respuesta del teclado virtual
   */
  async getKeyboardVirtual(request: KeyboardVirtualRequest): Promise<KeyboardVirtualResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<KeyboardVirtualResponse>(this.apiUrl, request, {
          observe: 'body',
          responseType: 'json'
        })
      );

      return response;
    } catch (error) {
      console.error('Error en getKeyboardVirtual:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

  /**
   * Obtiene múltiples teclados virtuales en paralelo
   * @param requests - Array de solicitudes
   * @returns Promise con array de respuestas
   */
  async getMultipleKeyboards(requests: KeyboardVirtualRequest[]): Promise<KeyboardVirtualResponse[]> {
    try {
      const promises = requests.map(request => this.getKeyboardVirtual(request));
      const responses = await Promise.all(promises);
      return responses;
    } catch (error) {
      console.error('Error en getMultipleKeyboards:', error);
      throw error;
    }
  }

}
