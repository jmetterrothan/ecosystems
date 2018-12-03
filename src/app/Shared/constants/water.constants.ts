import { Color } from 'three';

import CommonUtils from '@shared/utils/Common.utils';

import { IWater } from '@shared/models/water.model';

export const WATER_CONSTANTS: IWater = {
  WATER_COLOR_A: new Color(0x55a6e0),
  WATER_COLOR_B: new Color(0x42a58a),
  WATER_COLOR_TR: new Color(CommonUtils.lerpColor('#55a6e0', '#42a58a', 0.675))
};
