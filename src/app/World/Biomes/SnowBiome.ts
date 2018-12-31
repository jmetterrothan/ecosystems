import * as THREE from 'three';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';
import { BIOMES } from '@shared/constants/biome.constants';

class SnowBiome extends Biome {
  constructor(generator: BiomeGenerator) {
    super('SNOW', generator);

    this.waterDistortion = false;

    this.waterColor1 = new THREE.Color(0xc0dade);
    this.waterColor2 = new THREE.Color(0xacd2e5);
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

    let e = 0.2 * this.generator.noise(1 * nx, 1 * nz);
    e += 0.25 * this.generator.noise3(4 * nx, 4 * nz) * this.generator.ridgeNoise2(nx, nz);
    e += 0.0035 * this.generator.noise(8 * nx, 8 * nz);
    e += 0.015 * this.generator.noise(32 * nx, 32 * nz);
    e += 0.035 * this.generator.ridgeNoise2(8 * nx, 8 * nz);

    e /= (0.25 + 0.0035 + 0.015 + 0.025 + 0.25);

    const d = 1.80 * BiomeGenerator.getEuclideanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(0.05, 0.5, 1.00, d, e);

    return ne;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.15) {
      return BIOMES.FROZEN_OCEAN;
    }
    if (e < Chunk.SEA_ELEVATION + 0.15) {
      return BIOMES.FROZEN_BEACH;
    }

    return BIOMES.SNOW;
  }
}

export default SnowBiome;