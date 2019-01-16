import { configSvc } from './graphicsConfig.service';

import { IEventAction, IEventCategory } from '@shared/models/monitoring.model';

import { EVENT_CATEGORY, EVENT_ACTION } from '@shared/constants/monitoring.constants';

class MonitoringService {

  categories: IEventCategory;
  actions: IEventAction;

  constructor() {
    this.categories = EVENT_CATEGORY;
    this.actions = EVENT_ACTION;
  }

  sendEvent(category: string, action: string, label?: string, numericValue?: number) {
    ga('send', 'event', category, action, label, numericValue);
    if (configSvc.config.DEBUG) console.log(`event ${category} ${action} sent (${label})`);
  }

}

export const monitoringSvc = new MonitoringService();
export default MonitoringService;
