import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

class StorageService {

  get(key: string): string | Object {
    const value: any = localStorage.getItem(key);
    return typeof value === 'string' ? JSON.parse(value) : value;
  }

  getTrophiesCompleted(): string[] {
    return this.get(STORAGES_KEY.completed) as string[];
  }

  set(key: string, item: string | Object) {
    localStorage.setItem(key, typeof item === 'object' ? JSON.stringify(item) : item);
  }

  remove(item: string) {
    localStorage.removeItem(item);
  }

  clearAll() {
    localStorage.clear();
  }

  isInStorage(storageKey: string, value: string): boolean {
    return (<string[]>this.get(storageKey)).includes(value);
  }

}

export const storageSvc = new StorageService();
export default StorageService;
