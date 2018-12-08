
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { BIOMES } from '@shared/constants/biome.constants';

class RainForestBiome extends Biome
{
  private a: number;
  private b: number;
  private c: number;

  private amplified: boolean;
  private spread: number;

  constructor(generator: BiomeGenerator) {
    super('RAINFOREST', generator);

    this.a = MathUtils.randomFloat(0.1, 0.8); // best around 0.65;
    this.b = MathUtils.randomFloat(0.7, 1.5); // best around 0.80;
    this.c = MathUtils.randomFloat(0.8, 1.5); // best around 0.80;

    this.amplified = MathUtils.rng() > 0.5; // magnify everything
    this.spread = MathUtils.randomFloat(0.9, 2.35); // expand over the map (higher valuses means more space available for water)
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

    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return this.amplified ? (e + ne) / 2 : ne;
  }

  computeMoistureAt(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 48);
    const nz = z / (Chunk.DEPTH * 48);

    return this.generator.noise(nx, nz);
  }

  getParametersAt(e: number, m: number) : IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.1) {
      return BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.1) {
      return BIOMES.RAINFOREST_HILLS;
    }

    if (m > 0.6) {
      return BIOMES.RAINFOREST_SWAMPS;
    }
    return BIOMES.BEACH;
  }
}

export default RainForestBiome;
