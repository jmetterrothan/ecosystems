import UIManager from '@ui/UIManager';

import StorageService from '@shared/services/storage.service';
import GraphicsConfigService from '@shared/services/graphicsConfig.service';
import MonitoringService from '@shared/services/monitoring.service';
import TranslationService from '@shared/services/translation.service';
import UIService from '@ui/services/ui.service';

export interface IUIServices {
  uiSvc?: UIService;
  storageSvc?: StorageService;
  configSvc?: GraphicsConfigService;
  monitoringSvc?: MonitoringService;
  translationSvc?: TranslationService;
}

export interface IManager {
  uiManager: UIManager;
}
