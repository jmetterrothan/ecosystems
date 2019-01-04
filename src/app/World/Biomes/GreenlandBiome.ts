import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';

import { PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progressionStorageKeys.constants';

class GreenlandBiome extends Biome {
  private a: number;
  private b: number;
  private c: number;

  private f: number;
  private spread: number;

  constructor(generator: BiomeGenerator) {
    super('GREENLANDS', generator);

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.25;
    this.waterDistortionAmp = 1024.0;

    this.a = MathUtils.randomFloat(0.075, 0.85); // best around 0.65, size of the island
    this.b = MathUtils.randomFloat(0.5, 0.750); // best around 0.80, makes multiple hills even when low
    this.c = MathUtils.randomFloat(0.85, 1.25); // best around 0.85;

    this.spread = MathUtils.randomFloat(1.35, 1.90); // expand over the map (higher values means more space available for water)
    this.f = MathUtils.randomFloat(0.85, 3);

    this.progressionSvc.increment(PROGRESSION_STORAGE_KEYS.greenland_visited_count);
  }

  init(scene: THREE.Scene, terrain: Terrain) { }

  update(delta: number) { }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (2048 * 64);
    const nz = (z - Terrain.SIZE_Z / 2) / (2048 * 64);

    let e = 0.50 * this.generator.noise(1 * nx, 1 * nz)
      + 1.00 * this.generator.noise(2 * nx, 2 * nz)
      + 0.35 * this.generator.ridgeNoise(3 * nx, 3 * nz)
      + 0.13 * this.generator.noise(8 * nx, 8 * nz)
      + 0.06 * this.generator.noise(16 * nx, 16 * nz)
      + 0.035 * this.generator.noise(128 * nx, 128 * nz)
      + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
      + 0.025 * this.generator.noise(512 * nx, 512 * nz)
      // second layer
      + (0.50 * this.generator.noise2(1 * nx, 1 * nz)
        + 1.00 * this.generator.noise3(2 * nx, 2 * nz)
        + 0.4 * this.generator.ridgeNoise2(4 * nx, 4 * nz)
        + 0.13 * this.generator.noise2(8 * nx, 8 * nz)
        + 0.06 * this.generator.noise3(16 * nx, 16 * nz)
        + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
        + 0.025 * this.generator.noise2(512 * nx, 512 * nz));

    e /= 0.5 + 1.0 + 0.35 + 0.13 + 0.06 + 0.035 * 2 + 0.025 + 1.00 + 0.50 + 0.4 + 0.13 + 0.06 + 0.035 + 0.025;
    e **= this.f;
    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    e = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return e;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.05) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.175) {
      return SUB_BIOMES.GRASSLAND;
    }

    if (m > 0.725) {
      return SUB_BIOMES.SWAMP;
    }
    return SUB_BIOMES.BEACH;
  }
}

export default GreenlandBiome;
