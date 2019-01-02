
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import MathUtils from '@shared/utils/Math.utils';

class SwampBiome extends Biome {
  constructor(generator: BiomeGenerator) {
    super('SWAMPS', generator);

    this.waterDistortion = true;
    this.waterDistortionFreq = 0.5;
    this.waterDistortionAmp = 512.0;
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (1024 * 128);
    const nz = (z - Terrain.SIZE_Z / 2) / (1024 * 128);

    let e = -0.2 * this.generator.noise2(0.35 * nx, 0.35 * nz);
    e += 0.2 * this.generator.noise3(2 * nx, 2 * nz);
    e += 0.15 * this.generator.ridgeNoise2(1 * nx, 1 * nz);
    e += 0.05 * this.generator.ridgeNoise(6 * nx, 6 * nz);
    e += 0.15 * this.generator.noise(4 * nx, 4 * nz);
    e += 0.015 * this.generator.noise(16 * nx, 16 * nz);
    e += 0.0095 * this.generator.noise2(32 * nx, 32 * nz);
    e += 0.0095 * this.generator.ridgeNoise(64 * nx, 64 * nz);

    return e - 0.25;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards high humidity because it's a swamp
    return Math.min(value + 0.35, 1.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.10 - 0.016) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.1) {
      return SUB_BIOMES.GRASSLAND;
    }

    if (m > 0.5 + 0.025) {
      return SUB_BIOMES.SWAMP;
    }

    return SUB_BIOMES.BEACH;
  }
}

export default SwampBiome;
