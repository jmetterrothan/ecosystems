import * as THREE from 'three';

import { monitoringSvc } from '@shared/services/monitoring.service';
import ProgressionService, { progressionSvc } from '@achievements/services/progression.service';

import BiomeGenerator from '@world/BiomeGenerator';
import Terrain from '@world/Terrain';
import CommonUtils from '@shared/utils/Common.utils';

import { IBiome } from '@world/models/biome.model';

import { WATER_CONSTANTS } from '@world/constants/water.constants';
import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';

abstract class Biome {
  private static WATER_COLORS = new Map<number, THREE.Color>();

  private name: string;
  protected terrain: Terrain;
  protected temperature: number;
  protected generator: BiomeGenerator;

  protected water: boolean;
  protected waterDistortion: boolean;
  protected waterDistortionFreq: number;
  protected waterDistortionAmp: number;
  protected waterColor1: THREE.Color;
  protected waterColor2: THREE.Color;

  protected progressionSvc: ProgressionService;

  protected sound: any;

  constructor(name: string, terrain: Terrain) {
    this.name = name;
    this.terrain = terrain;

    this.temperature = 20;
    this.generator = terrain.getBiomeGenerator();

    this.progressionSvc = progressionSvc;

    this.water = true;
    this.waterDistortion = true;
    this.waterDistortionFreq = 1.0;
    this.waterDistortionAmp = 1024.0;

    this.waterColor1 = WATER_CONSTANTS.WATER_COLOR_A;
    this.waterColor2 = WATER_CONSTANTS.WATER_COLOR_B;

    progressionSvc.increment(PROGRESSION_COMMON_STORAGE_KEYS.game_played);
    monitoringSvc.sendEvent(monitoringSvc.categories.game, monitoringSvc.actions.played, 'game_played');
  }

  /**
   * Biome init
   */
  init() { }

  /**
   * Biome update
   * @param {number} delta
   */
  update(delta: number) { }

  /**
   * Handle click interaction
   * @param {THREE.Raycaster} raycaster
   */
  handleClick(raycaster: THREE.Raycaster) { }

  /**
   * Retrieve biome object (color and organisms) at the given position
   * @param {number} e elevation (0 - 1)
   * @param {number} m moisture (0 - 1)
   * @return {IBiome}
   */
  abstract getParametersAt(e: number, m: number): IBiome;

  /**
   * Retrieve elevation value (0 - 1)
   * @param {number} x
   * @param {number} z
   * @return {number}
   */
  abstract computeElevationAt(x: number, z: number): number;

  /**
   * Retrieve moisture value (0 - 1)
   * @param {number} x
   * @param {number} z
   * @return {number}
   */

  computeMoistureAt(x: number, z: number): number {
    const nx = x / (1024 * 192);
    const nz = z / (1024 * 192);

    return Math.round(this.generator.noise2(nx, nz) * 100) / 100;
  }

  computeWaterMoistureAt(x: number, z: number): number {
    return this.computeMoistureAt(x, z);
  }

  /**
   * Retrieve water color
   * @param {number} m Moisture
   * @return {THREE.Color}
   */
  getWaterColor(m: number): THREE.Color {
    const value = Math.round(m * 100);

    if (!Biome.WATER_COLORS.has(value)) {
      const hex = CommonUtils.lerpColor(this.waterColor1.getHexString(), this.waterColor2.getHexString(), value / 100);
      Biome.WATER_COLORS.set(value, new THREE.Color(hex));
    }

    return Biome.WATER_COLORS.get(value);
  }

  /**
   * @return string
   */
  getName(): string { return this.name; }
  hasWater(): boolean { return this.water; }
  getWaterDistortion(): boolean { return this.waterDistortion; }
  getWaterDistortionFreq(): number { return this.waterDistortionFreq; }
  getWaterDistortionAmp(): number { return this.waterDistortionAmp; }
  getSound(): string { return this.sound; }
  getTemperature(): number { return this.temperature; }
}

export default Biome;
