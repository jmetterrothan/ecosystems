export interface IConfig {
  DEBUG: boolean;

  MAX_VISIBLE_CHUNKS: number;
  MAX_RENDERABLE_CHUNKS: number;

  ENABLE_WATER_EFFECTS: boolean;
  ENABLE_WEATHER_EFFECTS: boolean;
  ENABLE_AA: boolean;
  ENABLE_SHADOWS: boolean;

  SHADOW_MAP_SIZE: number;
  SHADOW_MAP_TYPE: THREE.ShadowMapType;
}
