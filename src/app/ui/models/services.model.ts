import UIManager from '@ui/UIManager';

import StorageService from '@shared/services/storage.service';
import ConfigService from '@app/shared/services/config.service';
import MonitoringService from '@shared/services/monitoring.service';
import TranslationService from '@shared/services/translation.service';
import UIService from '@ui/services/ui.service';

export interface IUIServices {
  uiManager?: UIManager;
  uiSvc?: UIService;
  storageSvc?: StorageService;
  configSvc?: ConfigService;
  monitoringSvc?: MonitoringService;
  translationSvc?: TranslationService;
}
