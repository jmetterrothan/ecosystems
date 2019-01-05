import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { PROGRESSION_STORAGE, PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progressionStorageKeys.constants';

import StorageService, { storageSvc } from './storage.service';
import AchievementService, { achievementSvc } from './achievement.service';

class ProgressionService {

  private storageSvc: StorageService;
  private achievementSvc: AchievementService;

  private storage: Object;
  private key: string;

  constructor() {
    this.storageSvc = storageSvc;
    this.achievementSvc = achievementSvc;

    this.key = STORAGES_KEY.progression;
    this.storage = this.storageSvc.get(STORAGES_KEY.progression) || PROGRESSION_STORAGE;
  }

  getProgressionStorage() { return this.storage; }

  init() {
    if (!this.storageSvc.get(STORAGES_KEY.progression)) {
      this.storageSvc.set(STORAGES_KEY.progression, this.storage);
    }

    if (!this.storageSvc.get(STORAGES_KEY.trophies)) {
      this.storageSvc.set(STORAGES_KEY.trophies, {});
    }

    if (!this.storageSvc.get(STORAGES_KEY.completed)) {
      this.storageSvc.set(STORAGES_KEY.completed, []);
    }
  }

  setStorage(key: string, value: number) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key] = value;
    this.storageSvc.set(this.key, this.storage);

    this.achievementSvc.check(key);
  }

  increment(key: string, value?: number) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key] += value ? value : 1;
    this.storageSvc.set(this.key, this.storage);

    this.achievementSvc.check(key);
  }

  decrement(key: string) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key]--;
    this.storageSvc.set(this.key, this.storage);
  }

}

export const progressionSvc = new ProgressionService();
export default ProgressionService;
