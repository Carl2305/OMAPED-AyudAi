import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from '@core/models/response/api-response-base.module';
import { BeneficiaryListItem, PagedResponse } from '@core/models/beneficiary/beneficiary-list-item.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassificationPrioritizationService {
  private readonly apiUrl = `${environment.apiUrl}/beneficiario`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista paginada de beneficiarios para clasificación
   * @param pageNumber Número de página (inicia en 1)
   * @param pageSize Cantidad de items por página
   * @returns Promise con la respuesta paginada
   */
  async getBeneficiariesPaged(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResponse<BeneficiaryListItem>>> {
    try {
      const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize);

      return await firstValueFrom(
        this.http.get<ApiResponse<PagedResponse<BeneficiaryListItem>>>(
          `${this.apiUrl}/list`,
          { params }
        )
      );
    } catch (error) {
      console.error('Error al obtener beneficiarios paginados:', error);
      throw error;
    }
  }
}
