import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { configSvc } from './config.service';

class StorageService {

  /**
   * Return string or object in local storage with key
   * @param {string} - key
   * @returns {T}
   */
  get<T>(key: string): T {
    const value: any = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      if (configSvc.debug && typeof value !== 'string') {
        console.warn(`Failed to parse storage key ${key}`);
      }
    }
    return value;
  }

  /**
   *  Set item in local storage
   * @param {string} - key
   * @param {string|Object} item
   */
  set<T>(key: string, item: T) {
    localStorage.setItem(key, typeof item === 'string' ? item : JSON.stringify(item));
  }

  /**
   * Remove item that macthes with key
   * @param {string} - key
   */
  remove(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Clear local storage
   */
  clearAll() {
    localStorage.clear();
  }

  /**
   * Return if storage at key contains value
   * @param {string} - storageKey
   * @param {string} - value
   * @returns {boolean}
   */
  isInStorage(storageKey: string, value: string): boolean {
    return (this.get<string[]>(storageKey)).includes(value);
  }

}

export const storageSvc = new StorageService();

export default StorageService;
