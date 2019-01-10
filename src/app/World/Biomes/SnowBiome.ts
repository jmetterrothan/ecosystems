import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';
import { IPick } from '@shared/models/pick.model';

import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import MathUtils from '@shared/utils/Math.utils';

class SnowBiome extends Biome {

  private snowmanChunk: Chunk;
  private snowmanItem: IPick;
  private snowmanObject: THREE.Object3D;

  constructor(generator: BiomeGenerator) {
    super('SNOW', generator);

    this.waterDistortion = false;

    this.waterColor1 = new THREE.Color(0xc0dade);
    this.waterColor2 = new THREE.Color(0xacd2e5);

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.snow_visited);
  }

  init(scene: THREE.Scene, terrain: Terrain) {
    do {
      const x = Terrain.SIZE_X / 4 + Math.floor(MathUtils.rng() * Terrain.SIZE_X / 2);
      const z = Terrain.SIZE_Z / 4 + Math.floor(MathUtils.rng() * Terrain.SIZE_Z / 2);

      this.snowmanChunk = terrain.getChunkAt(x, z);

      const y = terrain.getHeightAt(x, z);
      if (y <= 0) { continue; }

      this.snowmanItem = {
        x, y, z,
        s: World.OBJ_INITIAL_SCALE,
        n: 'snowman_no_carrot',
        r: MathUtils.randomFloat(0, Math.PI * 2)
      };

      this.snowmanObject = this.snowmanChunk.getObject(this.snowmanItem);
    } while (!this.snowmanChunk.canPlaceObject(this.snowmanObject));

    this.snowmanChunk.placeObject(this.snowmanObject, { save: true });
  }

  update(delta: number) { }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.snowmanObject], true);

    if (intersections.length && this.snowmanItem.n !== 'snowman') {
      this.snowmanItem = { ...this.snowmanItem, n: 'snowman' };
      this.snowmanChunk.repurposeObject(this.snowmanObject);
      this.snowmanObject = this.snowmanChunk.getObject(this.snowmanItem);
      this.snowmanChunk.placeObject(this.snowmanObject, { save: true });
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
