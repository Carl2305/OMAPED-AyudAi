import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { CodeCaptchaRequest, CodeCaptchaResponse } from '@core/models/auth/code-captcha.interface';
import { ApiResponse } from '@core/models/response/api-response-base.module';

@Injectable({
  providedIn: 'root'
})
export class CodeCaptchaService {
  private readonly apiUrl = `${environment.apiUrl}/captcha`;

  constructor(private http: HttpClient) {}

  /**
   * Genera la Url para obtener el código Captcha
   * @returns Promise con la respuesta del captcha
   */
  async getUrlCodeCaptcha(): Promise<CodeCaptchaResponse> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<CodeCaptchaResponse>>(`${this.apiUrl}`, {
          observe: 'body',
          responseType: 'json'
        })
      );
  
      return response.data!;
    } catch (error) {
      console.error('Error en getCodeCaptcha:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

  /**
   * Varifica la validez del código Captcha digitado
   * @param request - Codigo Captcha
   * @returns Promise con rspuesta de la validación de Captcha
   */
  async postCheckCodeCaptcha(request: CodeCaptchaRequest): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/validate`, request, {
          observe: 'body',
          responseType: 'json'
        })
      );

      return response.data!;
    } catch (error) {
      console.error('Error en postCheckCodeCaptcha:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

}
