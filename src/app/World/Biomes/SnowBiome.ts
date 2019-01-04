import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import { IPick } from '@shared/models/pick.model';

class SnowBiome extends Biome {
  constructor(generator: BiomeGenerator) {
    super('SNOW', generator);

    this.waterDistortion = false;

    this.waterColor1 = new THREE.Color(0xc0dade);
    this.waterColor2 = new THREE.Color(0xacd2e5);
  }

  init(scene: THREE.Scene, terrain: Terrain) {
     // corpse
    let chunk: Chunk;
    let corpseItem: IPick;
    let corpseObject: THREE.Object3D;

    do {
      const x = Terrain.SIZE_X / 4 + Math.floor(Math.random() * Terrain.SIZE_X / 2);
      const z = Terrain.SIZE_Z / 4 + Math.floor(Math.random() * Terrain.SIZE_Z / 2);

      chunk = terrain.getChunkAt(x, z);

      const y = terrain.getHeightAt(x, z);
      if (y <= 0) { continue; }

      corpseItem = {
        x, y, z,
        s: World.OBJ_INITIAL_SCALE,
        n: 'snowman',
        r: MathUtils.randomFloat(0, Math.PI * 2)
      };

      corpseObject = chunk.getObject(corpseItem);
    } while (!chunk.canPlaceObject(corpseObject));

    chunk.placeObject(corpseObject, { save: true });
  }

  update(delta: number) { }

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

    return SUB_BIOMES.SNOW;
  }
}

export default SnowBiome;
