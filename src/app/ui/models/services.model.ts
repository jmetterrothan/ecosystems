import StorageService from '@shared/services/storage.service';
import GraphicsConfigService from '@shared/services/graphicsConfig.service';
import MonitoringService from '@shared/services/monitoring.service';
import UIService, { uiSvc } from '@ui/services/ui.service';

export interface IServices {
  storageSvc?: StorageService;
  configSvc?: GraphicsConfigService;
  monitoringSvc?: MonitoringService;
  uiSvc?: UIService;
}
