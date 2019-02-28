import * as THREE from 'three';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';

import { IBiome } from '@world/models/biome.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';

import DesertSFXMp3 from '@sounds/DesertSFX.mp3';

class TaigaBiome extends Biome {
  constructor(terrain: Terrain) {
    super('BAMBOO_FOREST', terrain);

    this.temperature = 35;

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.25;
    this.waterDistortionAmp = 512.0;

    // this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.desert_visited);
    this.sound = DesertSFXMp3;
  }

  init() {}

  update(delta: number) {}

  handleClick(raycaster: THREE.Raycaster) {}

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord componentw²
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (1024 * 128);
    const nz = (z - Terrain.SIZE_Z / 2) / (1024 * 128);

    let e = 0.5 * this.generator.noise2(0.75 * nx, 0.75 * nz);
    e += 0.2 * this.generator.noise3(1 * nx, 1 * nz);
    e += 0.075 * this.generator.ridgeNoise(1 * nx, 1 * nz);
    e += 0.00985 * this.generator.noise(32 * nx, 32 * nz);
    e += 0.006 * this.generator.noise2(64 * nx, 64 * nz);
    e += 0.075 * this.generator.noise(4 * nx, 4 * nz);

    return e - 0.35;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.115) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.05) {
      if (e > Chunk.SEA_ELEVATION + 0.125) {
        return SUB_BIOMES.TAIGA_FOREST;
      }
      return SUB_BIOMES.TAIGA_PLAINS;
    }

    if (m > 0.65) {
      return SUB_BIOMES.SWAMP;
    }

    return SUB_BIOMES.BEACH;
  }
}

export default TaigaBiome;
