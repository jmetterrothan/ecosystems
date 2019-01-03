import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progression.constants';
import CommonUtils from '@shared/utils/Common.utils';

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
    this.storage = this.storageSvc.get(STORAGES_KEY.progression) || {};
  }

  getProgressionStorage() { return this.storage; }

  init() {
    if (!this.storageSvc.get(STORAGES_KEY.progression)) {
      this.storage = CommonUtils.arrayToObject(Object.keys(PROGRESSION_STORAGE_KEYS), 0);
      this.storageSvc.set(STORAGES_KEY.progression, this.storage);
    }

    if (!this.storageSvc.get(STORAGES_KEY.trophies)) {
      this.storageSvc.set(STORAGES_KEY.trophies, {});
    }

    if (!this.storageSvc.get(STORAGES_KEY.completed)) {
      this.storageSvc.set(STORAGES_KEY.completed, []);
    }
  }

  increment(key: string) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key]++;
    this.storageSvc.set(this.key, this.storage);

    console.log(localStorage);
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
