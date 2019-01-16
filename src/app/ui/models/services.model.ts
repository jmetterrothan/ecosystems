import UIManager from '@ui/UIManager';

import StorageService from '@shared/services/storage.service';
import GraphicsConfigService from '@shared/services/graphicsConfig.service';
import MonitoringService from '@shared/services/monitoring.service';

export interface IServices {
  uiManager?: UIManager;
  storageSvc?: StorageService;
  configSvc?: GraphicsConfigService;
  monitoringSvc?: MonitoringService;
}
