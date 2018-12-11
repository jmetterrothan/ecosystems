
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';
import { BIOMES } from '@shared/constants/biome.constants';
import MathUtils from '@shared/utils/Math.utils';

class MountainBiome extends Biome
{
  private spike: number;
  private a: number;
  private b: number;
  private c: number;

  constructor(generator: BiomeGenerator) {
    super('TEST', generator);

    this.spike = MathUtils.randomFloat(0.025, 0.1);
    this.a = MathUtils.randomFloat(0.85, 0.95);
    this.b = MathUtils.randomFloat(0.7, 1.5);
    this.c = MathUtils.randomFloat(0.95, 1.45);
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

    let e = 0.5 * this.generator.ridgeNoise2(1 * nx, 1 * nz);
    e += 0.0035 * this.generator.noise(8 * nx, 8 * nz);
    e += 0.0075 * this.generator.noise2(32 * nx, 32 * nz);
    e += 0.025 * this.generator.ridgeNoise2(8 * nx, 8 * nz);
    e += 0.25 * this.generator.noise(4 * nx, 4 * nz) * this.generator.noise3(nx, nz);

    e /= (0.5 + 0.0035 + 0.0075 + 0.025 + 0.25) - this.spike;

    e **= 1.25;

    const d = 1.50 * BiomeGenerator.getManhattanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return ne;
  }

  getParametersAt(e: number, m: number) : IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.40 - MathUtils.randomFloat(0.01, 0.025)) {
      return BIOMES.OCEAN;
    }

    if (e > Chunk.CLOUD_ELEVATION - 0.5 - MathUtils.randomFloat(0.0, 0.035)) {
      return BIOMES.FROZEN_GRASSLAND;
    }

    if (e > Chunk.SEA_ELEVATION - 0.1 - MathUtils.randomFloat(-0.01, 0.025)) {
      return BIOMES.MOUNTAIN;
    }

    return BIOMES.CORAL_REEF;
  }
}

export default MountainBiome;
