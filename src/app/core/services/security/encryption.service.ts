import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.dev';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly secretKey: string;
  private readonly algorithm = 'AES';

  constructor() {
    this.secretKey = environment.encryptionKey;
  }

  /**
   * Encripta un string usando AES
   * @param plainText - Texto a encriptar
   * @returns String encriptado
   */
  encrypt(plainText: string): string {
    try {
      if (!plainText) return '';

      const encrypted = CryptoJS.AES.encrypt(plainText, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Error during encryption:', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Desencripta un string
   * @param encryptedText - Texto encriptado
   * @returns String desencriptado
   */
  decrypt(encryptedText: string): string {
    try {
      if (!encryptedText) return '';

      const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        throw new Error('Invalid encrypted data');
      }

      return decrypted;
    } catch (error) {
      console.error('Error during decryption:', error);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Genera un hash SHA256 de un string
   * @param data - Datos para hashear
   * @returns Hash SHA256
   */
  generateHash(data: string): string {
    try {
      return CryptoJS.SHA256(data).toString();
    } catch (error) {
      console.error('Error generating hash:', error);
      throw new Error('Hash generation failed');
    }
  }

  /**
   * Genera un token único para sesiones
   * @returns Token único
   */
  generateSessionToken(): string {
    try {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2);
      const combined = timestamp + random;

      return CryptoJS.SHA256(combined).toString();
    } catch (error) {
      console.error('Error generating session token:', error);
      throw new Error('Session token generation failed');
    }
  }

  /**
   * Encripta datos para transmisión segura
   * @param data - Objeto a encriptar
   * @returns String encriptado con timestamp
   */
  encryptForTransmission(data: any): string {
    try {
      const timestamp = Date.now();
      const payload = {
        data,
        timestamp,
        nonce: this.generateSessionToken().substring(0, 16)
      };

      return this.encrypt(JSON.stringify(payload));
    } catch (error) {
      console.error('Error encrypting for transmission:', error);
      throw new Error('Transmission encryption failed');
    }
  }

  /**
   * Desencripta datos de transmisión y valida timestamp
   * @param encryptedData - Datos encriptados
   * @param maxAgeMinutes - Edad máxima permitida en minutos
   * @returns Datos desencriptados
   */
  decryptFromTransmission(encryptedData: string, maxAgeMinutes: number = 5): any {
    try {
      const decryptedString = this.decrypt(encryptedData);
      const payload = JSON.parse(decryptedString);

      const now = Date.now();
      const age = (now - payload.timestamp) / (1000 * 60); // en minutosi

      if (age > maxAgeMinutes) {
        throw new Error('Encrypted data has expired');
      }

      return payload.data;
    } catch (error) {
      console.error('Error decrypting transmission data:', error);
      throw new Error('Transmission decryption failed');
    }
  }
};
