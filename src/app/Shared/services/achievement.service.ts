import store from 'store';
import trophies from '@public/trophies';

import ProgressionService, { progressionSvc } from './progression.service';

import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

class AchievementService {

  private progressionSvc: ProgressionService;

  constructor() {
    this.progressionSvc = progressionSvc;
  }

  init() {
    if (!store.get(STORAGES_KEY.progression)) this.progressionSvc.init();
  }

}

export const achievementSvc = new AchievementService();
export default AchievementService;
