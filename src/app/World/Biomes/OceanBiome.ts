
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';
import { BIOMES } from '@shared/constants/biome.constants';
import MathUtils from '@shared/utils/Math.utils';

class OceanBiome extends Biome
{
  spike: number;
  depth: number;

  constructor(generator: BiomeGenerator) {
    super('OCEAN', generator);

    this.spike = MathUtils.randomFloat(0.025, 0.125);
    this.depth = MathUtils.randomFloat(0.175, 0.3);
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

    let e = 0.2 * this.generator.noise(1 * nx, 1 * nz);
    e += 0.0035 * this.generator.noise(8 * nx, 8 * nz);
    e += 0.015 * this.generator.noise(32 * nx, 32 * nz);
    e += 0.025 * this.generator.ridgeNoise2(8 * nx, 8 * nz);
    e += 0.25 * this.generator.noise(4 * nx, 4 * nz) * this.generator.noise3(nx, nz);

    e /= (0.25 + 0.0035 + 0.015 + 0.025 + 0.25) - this.spike;

    e **= 2.5;
    return e - this.depth;
  }

  getParametersAt(e: number, m: number) : IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.05) {
      return BIOMES.OCEAN;
    }

    return BIOMES.BEACH;
  }
}

export default OceanBiome;
