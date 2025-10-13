import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EncryptionService } from '@core/services/security/encryption.service';

export type StorageType = 'session' | 'local';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private isBrowser: boolean;

  constructor(
    private encryptionService: EncryptionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Métodos para sessionStorage
  setItem(key: string, value: string): void {
    this.setStorageItem(key, value, 'session');
  }

  getItem(key: string): string | null {
    return this.getStorageItem(key, 'session');
  }

  removeItem(key: string): void {
    this.removeStorageItem(key, 'session');
  }

  clearAll(): void {
    this.clearStorage('session');
  }

  // Métodos genéricos que permiten elegir el tipo de storage
  setStorageItem(key: string, value: string, storageType: StorageType = 'session'): void {
    if (!this.isBrowser || !this.isStorageAvailable(storageType)) {
      console.warn(`${storageType}Storage not available, cannot save item:`, key);
      return;
    }

    try {
      const encryptedValue = this.encryptionService.encrypt(value);
      const storage = this.getStorage(storageType);
      storage?.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error saving encrypted item to ${storageType}Storage:`, error);
    }
  }

  getStorageItem(key: string, storageType: StorageType = 'session'): string | null {
    if (!this.isBrowser || !this.isStorageAvailable(storageType)) {
      return null;
    }

    try {
      const storage = this.getStorage(storageType);
      const encryptedValue = storage?.getItem(key);
      if (!encryptedValue) return null;

      return this.encryptionService.decrypt(encryptedValue);
    } catch (error) {
      console.error('Error decrypting stored value:', error);
      this.removeStorageItem(key, storageType);
      return null;
    }
  }

  removeStorageItem(key: string, storageType: StorageType = 'session'): void {
    if (!this.isBrowser || !this.isStorageAvailable(storageType)) {
      return;
    }

    try {
      const storage = this.getStorage(storageType);
      storage?.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from ${storageType}Storage:`, error);
    }
  }

  clearStorage(storageType: StorageType = 'session'): void {
    if (!this.isBrowser || !this.isStorageAvailable(storageType)) {
      return;
    }

    try {
      const storage = this.getStorage(storageType);
      storage?.clear();
    } catch (error) {
      console.error(`Error clearing ${storageType}Storage:`, error);
    }
  }

  // Métodos específicos para localStorage
  setLocalItem(key: string, value: string): void {
    this.setStorageItem(key, value, 'local');
  }

  getLocalItem(key: string): string | null {
    return this.getStorageItem(key, 'local');
  }

  removeLocalItem(key: string): void {
    this.removeStorageItem(key, 'local');
  }

  clearLocalStorage(): void {
    this.clearStorage('local');
  }

  // Métodos de utilidad
  private getStorage(storageType: StorageType): Storage | null {
    if (!this.isBrowser) return null;

    try {
      return storageType === 'session' ? sessionStorage : localStorage;
    } catch (error) {
      return null;
    }
  }

  private isStorageAvailable(storageType: StorageType): boolean {
    if (!this.isBrowser) return false;

    try {
      const storage = storageType === 'session' ? sessionStorage : localStorage;
      const testKey = `__${storageType}_test__`;
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  isAvailable(storageType: StorageType = 'session'): boolean {
    return this.isBrowser && this.isStorageAvailable(storageType);
  }

  getAllKeys(storageType: StorageType = 'session'): string[] {
    if (!this.isBrowser || !this.isStorageAvailable(storageType)) {
      return [];
    }

    try {
      const storage = this.getStorage(storageType);
      if (!storage) return [];

      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    } catch (error) {
      console.error(`Error getting ${storageType}Storage keys:`, error);
      return [];
    }
  }

  hasItem(key: string, storageType: StorageType = 'session'): boolean {
    if (!this.isBrowser || !this.isStorageAvailable(storageType)) {
      return false;
    }

    try {
      const storage = this.getStorage(storageType);
      return storage?.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking item existence:', error);
      return false;
    }
  }

  // Método para migrar datos entre storages
  migrateItem(key: string, from: StorageType, to: StorageType): boolean {
    const value = this.getStorageItem(key, from);
    if (value !== null) {
      this.setStorageItem(key, value, to);
      this.removeStorageItem(key, from);
      return true;
    }
    return false;
  }

  // Información de diagnóstico
  getStorageInfo(): { sessionStorage: boolean; localStorage: boolean; browser: boolean } {
    return {
      browser: this.isBrowser,
      sessionStorage: this.isStorageAvailable('session'),
      localStorage: this.isStorageAvailable('local')
    };
  }
}
