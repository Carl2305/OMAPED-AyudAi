export interface KeyboardVirtualResponse {
  codigo?: number;
  dispositivo?: number;
  botones?: Key[];
}

export interface Key {
  codigoHash?: string;
  imagen?: string;
  valor?: number;
}

