import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';

import { CONFIGS } from '@shared/constants/config.constants';
import { IConfig } from '@shared/models/graphicsConfig.model';

class GraphicsConfigService {
  private q: GRAPHICS_QUALITY = GRAPHICS_QUALITY.HIGH;

  set quality(q: GRAPHICS_QUALITY) {
    this.q = q;
  }
  get quality(): GRAPHICS_QUALITY {
    return this.q;
  }

  get config(): IConfig {
    return CONFIGS[this.q];
  }
}

export const configSvc = new GraphicsConfigService();
export default GraphicsConfigService;
