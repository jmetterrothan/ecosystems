import AchievementService, { achievementSvc } from '@achievements/services/achievement.service';
import StorageService, { storageSvc } from '@shared/services/storage.service';

import { IProgression } from '@achievements/models/progression.model';

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
  setValue(progression: IProgression, value: number) {
    if (!this.storage.hasOwnProperty(progression.name)) return;
    this.storage[progression.name] = value;
    this.storageSvc.set(this.key, this.storage);

    this.achievementSvc.check(progression);
  }

  /**
   * Increment value in storage and check if trophy is unlock
   * @param {string} - key
   * @param {number} - value
   */
  increment(progression: IProgression, value?: number) {
    if (!this.storage.hasOwnProperty(progression.name)) return;
    this.storage[progression.name] += value ? value : 1;
    this.storageSvc.set(this.key, this.storage);

    this.achievementSvc.check(progression);
  }

  /**
   * Decrement value in storage and check if trophy is unlock
   * @param {string} key
   */
  decrement(progression: IProgression) {
    if (!this.storage.hasOwnProperty(progression.name)) return;
    this.storage[progression.name]--;
    this.storageSvc.set(this.key, this.storage);
  }

}

export const progressionSvc = new ProgressionService();
export default ProgressionService;
