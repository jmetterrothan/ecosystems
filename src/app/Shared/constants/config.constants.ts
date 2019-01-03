import * as THREE from 'three';

import CommonUtils from '@shared/utils/Common.utils';

export const DEFAULT_CONFIG = {
  DEBUG: CommonUtils.isDev(),
  MAX_VISIBLE_CHUNKS: 16,
  MAX_RENDERABLE_CHUNKS: 30,
  ENABLE_WATER_EFFECTS: false,
  ENABLE_WEATHER_EFFECTS: false,
  ENABLE_SHADOWS: false,
  ENABLE_AA: false,
  SHADOW_MAP_SIZE: 4096,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap
};

export const CONFIG = DEFAULT_CONFIG;
