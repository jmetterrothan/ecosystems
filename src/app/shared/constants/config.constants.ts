import * as THREE from 'three';

import { IConfig } from '@shared/models/graphicsConfig.model';

import { GraphicsQuality } from '@shared/enums/graphicsQuality.enum';

export const LOW_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 12,
  MAX_RENDERABLE_CHUNKS: 16,

  ENABLE_WATER_EFFECTS: false,
  ENABLE_WEATHER_EFFECTS: false,
  ENABLE_AA: false,
  ENABLE_SHADOWS: false,
  SHADOW_MAP_SIZE: 2048 * 10,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap
};

export const MEDIUM_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 18,
  MAX_RENDERABLE_CHUNKS: 24,

  ENABLE_WATER_EFFECTS: false,
  ENABLE_WEATHER_EFFECTS: true,
  ENABLE_AA: true,
  ENABLE_SHADOWS: false,
  SHADOW_MAP_SIZE: 2048 * 10,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap
};

export const HIGH_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 22,
  MAX_RENDERABLE_CHUNKS: 30,

  ENABLE_WATER_EFFECTS: true,
  ENABLE_WEATHER_EFFECTS: true,
  ENABLE_AA: true,
  ENABLE_SHADOWS: true,
  SHADOW_MAP_SIZE: 2048 * 10,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap
};

export const CONFIGS = {
  [GraphicsQuality.LOW]: LOW_CONFIG,
  [GraphicsQuality.MEDIUM]: MEDIUM_CONFIG,
  [GraphicsQuality.HIGH]: HIGH_CONFIG,
};
