import { IEnv } from '@shared/models/env.model';

import { DEV_ENV } from './dev.env';
import { PROD_ENV } from './prod.env';

import CommonUtils from '@shared/utils/Common.utils';

export const ENV: IEnv = {
  ...CommonUtils.isDev() ? DEV_ENV : PROD_ENV
};
