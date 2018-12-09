
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { BIOMES } from '@shared/constants/biome.constants';

class DesertBiome extends Biome
{
  private a: number;
  private b: number;
  private c: number;

  private f: number;
  private spread: number;

  constructor(generator: BiomeGenerator) {
    super('HIGHLANDS', generator);

    this.a = MathUtils.randomFloat(0.075, 0.85); // best around 0.65, size of the island
    this.b = MathUtils.randomFloat(0.5, 0.750); // best around 0.80, makes multiple hills even when low
    this.c = MathUtils.randomFloat(0.85, 1.25); // best around 0.85;

    this.spread = MathUtils.randomFloat(1.5, 2.25); // expand over the map (higher values means more space available for water)
    this.f = MathUtils.randomFloat(0.85, 3);
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

    let e = 0.50 * this.generator.noise(1 * nx,  1 * nz)
    + 1.00 * this.generator.noise(2 * nx,  2 * nz)
    + 0.35 * this.generator.ridgeNoise(3 * nx,  3 * nz)
    + 0.13 * this.generator.noise(8 * nx,  8 * nz)
    + 0.06 * this.generator.noise(16 * nx, 16 * nz)
    + 0.035 * this.generator.noise(128 * nx, 128 * nz)
    + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
    + 0.025 * this.generator.noise(512 * nx, 512 * nz)
    // second layer
    + (0.50 * this.generator.noise2(1 * nx,  1 * nz)
    + 1.00 * this.generator.noise2(2 * nx,  2 * nz)
    + 0.4 * this.generator.ridgeNoise(4 * nx,  4 * nz)
    + 0.13 * this.generator.noise2(8 * nx,  8 * nz)
    + 0.06 * this.generator.noise2(16 * nx, 16 * nz)
    + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
    + 0.025 * this.generator.noise2(512 * nx, 512 * nz));

    e /= 0.5  + 1.0 + 0.35 + 0.13 + 0.06 + 0.035 * 2 + 0.025 + 1.00 + 0.50 + 0.4 + 0.13 + 0.06 + 0.035 + 0.025;
    e **= this.f;
    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    e = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return e;
  }

  computeMoistureAt(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 96);
    const nz = z / (Chunk.DEPTH * 96);

    return Math.round(this.generator.noise2(nx, nz) * 100) / 100;
  }

  getParametersAt(e: number, m: number) : IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.05) {
      return BIOMES.OCEAN;
    }

    if (e > Chunk.CLOUD_ELEVATION - MathUtils.randomFloat(0.01, 0.095)) {
      if (e > Chunk.CLOUD_ELEVATION + 0.05 && m > 0.5 + MathUtils.randomFloat(0.1, 0.2)) {
        return BIOMES.SNOW;
      }
      return BIOMES.FROZEN_GRASSLAND;
    }

    if (e > Chunk.SEA_ELEVATION + 0.05) {
      if (m < 0.35 + MathUtils.randomFloat(0.00, 0.06)) {
        return BIOMES.TUNDRA;
      }
      return BIOMES.GRASSLAND;
    }

    if (m > 0.5 + MathUtils.randomFloat(0.01, 0.06)) {
      return BIOMES.SWAMP;
    }
    return BIOMES.BEACH;
  }
}

export default DesertBiome;
