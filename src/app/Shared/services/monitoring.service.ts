import Main from '../../Main';

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
    if (Main.DEBUG) console.log(`event ${category} ${action} sent`);
  }

}

export const monitoringSvc = new MonitoringService();
export default MonitoringService;
