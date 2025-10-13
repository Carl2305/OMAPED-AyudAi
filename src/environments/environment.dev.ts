// Archivo: src/environments/environment.dev.ts
// Ambiente: Servidor de Desarrollo
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8083/api',
  appVersion: '1.0.0-dev',
  enableDebug: true,
  encryptionKey: "b{pYZ'aQ4XgZDw^3nMlg@",
  externalServiceUrl: {
    apiGetIpUrl: 'https://api.ipify.org?format=json'
  }
};
