import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';
import Terrain from './Terrain';
import CommonUtils from '@shared/utils/Common.utils';

import { IBiome } from '@shared/models/biome.model';
import { WATER_CONSTANTS } from '@shared/constants/water.constants';

import ProgressionService, { progressionSvc } from '@services/progression.service';
import { PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progression.constants';
import MonitoringService, { monitoringSvc } from '@shared/services/monitoring.service';

abstract class Biome {
  private static WATER_COLORS = new Map<number, THREE.Color>();

  private name: string;
  protected generator: BiomeGenerator;

  protected waterDistortion: boolean;
  protected waterDistortionFreq: number;
  protected waterDistortionAmp: number;
  protected waterColor1: THREE.Color;
  protected waterColor2: THREE.Color;

  protected progressionSvc: ProgressionService;
  protected monitoringSvc: MonitoringService;

  constructor(name: string, generator: BiomeGenerator) {
    this.name = name;
    this.generator = generator;

    this.progressionSvc = progressionSvc;
    this.monitoringSvc = monitoringSvc;

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.0;
    this.waterDistortionAmp = 1024.0;

    this.waterColor1 = WATER_CONSTANTS.WATER_COLOR_A;
    this.waterColor2 = WATER_CONSTANTS.WATER_COLOR_B;

    this.progressionSvc.increment(PROGRESSION_STORAGE_KEYS.game_played_count);
    this.monitoringSvc.sendEvent(this.monitoringSvc.categories.game, this.monitoringSvc.actions.played, PROGRESSION_STORAGE_KEYS.game_played_count);
  }

  /**
   * Biome init
   * @param {THREE.Scene} scene
   * @param {Terrain} terrain
   */
  abstract init(scene: THREE.Scene, terrain: Terrain);

  /**
   * Biome update
   * @param {number} delta
   */
  abstract update(delta: number);

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

  getWaterDistortion(): boolean { return this.waterDistortion; }
  getWaterDistortionFreq(): number { return this.waterDistortionFreq; }
  getWaterDistortionAmp(): number { return this.waterDistortionAmp; }
}

export default Biome;
