export interface LoginRequest {
  documento: string;
  codigo: number;
  dispositivo: number;
  botones: string[];
}

export interface LoginResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

// Interface para el payload del token JWT
export interface JwtPayload {
  sub?: string;   
  jti?: string;   
  documento?: string;  
  usuario?: string;  
  auth_time?: string;     
  nbf?: number;        
  exp?: number;   
  iss?: string;  
  aud?: string;
}