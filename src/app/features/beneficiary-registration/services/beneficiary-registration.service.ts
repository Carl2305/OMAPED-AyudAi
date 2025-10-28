import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/response/api-response-base.module';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BeneficiaryRegistrationService {
  private readonly apiUrl = `${environment.apiUrl}/beneficiario`;

  constructor(
    private http: HttpClient
  ) { }

  async getValidateExistsBeneficiary(type_doc_request: string, doc_request: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/validate/${type_doc_request}/${doc_request}`, {
          observe: 'response',
          responseType: 'json'
        })
      );
  
      const body = response.body!;
      return body;
    } catch (error) {
      console.error('Error en getValidateExistsBeneficiary:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

  async postCreateBeneficiary(request: any): Promise<ApiResponse<boolean>> {
    try {
      const resp = await firstValueFrom(
        this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/create`, request, {
          observe: 'response'
        })
      );

      const body = resp.body!;
      return body;
    } catch (error) {
      console.error('Error en postCreateBeneficiary:', error);
      throw error; // El interceptor de errores se encargará del manejo
    }
  }

}