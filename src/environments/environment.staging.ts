// Archivo: src/environments/environment.staging.ts
// Ambiente: Pre-Producción
export const environment = {
  production: false,
  apiUrl: 'https://zonasegura.omaped.com.pe/api',
  appVersion: '1.0.0-staging',
  enableDebug: true,
  encryptionKey: "b{pYZ'aQ4XgZDw^3nMlg@",
  externalServiceUrl: {
    apiGetIpUrl: 'https://api.ipify.org?format=json'
  }
};
