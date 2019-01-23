import { Subject } from 'rxjs';

import StorageService, { storageSvc } from '@shared/services/storage.service';
import MonitoringService, { monitoringSvc } from '@shared/services/monitoring.service';
import { notificationSvc } from '@shared/services/notification.service';
import { progressionSvc } from '@achievements/services/progression.service';
import TranslationService, { translationSvc } from '@shared/services/translation.service';

import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';

import { PROGRESSION_TROPHIES_STORAG_KEYS } from '@achievements/constants/progressionTrophiesStorageKeys.constants';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

import { TROPHIES } from '@achievements/constants/trophies.constants';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';
import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';

import MathUtils from '@shared/utils/Math.utils';

class AchievementService {
  private storageSvc: StorageService;
  private monitoringSvc: MonitoringService;
  private translationSvc: TranslationService;

  private storage: Object;

  private trophies: ITrophy[];

  trophy$: Subject<number>;

  constructor() {
    this.storageSvc = storageSvc;
    this.monitoringSvc = monitoringSvc;
    this.translationSvc = translationSvc;

    this.trophies = TROPHIES;

    this.storage = this.storageSvc.get(STORAGES_KEY.trophies) || {};

    this.trophy$ = new Subject();
  }

  getTrophiesCount(): number {
    return this.trophies.length;
  }

  getUnlockedTrophiesCount(): number {
    return (<string[]>this.storageSvc.get(STORAGES_KEY.completed)).length;
  }

  getUnlockedTrophies(): ITrophy[] {
    const unlocked: string[] = (<string[]>this.storageSvc.get(STORAGES_KEY.completed));
    return TROPHIES.filter((trophy: ITrophy) => unlocked.includes(trophy.value));
  }

  /**
   * Check if trophy is unlocked
   * @param {string} - key
   */
  check(key: string) {
    // get trophies concerned by progression setted
    const trophiesConcerned = this.trophies.filter(
      (trophy: ITrophy) => trophy.checklist.some((option: IChecklistOption) => option.value === key)
    );

    for (const trophy of trophiesConcerned) {
      const trophyName = trophy.value;
      if (this.storageSvc.isInStorage(STORAGES_KEY.completed, trophyName)) continue;

      // get trophy checklist
      let checklist: string[] = this.storageSvc.get(STORAGES_KEY.trophies)[trophyName];
      if (!checklist) {
        // init trophy in local storage
        this.initTrophyInStorage(trophyName);
        checklist = [];
      }

      // if some option in checklist have a limit input
      if (trophy.checklist.some((option: IChecklistOption) => option.limit !== undefined)) {
        const count = this.storageSvc.get(STORAGES_KEY.progression)[key];
        const checklistItem = trophy.checklist.find((option: IChecklistOption) => {
          // find item in checklist to check based on progression setted
          if (option.comparison && option.comparison === COMPARISON_TYPE.SUPERIOR) return count >= option.limit;
          return option.limit === count;
        });
        if (!checklistItem) continue;
      }

      // option in checklist is concerned and unlocked
      checklist.push(key);
      const set = new Set<string>(checklist);
      this.storage[trophyName] = [...set];

      this.storageSvc.set(STORAGES_KEY.trophies, this.storage);

      // check if trophy is unlocked
      if (this.checkTrophyCompleted(trophy, [...set])) this.unlockTrophy(trophy);
    }
  }

  /**
   * Init trophy in storage
   * @param {string} - trophyName
   */
  private initTrophyInStorage(trophyName: string) {
    this.storage[trophyName] = [];
    this.storageSvc.set(STORAGES_KEY.trophies, this.storage);
  }

  /**
   * Check if trophy is unlocked
   * @param {ITrophy} - trophy
   * @param {string[]} list
   */
  private checkTrophyCompleted(trophy: ITrophy, list: string[]): boolean {
    return trophy.checklist.length === list.length;
  }

  /**
   * Unlock trophy
   * @param {ITrophy} - trophy
   */
  private unlockTrophy(trophy: ITrophy) {
    // trophy completed
    const completedArray = this.storageSvc.get(STORAGES_KEY.completed);
    (<string[]>completedArray).push(trophy.value);
    this.storageSvc.set(STORAGES_KEY.completed, completedArray);

    // send notification
    notificationSvc.push({
      icon: null,
      label: this.translationSvc.translate('UI.trophy_unlocked'),
      content: this.translationSvc.translate(trophy.name.key, trophy.name.options),
      duration: 5000
    });

    // send event to google analytics
    this.monitoringSvc.sendEvent(this.monitoringSvc.categories.trophy, this.monitoringSvc.actions.completed, trophy.value);

    // update trophy progression
    progressionSvc.setValue(
      PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage,
      MathUtils.percent(this.storageSvc.getTrophiesCompleted(), this.trophies.filter((trophy: ITrophy) => trophy.type !== TROPHY_TYPE.TROPHY))
    );

    // notify unlocked count change
    this.trophy$.next(this.getUnlockedTrophiesCount());
  }
}

export const achievementSvc = new AchievementService();
export default AchievementService;
