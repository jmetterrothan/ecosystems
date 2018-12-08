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

  constructor(name: string, generator: BiomeGenerator) {
    this.name = name;
    this.generator = generator;
  }
  abstract getParametersAt(e: number, m: number) : IBiome;
  abstract computeElevationAt(x: number, z: number): number;
  abstract computeMoistureAt(x: number, z: number): number;

  getWaterColor(m: number): THREE.Color {
    const value = Math.round(m * 100);
    if (!Biome.WATER_COLORS.has(value)) {
      Biome.WATER_COLORS.set(value, new THREE.Color(CommonUtils.lerpColor(WATER_CONSTANTS.WATER_COLOR_A.getHexString(), WATER_CONSTANTS.WATER_COLOR_B.getHexString(), value / 100)));
    }
    return Biome.WATER_COLORS.get(value);
  }

  getName(): string { return this.name; }
}

export default Biome;
