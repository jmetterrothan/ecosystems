import { Subject } from 'rxjs';
import uniqid from 'uniqid';

import MathUtils from '@shared/utils/Math.utils';
import SoundManager from '@shared/SoundManager';
import CommonUtils from '@app/shared/utils/Common.utils';

import { storageSvc } from '@shared/services/storage.service';
import { monitoringSvc } from '@shared/services/monitoring.service';
import { notificationSvc } from '@shared/services/notification.service';
import { progressionSvc } from '@achievements/services/progression.service';
import { translationSvc } from '@shared/services/translation.service';

import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';
import { IProgression } from '@achievements/models/progression.model';

import { PROGRESSION_TROPHIES_STORAG_KEYS } from '@achievements/constants/progressionTrophiesStorageKeys.constants';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

import { TROPHIES } from '@achievements/constants/trophies.constants';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';
import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';

class AchievementService {

  private storage: Object;

  private trophies: ITrophy[];

  trophy$: Subject<number>;

  constructor() {
    this.trophies = TROPHIES;

    this.storage = storageSvc.get<Object>(STORAGES_KEY.trophies) || {};

    this.trophy$ = new Subject();
  }

  getTrophiesCount(): number {
    return this.trophies.length;
  }

  getUnlockedTrophiesCount(): number {
    return storageSvc.get<string[]>(STORAGES_KEY.completed).length;
  }

  getUnlockedTrophies(): ITrophy[] {
    const unlocked: string[] = storageSvc.get<string[]>(STORAGES_KEY.completed);
    return TROPHIES.filter((trophy: ITrophy) => unlocked.includes(trophy.value));
  }

  reset() {
    this.storage = {};
  }

  /**
   * Check if trophy is unlocked
   * @param {string} - key
   */
  check(progression: IProgression) {
    // get trophies concerned by progression setted
    const trophiesConcerned = this.trophies.filter(
      (trophy: ITrophy) => trophy.checklist.some((option: IChecklistOption) => option.value === progression.name)
    );

    for (const trophy of trophiesConcerned) {
      const trophyName = trophy.value;
      if (storageSvc.isInStorage(STORAGES_KEY.completed, trophyName)) continue;

      // get trophy checklist
      let checklist: string[] = storageSvc.get<Object>(STORAGES_KEY.trophies)[trophyName];
      if (!checklist) {
        // init trophy in local storage
        this.initTrophyInStorage(trophyName);
        checklist = [];
      }

      // if some option in checklist have a limit input
      if (trophy.checklist.some((option: IChecklistOption) => option.limit !== undefined)) {
        const count = storageSvc.get<Object>(STORAGES_KEY.progression)[progression.name];
        const checklistItem = trophy.checklist.find((option: IChecklistOption) => {
          // find item in checklist to check based on progression setted
          if (option.comparison && option.comparison === COMPARISON_TYPE.SUPERIOR) return count >= option.limit;
          return option.limit === count;
        });
        if (!checklistItem) continue;
      }

      // option in checklist is concerned and unlocked
      checklist.push(progression.name);
      const set = new Set<string>(checklist);
      this.storage[trophyName] = [...set];

      storageSvc.set<Object>(STORAGES_KEY.trophies, this.storage);

      // check if trophy is unlocked
      if (this.checkTrophyCompleted(trophy, [...set])) {
        this.unlockTrophy(trophy);
      }
    }
  }

  /**
   * Init trophy in storage
   * @param {string} - trophyName
   */
  private initTrophyInStorage(trophyName: string) {
    this.storage[trophyName] = [];
    storageSvc.set<Object>(STORAGES_KEY.trophies, this.storage);
  }

  /**
   * Check if trophy is unlocked
   * @param {ITrophy} - trophy
   * @param {string[]} list
   */
  private checkTrophyCompleted(trophy: ITrophy, list: string[]): boolean {
    return trophy.percentage
      ? MathUtils.percent(list.length, trophy.checklist.length) >= trophy.percentage
      : trophy.checklist.length === list.length;
  }

  /**
   * Unlock trophy
   * @param {ITrophy} - trophy
   */
  private unlockTrophy(trophy: ITrophy) {
    // trophy completed
    const completedArray = storageSvc.get<Object>(STORAGES_KEY.completed);
    (<string[]>completedArray).push(trophy.value);
    storageSvc.set<Object>(STORAGES_KEY.completed, completedArray);

    // format value
    if (trophy.name.options && trophy.name.options.counter) {
      trophy.name.options.counter = CommonUtils.formatNumberWithSpaces(trophy.name.options.counter);
    }

    // send notification
    notificationSvc.push({
      id: uniqid(),
      Icon: trophy.Icon,
      label: translationSvc.translate('UI.trophy_unlocked'),
      content: translationSvc.translate(trophy.name.key, trophy.name.options),
      duration: 5000
    });

    // send event to google analytics
    monitoringSvc.sendEvent(monitoringSvc.categories.trophy, monitoringSvc.actions.completed, trophy.value);

    // update trophy progression
    progressionSvc.setValue(
      PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage,
      MathUtils.percent(this.getUnlockedTrophiesCount(), this.trophies.filter((trophy: ITrophy) => trophy.type !== TROPHY_TYPE.TROPHY).length, true)
    );

    // notify unlocked count change
    this.trophy$.next(this.getUnlockedTrophiesCount());
  }

}

export const achievementSvc = new AchievementService();
export default AchievementService;
