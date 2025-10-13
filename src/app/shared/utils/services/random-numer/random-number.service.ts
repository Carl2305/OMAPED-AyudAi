// random-number.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberService {

  constructor() { }

  /**
   * Genera un número aleatorio seguro dentro de un rango [min, max]
   * utilizando el API Web Crypto para mayor seguridad.
   *
   * @param min - Valor mínimo del rango (incluido)
   * @param max - Valor máximo del rango (incluido)
   * @returns Promise<number> - Número aleatorio seguro
   */
  async generateSecureRandom(min: number, max: number): Promise<number> {
    // Validar parámetros
    if (min > max) {
      throw new Error('El valor mínimo no puede ser mayor que el máximo');
    }

    if (min === max) {
      return min;
    }

    // Asegurar que los parámetros son integers
    min = Math.floor(min);
    max = Math.floor(max);

    // Calcular el rango
    const range = max - min + 1;

    // Crear un array de bytes (más bytes de los necesarios para mayor seguridad)
    const byteArray = new Uint8Array(4);

    try {
      // Generar valores aleatorios seguros
      window.crypto.getRandomValues(byteArray);

      // Convertir bytes a un valor numérico
      const buffer = new DataView(byteArray.buffer);
      const randomValue = buffer.getUint32(0, true) / (0xFFFFFFFF + 1);

      // Escalar al rango deseado
      return Math.floor(randomValue * range) + min;
    } catch (error) {
      console.error('Error generando número aleatorio seguro:', error);
      // Fallback a Math.random() si hay error (menos seguro pero funcional)
      return Math.floor(Math.random() * range) + min;
    }
  }

  /**
   * Genera múltiples números aleatorios seguros
   *
   * @param min - Valor mínimo del rango (incluido)
   * @param max - Valor máximo del rango (incluido)
   * @param count - Cantidad de números a generar
   * @returns Promise<number[]> - Array de números aleatorios seguros
   */
  async generateMultipleSecureRandoms(min: number, max: number, count: number): Promise<number[]> {
    const promises: Promise<number>[] = [];

    for (let i = 0; i < count; i++) {
      promises.push(this.generateSecureRandom(min, max));
    }

    return Promise.all(promises);
  }
}
