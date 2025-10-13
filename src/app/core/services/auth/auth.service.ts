// src/app/core/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { SecureStorageService } from '@shared/utils/services/storage/secure-storage.service';
import { LoginRequest, LoginResponse, User } from '@core/models/auth/user.interface';
import { environment } from '@environments/environment';

// Interface para el payload del token JWT
interface JwtPayload {
  exp?: number;        // Expiration time
  iat?: number;        // Issued at
  sub?: string;        // Subject
  user?: User;         // User data
  roles?: string[];    // User roles
  [key: string]: any;  // Custom claims
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private secureStorage: SecureStorageService
  ) {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/token/Generar`, credentials)
      .pipe(
        tap(response => {
          if (response.exito && response.accessToken) {
            this.secureStorage.setItem('access_token', response.accessToken);
            this.currentUserSubject.next(response);
          }
        })
      );
  }

  logout(): void {
    this.secureStorage.clearAll();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.secureStorage.getItem('access_token');
    return token ? !this.isTokenExpired(token) : false;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    //return user?.roles?.includes(role) ?? false;
    return 'USER' === role; // Ajusta según el valor real que viene en el campo 'perfil'
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Decodificar token con jwt-decode
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Verificar si el token está expirado
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // Convertir timestamp de segundos a milisegundos
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  // Obtener fecha de expiración del token
  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  }

  // Obtener tiempo restante hasta expiración (en segundos)
  getTokenTimeUntilExpiration(token: string): number | null {
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return null;

    const now = new Date();
    return Math.max(0, Math.floor((expirationDate.getTime() - now.getTime()) / 1000));
  }

  // Cargar usuario desde el token
  private loadCurrentUser(): void {
    // const token = this.secureStorage.getItem('access_token');
    // if (token && !this.isTokenExpired(token)) {
    //   const decodedToken = this.decodeToken(token);
    //   if (decodedToken?.user) {
    //     this.currentUserSubject.next(decodedToken);
    //   }
    // }
    const token = this.secureStorage.getItem('access_token');
    if (token && !this.isTokenExpired(token)) {
      // Intenta obtener el usuario del storage
      const userJson = this.secureStorage.getItem('current_user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.logout();
        }
      }
    }
  }

  // Método adicional: Obtener información específica del token
  getTokenClaims(): JwtPayload | null {
    const token = this.secureStorage.getItem('access_token');
    return token ? this.decodeToken(token) : null;
  }

  // Método adicional: Obtener subject (usuario ID) del token
  getTokenSubject(): string | null {
    const claims = this.getTokenClaims();
    return claims?.sub || null;
  }

  // Método adicional: Verificar si el token expirará pronto
  willTokenExpireSoon(secondsThreshold: number = 300): boolean {
    const token = this.secureStorage.getItem('access_token');
    if (!token) return true;

    const timeUntilExpiration = this.getTokenTimeUntilExpiration(token);
    return timeUntilExpiration !== null && timeUntilExpiration <= secondsThreshold;
  }
}
