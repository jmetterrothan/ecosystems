import store from 'store';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progression.constants';
import CommonUtils from '@shared/utils/Common.utils';

class ProgressionService {

  init() {
    const storage = CommonUtils.arrayToObject(PROGRESSION_STORAGE_KEYS, 0);
    store.set(STORAGES_KEY.progression, storage);
  }

}

export const progressionSvc = new ProgressionService();
export default ProgressionService;
