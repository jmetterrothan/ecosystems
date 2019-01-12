import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';

import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import MathUtils from '@shared/utils/Math.utils';

class RainForestBiome extends Biome {
  private a: number;
  private b: number;
  private c: number;

  private amplified: boolean;
  private spread: number;
  private ridges: number;

  constructor(generator: BiomeGenerator) {
    super('RAINFOREST', generator);

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.5;
    this.waterDistortionAmp = 1024.0;

    this.a = MathUtils.randomFloat(0, 0.65); // best around 0.65, size of the island
    this.b = MathUtils.randomFloat(0.85, 1.5); // best around 0.80, makes multiple hills even when low
    this.c = MathUtils.randomFloat(0.85, 1.5); // best around 0.85;

    this.amplified = MathUtils.rng() >= 0.25; // magnify everything
    this.spread = MathUtils.randomFloat(1.15, 2.00); // expand over the map (higher values means more space available for water)

    this.ridges = MathUtils.randomFloat(0.225, 0.35); // makes ridges more prevalent

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.rainforest_visited);
  }

  init(scene: THREE.Scene, terrain: Terrain) { }

  update(delta: number) { }

  handleClick(raycaster: THREE.Raycaster) { }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (1024 * 128);
    const nz = (z - Terrain.SIZE_Z / 2) / (1024 * 128);

    let e = (0.50 * this.generator.noise(1 * nx, 1 * nz)
      + 1.00 * this.generator.noise(2 * nx, 2 * nz)
      + this.ridges * this.generator.ridgeNoise(3 * nx, 3 * nz)
      + 0.13 * this.generator.noise(8 * nx, 8 * nz)
      + 0.06 * this.generator.noise(16 * nx, 16 * nz)
      + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
      + 0.025 * this.generator.noise(512 * nx, 512 * nz));

    e /= (1.00 + 0.50 + this.ridges + 0.13 + 0.06 + 0.035 + 0.025);

    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return this.amplified ? (e + ne) / 1.5 : ne;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards high humidity because it's a rainforest
    return Math.min(value + 0.25, 1.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.1) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.2) {
      if (m > 0.695) {
        return SUB_BIOMES.RAINFOREST;
      }
      return SUB_BIOMES.RAINFOREST_HILLS;
    }

    if (m > 0.625) {
      return SUB_BIOMES.RAINFOREST_SWAMPS;
    }
    return SUB_BIOMES.BEACH;
  }
}

export default RainForestBiome;
