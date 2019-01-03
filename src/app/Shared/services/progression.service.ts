import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progression.constants';
import CommonUtils from '@shared/utils/Common.utils';

import StorageService, { storageSvc } from './storage.service';

class ProgressionService {

  private storageSvc: StorageService;

  private storage: Object;
  private key: string;

  constructor() {
    this.storageSvc = storageSvc;

    this.key = STORAGES_KEY.progression;
    this.storage = this.storageSvc.get(STORAGES_KEY.progression) || {};
  }

  init() {
    this.storage = CommonUtils.arrayToObject(Object.keys(PROGRESSION_STORAGE_KEYS), 0);
    this.storageSvc.set(STORAGES_KEY.progression, this.storage);
  }

  increment(key: string) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key]++;
    this.storageSvc.set(this.key, this.storage);
  }

  decrement(key: string) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key]--;
    this.storageSvc.set(this.key, this.storage);
  }

}

export const progressionSvc = new ProgressionService();
export default ProgressionService;
