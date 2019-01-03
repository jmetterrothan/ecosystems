import StorageService, { storageSvc } from './storage.service';
import trophies from '@public/trophies';

import ProgressionService, { progressionSvc } from './progression.service';

import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

class AchievementService {

  private progressionSvc: ProgressionService;
  private storageSvc: StorageService;

  constructor() {
    this.progressionSvc = progressionSvc;
    this.storageSvc = storageSvc;
  }

  init() {
    if (!this.storageSvc.get(STORAGES_KEY.progression)) this.progressionSvc.init();
  }

}

export const achievementSvc = new AchievementService();
export default AchievementService;
