import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { CodeCaptchaRequest, CodeCaptchaResponse } from '@core/models/auth/code-captcha.interface';

@Injectable({
  providedIn: 'root'
})
export class CodeCaptchaService {
  private readonly apiUrl = `${environment.apiUrl}/Seguridad`;

  constructor(private http: HttpClient) {}

  /**
   * Genera la Url para obtener el código Captcha
   * @param number - Solicitud con código para generar el captcha
   * @returns Promise con la respuesta del captcha
   */
  getUrlCodeCaptcha(number: number): string {
    try {
      return `${this.apiUrl}/Captcha/${number}`;
    } catch (error) {
      console.error('Error en getKeyboardVirtual:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

  /**
   * Varifica la validez del código Captcha digitado
   * @param request - Codigo Captcha
   * @returns Promise con rspuesta de la validación de Captcha
   */
  async postCheckCodeCaptcha(request: CodeCaptchaRequest): Promise<CodeCaptchaResponse> {
    try {
      const response = await firstValueFrom(
        //this.http.post<CodeCaptchaResponse>(`${this.apiUrl}/VerificarCaptcha`, request, {
        this.http.post<any>(`${this.apiUrl}/VerificarCaptcha`, request, {
          observe: 'body',
          responseType: 'json'
        })
      );

      return response.data;
    } catch (error) {
      console.error('Error en getKeyboardVirtual:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

}
