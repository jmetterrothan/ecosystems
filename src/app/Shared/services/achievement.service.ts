import snakeCase from 'snake-case';

import StorageService, { storageSvc } from './storage.service';

import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';

import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { TROPHIES } from '@achievements/constants/trophies.constants';

class AchievementService {

  private storageSvc: StorageService;

  private storage: Object;

  private trophies: ITrophy[];

  constructor() {
    this.storageSvc = storageSvc;
    this.trophies = TROPHIES;

    this.storage = this.storageSvc.get(STORAGES_KEY.trophies) || {};
  }

  check(key: string) {
    const trophiesConcerned = this.trophies.filter(
      (trophy: ITrophy) => trophy.checklist.some((option: IChecklistOption) => option.value === key)
    );

    // console.log('key', key, trophiesConcerned);

    for (const trophy of trophiesConcerned) {
      const trophyName = snakeCase(trophy.value);
      if ((<string[]>this.storageSvc.get(STORAGES_KEY.completed)).includes(trophyName)) continue;

      let checklist: string[] = this.storageSvc.get(STORAGES_KEY.trophies)[trophyName];
      if (!checklist) {
        this.initTrophyInStorage(trophyName);
        checklist = [];
      }

      if (trophy.checklist.some((option: IChecklistOption) => option.limit !== undefined)) {
        const count = this.storageSvc.get(STORAGES_KEY.progression)[key];
        const checklistItem = trophy.checklist.find((option: IChecklistOption) => option.limit === count);
        if (!checklistItem) continue;
      }

      checklist.push(key);
      const set = new Set<string>(checklist);
      this.storage[trophyName] = [...set];

      this.storageSvc.set(STORAGES_KEY.trophies, this.storage);

      if (this.checkTrophyCompleted(trophy, [...set])) this.unlockTrophy(trophy);
    }
  }

  private initTrophyInStorage(trophyName: string) {
    this.storage[trophyName] = [];
    this.storageSvc.set(STORAGES_KEY.trophies, this.storage);
  }

  private checkTrophyCompleted(trophy: ITrophy, list: string[]): boolean {
    return trophy.checklist.length === list.length;
  }

  private unlockTrophy(trophy: ITrophy) {
    // trophy completed
    const completedArray = this.storageSvc.get(STORAGES_KEY.completed);
    (<string[]>completedArray).push(snakeCase(trophy.value));
    this.storageSvc.set(STORAGES_KEY.completed, completedArray);

    console.log('TROPHY COMPLETED');
  }

}

export const achievementSvc = new AchievementService();
export default AchievementService;
