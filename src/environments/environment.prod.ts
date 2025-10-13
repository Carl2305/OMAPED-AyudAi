// Archivo: src/environments/environment.prod.ts
// Ambiente: Producción
export const environment = {
  production: true,
  apiUrl: 'https://zonasegura.omaped.com/api',
  appVersion: '1.0.0',
  enableDebug: false,
  encryptionKey: "b{pYZ'aQ4XgZDw^3nMlg@",
  externalServiceUrl: {
    apiGetIpUrl: 'https://api.ipify.org?format=json'
  }
};
