import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';

import { CONFIGS } from '@shared/constants/config.constants';
import { IConfig } from '@shared/models/graphicsConfig.model';

import CommonUtils from '@shared/utils/Common.utils';

class ConfigService {
  private q: GRAPHICS_QUALITY = GRAPHICS_QUALITY.HIGH;
  private d: boolean = CommonUtils.isDev();

  set quality(q: GRAPHICS_QUALITY) {
    this.q = q;
  }
  get quality(): GRAPHICS_QUALITY {
    return this.q;
  }

  set debug(d: boolean) {
    this.d = d;
  }

  get debug(): boolean {
    return this.d;
  }

  get config(): IConfig {
    return CONFIGS[this.q];
  }
}

export const configSvc = new ConfigService();
export default ConfigService;
