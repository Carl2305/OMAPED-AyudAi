export interface KeyboardVirtualResponse {
  codigo?: number;
  dispositivo?: string;
  botones?: Key[];
}

export interface Key {
  codigoHash?: string;
  imagenBase64?: string;
  valorNumerico?: number;
}

export interface KeyboardVirtualRequest {
  codigo?: string;
}
