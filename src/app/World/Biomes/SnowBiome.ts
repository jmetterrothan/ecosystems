import * as THREE from 'three';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';

import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@app/Achievements/constants/progressionExtrasStorageKeys.constants';

class SnowBiome extends Biome {
  private snowmanObject: THREE.Object3D;

  constructor(terrain: Terrain) {
    super('SNOW', terrain);

    this.waterDistortion = false;

    this.waterColor1 = new THREE.Color(0xc0dade);
    this.waterColor2 = new THREE.Color(0xacd2e5);

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.snow_visited);
  }

  init() {
    // snowman
    this.snowmanObject = this.terrain.placeSpecialObject({ stackReference: 'snowman_no_carrot', float: false, underwater: false });
  }

  update(delta: number) { }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.snowmanObject], true);

    if (intersections.length && this.snowmanObject.userData.stackReference !== 'snowman') {
      const item = Chunk.convertObjectToPick(this.snowmanObject);
      const newItem = { ...item, n: 'snowman' };
      const chunk: Chunk = this.terrain.getChunkAt(item.p.x, item.p.z);

      chunk.repurposeObject(this.snowmanObject);
      this.snowmanObject = chunk.getObject(newItem);
      chunk.placeObject(this.snowmanObject, { save: true });

      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.snowman_carrot);
    }
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
      return SUB_BIOMES.FROZEN_OCEAN;
    }
    if (e < Chunk.SEA_ELEVATION + 0.15) {
      return SUB_BIOMES.FROZEN_BEACH;
    }
    if (e < Chunk.SEA_ELEVATION + 0.225) {
      return SUB_BIOMES.FROZEN_GRASSLAND;
    }

    return SUB_BIOMES.SNOW;
  }
}

export default SnowBiome;
