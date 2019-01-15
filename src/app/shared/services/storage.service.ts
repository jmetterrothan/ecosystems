import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

class StorageService {

  /**
   * Return string or object in local storage with key
   * @param {string} - key
   * @returns {string|Object}
   */
  get(key: string): string | Object {
    const value: any = localStorage.getItem(key);
    return typeof value === 'string' ? JSON.parse(value) : value;
  }

  /**
   * get list of completed trophies in local storage
   * @returns {string[]}
   */
  getTrophiesCompleted(): string[] {
    return this.get(STORAGES_KEY.completed) as string[];
  }

  /**
   *  Set item in local storage
   * @param {string} - key
   * @param {string|Object} item
   */
  set(key: string, item: string | Object) {
    localStorage.setItem(key, typeof item === 'object' ? JSON.stringify(item) : item);
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
   * Return if storage at ket contains value
   * @param {string} - storageKey
   * @param {string} - value
   * @returns {boolean}
   */
  isInStorage(storageKey: string, value: string): boolean {
    return (<string[]>this.get(storageKey)).includes(value);
  }

}

export const storageSvc = new StorageService();
export default StorageService;
