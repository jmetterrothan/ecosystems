import * as THREE from 'three';

import { IConfig } from '@shared/models/graphicsConfig.model';

import { GraphicsQuality } from '@shared/enums/graphicsQuality.enum';

export const LOW_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 10,
  MAX_RENDERABLE_CHUNKS: 14,

  ENABLE_WATER_EFFECTS: false,
  ENABLE_WEATHER_EFFECTS: false,
  ENABLE_AA: false,
  ENABLE_SHADOWS: false,
  SHADOW_MAP_SIZE: 0,
  SHADOW_MAP_TYPE: THREE.BasicShadowMap,
  OBJECT_RECEIVE_SHADOW: false,

  SPAWN: new THREE.Vector3(10000, 0, 10000)
};

export const MEDIUM_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 18,
  MAX_RENDERABLE_CHUNKS: 22,

  ENABLE_WATER_EFFECTS: true,
  ENABLE_WEATHER_EFFECTS: true,
  ENABLE_AA: true,
  ENABLE_SHADOWS: false,
  SHADOW_MAP_SIZE: 0,
  SHADOW_MAP_TYPE: THREE.BasicShadowMap,
  OBJECT_RECEIVE_SHADOW: false,

  SPAWN: new THREE.Vector3(34000, 24000, 34000)
};

export const HIGH_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 24,
  MAX_RENDERABLE_CHUNKS: 28,

  ENABLE_WATER_EFFECTS: true,
  ENABLE_WEATHER_EFFECTS: true,
  ENABLE_AA: true,
  ENABLE_SHADOWS: true,
  SHADOW_MAP_SIZE: 1024 * 16,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap,
  OBJECT_RECEIVE_SHADOW: false,

  SPAWN: new THREE.Vector3(65000, 48000, 65000)
};

export const ULTRA_CONFIG: IConfig = {
  MAX_VISIBLE_CHUNKS: 28,
  MAX_RENDERABLE_CHUNKS: 32,

  ENABLE_WATER_EFFECTS: true,
  ENABLE_WEATHER_EFFECTS: true,
  ENABLE_AA: true,
  ENABLE_SHADOWS: true,
  SHADOW_MAP_SIZE: 1024 * 14,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap,
  OBJECT_RECEIVE_SHADOW: false,

  SPAWN: new THREE.Vector3(65000, 48000, 65000)
};

export const CONFIGS = {
  [GraphicsQuality.LOW]: LOW_CONFIG,
  [GraphicsQuality.MEDIUM]: MEDIUM_CONFIG,
  [GraphicsQuality.HIGH]: HIGH_CONFIG,
  [GraphicsQuality.PHOTO]: ULTRA_CONFIG,
};
