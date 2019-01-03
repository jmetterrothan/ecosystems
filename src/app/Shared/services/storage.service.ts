class StorageService {

  get(key: string): string | Object {
    const value: any = localStorage.getItem(key);
    return typeof value === 'string' ? JSON.parse(value) : value;
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

}

export const storageSvc = new StorageService();
export default StorageService;
