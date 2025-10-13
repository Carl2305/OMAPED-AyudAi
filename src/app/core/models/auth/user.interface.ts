export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  lastLogin?: Date;
  isActive: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  phoneNumber?: string;
  avatar?: string;
}

export interface LoginRequest {
  login: string;
  direccionIp: string;
  navegador: string;
  clave: LoginPassword;
}

export interface LoginPassword {
  codigo: number;
  dispositivo: string;
  digitos: string[];
}


export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresOn: string;
  bloqueado: boolean;
  cambiarClave: boolean;
  exito: boolean;
  idUsuario: number;
  perfil: string;
  nombreUsuario: string;
  aceptoAccesoWeb: boolean;
  nroDocumento: string;
  idCliente: number;
  claveTemporal: boolean;
}
