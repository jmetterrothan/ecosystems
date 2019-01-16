import UIManager from '@ui/UIManager';
import StorageService from '@shared/services/storage.service';
import GraphicsConfigService from '@shared/services/graphicsConfig.service';
import MonitoringService from '@shared/services/monitoring.service';

export interface IUIServices {
  storageSvc?: StorageService;
  configSvc?: GraphicsConfigService;
  monitoringSvc?: MonitoringService;
}

export interface IManager {
  uiManager: UIManager;
}
