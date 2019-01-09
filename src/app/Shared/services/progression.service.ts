import AchievementService, { achievementSvc } from '@services/achievement.service';
import StorageService, { storageSvc } from '@services/storage.service';

import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { PROGRESSION_STORAGE } from '@achievements/constants/progressionStorageKeys.constants';

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

  /**
   * Return current progression
   * @returns {Object}
   */
  getProgressionStorage(): Object { return this.storage; }

  /**
   * Init service and local storage
   */
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

  /**
   * Update progression in storage with value and check if trophy is unlock
   * @param {string} - key
   * @param {number} - value
   */
  setValue(key: string, value: number) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key] = value;
    this.storageSvc.set(this.key, this.storage);

    this.achievementSvc.check(key);
  }

  /**
   * Increment value in storage and check if trophy is unlock
   * @param {string} - key
   * @param {number} - value
   */
  increment(key: string, value?: number) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key] += value ? value : 1;
    this.storageSvc.set(this.key, this.storage);

    this.achievementSvc.check(key);
  }

  /**
   * Decrement value in storage and check if trophy is unlock
   * @param {string} key
   */
  decrement(key: string) {
    if (!this.storage.hasOwnProperty(key)) return;
    this.storage[key]--;
    this.storageSvc.set(this.key, this.storage);
  }

}

export const progressionSvc = new ProgressionService();
export default ProgressionService;
