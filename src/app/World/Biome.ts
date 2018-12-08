import * as THREE from 'three';

import Terrain from './Terrain';
import MathUtils from '@shared/utils/Math.utils';
import BiomeGenerator from '@world/BiomeGenerator';
import CommonUtils from '@shared/utils/Common.utils';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';
import { WATER_CONSTANTS } from '@shared/constants/water.constants';
import { BIOMES } from '@shared/constants/biome.constants';

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

export class RainForestBiome extends Biome
{
  private a: number;
  private b: number;
  private c: number;

  private amplified: boolean;

  constructor(generator: BiomeGenerator) {
    super('RAINFOREST', generator);

    this.a = MathUtils.randomFloat(0.1, 0.8); // best around 0.65;
    this.b = MathUtils.randomFloat(0.7, 1.5); // best around 0.80;
    this.c = MathUtils.randomFloat(0.8, 1.5); // best around 0.80;

    this.amplified = MathUtils.rng() > 0.5;
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (Chunk.WIDTH * 64);
    const nz = (z - Terrain.SIZE_Z / 2) / (Chunk.DEPTH * 64);

    let e = (0.50 * this.generator.noise(1 * nx,  1 * nz)
    + 1.00 * this.generator.noise(2 * nx,  2 * nz)
    + 0.25 * this.generator.ridgeNoise(4 * nx,  4 * nz)
    + 0.13 * this.generator.noise(8 * nx,  8 * nz)
    + 0.06 * this.generator.noise(16 * nx, 16 * nz)
    + 0.035 * this.generator.noise(128 * nx, 128 * nz)
    + 0.025 * this.generator.noise(512 * nx, 512 * nz));
    e /= (1.00 + 0.50 + 0.25 + 0.13 + 0.06 + 0.035 + 0.025);

    const d = BiomeGenerator.getEuclideanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return this.amplified ? (e + ne) / 2 : ne;
  }

  computeMoistureAt(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 48);
    const nz = z / (Chunk.DEPTH * 48);

    return this.generator.noise(nx, nz);
  }

  getParametersAt(e: number, m: number) : IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.05) {
      return BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.075) {
      return BIOMES.RAINFOREST;
    }

    if (m > 0.6) {
      return BIOMES.SWAMP;
    }
    return BIOMES.BEACH;
  }
}

export default Biome;
