// src/app/core/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UsuarioInfoResponse } from '@core/models/auth/user.interface';
import { environment } from '@environments/environment';
import { ApiResponse } from '@core/models/response/api-response-base.module';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/usuario`;

  constructor(
    private http: HttpClient
  ){}

  async getUsuarioInfo(request: string): Promise<ApiResponse<UsuarioInfoResponse>> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<UsuarioInfoResponse>>(`${this.apiUrl}/${request}`, {
          observe: 'body',
          responseType: 'json'
        })
      );
  
      return response;
    } catch (error) {
      console.error('Error en getUsuarioInfo:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

}
