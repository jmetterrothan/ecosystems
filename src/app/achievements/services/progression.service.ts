import AchievementService, { achievementSvc } from '@achievements/services/achievement.service';
import StorageService, { storageSvc } from '@shared/services/storage.service';

import { IProgression, IProgressionWithCount } from '@achievements/models/progression.model';

import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { PROGRESSION_STORAGE, PROGRESSION_SHOWN } from '@achievements/constants/progressionStorageKeys.constants';

class ProgressionService {

  private storageSvc: StorageService;
  private achievementSvc: AchievementService;

  private storage: Object;
  private key: string;

  constructor() {
    this.storageSvc = storageSvc;
    this.achievementSvc = achievementSvc;

    this.key = STORAGES_KEY.progression;
    this.storage = this.storageSvc.get<Object>(STORAGES_KEY.progression) || PROGRESSION_STORAGE;
  }

  /**
   * Return current progression
   * @returns {Object}
   */
  getProgressionStorage(): Object { return this.storage; }

  getProgressionShownKeys(): IProgression[] {
    return PROGRESSION_SHOWN.filter((progression: IProgression) => progression.show);
  }

  getProgressionShown(): IProgressionWithCount[] {
    const keys = this.getProgressionShownKeys();
    return keys.map((item: IProgression) => (<IProgressionWithCount>{
      ...item,
      count: this.storageSvc.get<Object>(STORAGES_KEY.progression)[item.value]
    }));
  }

  /**
   * Init service and local storage
   */
  init() {
    if (!this.storageSvc.get<Object>(STORAGES_KEY.progression)) {
      this.storageSvc.set<Object>(STORAGES_KEY.progression, this.storage);
    }

    if (!this.storageSvc.get<Object>(STORAGES_KEY.trophies)) {
      this.storageSvc.set<Object>(STORAGES_KEY.trophies, {});
    }

    if (!this.storageSvc.get<Object>(STORAGES_KEY.completed)) {
      this.storageSvc.set<Object>(STORAGES_KEY.completed, []);
    }
  }

  /**
   * Update progression in storage with value and check if trophy is unlock
   * @param {IProgression} - progression
   * @param {number} - value
   */
  setValue(progression: IProgression, value: number) {
    if (!this.storage.hasOwnProperty(progression.value)) return;
    this.storage[progression.value] = value;
    this.storageSvc.set<Object>(this.key, this.storage);

    this.achievementSvc.check(progression);
  }

  /**
   * Increment value in storage and check if trophy is unlock
   * @param {IProgression} - progression
   * @param {number} - value
   */
  increment(progression: IProgression, value?: number) {
    if (!this.storage.hasOwnProperty(progression.value)) return;
    this.storage[progression.value] += value ? value : 1;
    this.storageSvc.set<Object>(this.key, this.storage);

    this.achievementSvc.check(progression);
  }

  /**
   * Decrement value in storage and check if trophy is unlock
   * @param {IProgression} - progression
   */
  decrement(progression: IProgression) {
    if (!this.storage.hasOwnProperty(progression.value)) return;
    this.storage[progression.value]--;
    this.storageSvc.set<Object>(this.key, this.storage);
  }

}

export const progressionSvc = new ProgressionService();
export default ProgressionService;
