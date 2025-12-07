import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from '@core/models/response/api-response-base.module';
import { BeneficiaryListItem, PagedResponse } from '@core/models/beneficiary/beneficiary-list-item.interface';
import { AuditHistoryItem } from '@core/models/audit/audit-history.interface';
import { ShapExplanationResponse } from '@core/models/classification-prioritization/shap-explanation.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassificationPrioritizationService {
  private readonly apiUrl = `${environment.apiUrl}/beneficiario`;
  private readonly auditUrl = `${environment.apiUrl}/auditoria`;

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

  /**
   * Obtiene el historial de auditoría de un beneficiario
   * @param beneficiaryId ID del beneficiario
   * @returns Promise con el historial de cambios
   */
  async getAuditHistory(beneficiaryId: number): Promise<ApiResponse<AuditHistoryItem[]>> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<AuditHistoryItem[]>>(`${this.auditUrl}/${beneficiaryId}`, {
          observe: 'response',
          responseType: 'json'
        })
      );

      const body = response.body!;
      return body;
    } catch (error) {
      console.error('Error al obtener historial de auditoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene la explicación SHAP de la clasificación de un beneficiario
   * @param beneficiaryId ID del beneficiario
   * @returns Promise con la explicación SHAP
   */
  async getShapExplanation(beneficiaryId: number): Promise<ApiResponse<ShapExplanationResponse>> {
    try {
      return await firstValueFrom(
        this.http.get<ApiResponse<ShapExplanationResponse>>(
          `${this.apiUrl}/${beneficiaryId}/prediccion-shap`
        )
      );
    } catch (error) {
      console.error('Error al obtener explicación SHAP:', error);
      throw error;
    }
  }
}
