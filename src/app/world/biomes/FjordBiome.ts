import * as THREE from 'three';

import Biome from '@world/Biome';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@world/models/biome.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import ForestSFXMp3 from '@sounds/ForestSFX.mp3';

class FjordBiome extends Biome {
  private e: number;

  private oldLog: THREE.Object3D;

  constructor(terrain: Terrain) {
    super('FJORD', terrain);

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.25;
    this.waterDistortionAmp = 1024.0;
    this.waterColor1 = new THREE.Color(0x79A7A8);

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.fjord_visited);

    this.e = MathUtils.randomFloat(1.85, 2.5);
    this.sound = ForestSFXMp3;
  }

  init() {
    this.oldLog = this.terrain.placeSpecialObject({ stackReference: 'old_log', float: false, underwater: false, e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 } });
  }

  update(delta: number) { }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.oldLog], true);

    if (intersections.length) {
      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.woodcutter);
    }
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (2048 * 64);
    const nz = (z - Terrain.SIZE_Z / 2) / (2048 * 64);

    let e = 1.00 * this.generator.noise(0.75 * nx, 0.75 * nz);
    e += 0.1 * this.generator.noise2(nx * 4, nz * 4);
    e += 0.035 * this.generator.ridgeNoise(nx * 8, nz * 8);
    e += 0.005 * this.generator.ridgeNoise(nx * 32, nz * 32);
    e += 0.001 * this.generator.ridgeNoise(nx * 256, nz * 256);
    e += 0.01 * this.generator.noise2(nx * 16, nz * 16);
    e += 0.01 * this.generator.ridgeNoise2(nx * 32, nz * 32);
    e += 0.05 * this.generator.noise(nx * 8, nz * 8);

    e /= 0.9 + 0.1 + 0.05 + 0.01 + 0.01 + 0.05;

    return (e ** this.e * 1.65) - 0.2;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e > Chunk.CLOUD_ELEVATION + 0.02) {
      if (m > 0.5) return SUB_BIOMES.FJORD_SNOW_CAP;
      return SUB_BIOMES.MOUNTAIN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.15) {
      return SUB_BIOMES.FJORD;
    }

    if (e > Chunk.SEA_ELEVATION - 0.05) {
      return SUB_BIOMES.FJORD_BEACH;
    }

    if (m > 0.625) {
      return SUB_BIOMES.SWAMP_WATER;
    }
    return SUB_BIOMES.OCEAN;
  }
}

export default FjordBiome;
