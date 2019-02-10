import { IEventAction, IEventCategory } from '@shared/models/monitoring.model';

import { EVENT_CATEGORY, EVENT_ACTION } from '@shared/constants/monitoring.constants';
import { storageSvc } from './storage.service';

import CookiesConsent from '@components/cookies/cookies-consent';

import CommonUtils from '@utils/Common.utils';

class MonitoringService {

  categories: IEventCategory;
  actions: IEventAction;

  constructor() {
    this.categories = EVENT_CATEGORY;
    this.actions = EVENT_ACTION;
  }

  sendEvent(category: string, action: string, label?: string, numericValue?: number) {
    if (storageSvc.get(CookiesConsent.COOKIES_STORAGE_KEY)) {
      ga('send', 'event', category, action, label, numericValue);
      if (CommonUtils.isDev()) console.log(`event ${category} ${action} sent (${label})`);
    }
  }

}

export const monitoringSvc = new MonitoringService();
export default MonitoringService;
