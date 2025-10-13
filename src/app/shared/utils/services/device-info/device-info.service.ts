import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {
  private readonly apiGetIpUrl = `${environment.externalServiceUrl.apiGetIpUrl}`;

  constructor(private http: HttpClient) {}

  async getClientIP(): Promise<string> {
    return '161.132.119.164';
    try {
      const response = await firstValueFrom(
        this.http.get<any>(this.apiGetIpUrl, {
          observe: 'body',
          responseType: 'json'
        })
      );

      return response.ip;
    } catch (error) {
      console.error('Error en getClientIP:', error);
      throw error;
    }
  }

  getBrowserName(): string {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1 && userAgent.indexOf('OPR') === -1) {
      return 'Chrome';
    } else if (userAgent.indexOf('Firefox') > -1) {
      return 'Firefox';
    } else if (userAgent.indexOf('OPR') > -1 || userAgent.indexOf('Opera') > -1) {
      return 'Opera';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      return 'Safari';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
      return 'Internet Explorer';
    } else if (userAgent.indexOf('Edge') > -1) {
      return 'Edge';
    }
    return 'Desconocido';
  }

}
