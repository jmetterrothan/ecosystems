import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';
import CommonUtils from '@shared/utils/Common.utils';

import { IBiome } from '@shared/models/biome.model';
import { WATER_CONSTANTS } from '@shared/constants/water.constants';

abstract class Biome
{
  private static WATER_COLORS = new Map<number, THREE.Color>();

  private name: string;
  protected generator: BiomeGenerator;
  protected waterColor1: THREE.Color;
  protected waterColor2: THREE.Color;

  constructor(name: string, generator: BiomeGenerator) {
    this.name = name;
    this.generator = generator;

    this.waterColor1 = WATER_CONSTANTS.WATER_COLOR_A;
    this.waterColor2 = WATER_CONSTANTS.WATER_COLOR_B;
  }

  /**
   * Retrieve biome object at the given position
   * @param {number} e elevation (0 - 1)
   * @param {number} m moisture (0 - 1)
   * @return {IBiome}
   */
  abstract getParametersAt(e: number, m: number) : IBiome;

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
  abstract computeMoistureAt(x: number, z: number): number;

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
}

export default Biome;
