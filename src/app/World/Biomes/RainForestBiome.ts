
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
  private ridges: number;

  constructor(generator: BiomeGenerator) {
    super('RAINFOREST', generator);

    this.a = MathUtils.randomFloat(0, 0.85); // best around 0.65, size of the island
    this.b = MathUtils.randomFloat(0.7, 1.5); // best around 0.80, makes multiple hills even when low
    this.c = MathUtils.randomFloat(0.85, 1.5); // best around 0.85;

    this.amplified = MathUtils.rng() >= 0.25; // magnify everything
    this.spread =  MathUtils.randomFloat(0.95, 2.35); // expand over the map (higher values means more space available for water)

    this.ridges = MathUtils.randomFloat(0.225, 0.375); // makes ridges more prevalent
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
    + this.ridges * this.generator.ridgeNoise(4 * nx,  4 * nz)
    + 0.13 * this.generator.noise(8 * nx,  8 * nz)
    + 0.06 * this.generator.noise(16 * nx, 16 * nz)
    + 0.035 * this.generator.noise(128 * nx, 128 * nz)
    + 0.025 * this.generator.noise(512 * nx, 512 * nz));

    e /= (1.00 + 0.50 + this.ridges + 0.13 + 0.06 + 0.035 + 0.025);

    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return this.amplified ? (e + ne) / 2 : ne;
  }

  getParametersAt(e: number, m: number) : IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.1) {
      return BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.135) {
      if (m > 0.65 + MathUtils.randomFloat(0.01, 0.08)) {
        return BIOMES.RAINFOREST;
      }
      return BIOMES.RAINFOREST_HILLS;
    }

    if (m > 0.6 + MathUtils.randomFloat(0.01, 0.06)) {
      return BIOMES.RAINFOREST_SWAMPS;
    }
    return BIOMES.BEACH;
  }
}

export default RainForestBiome;
