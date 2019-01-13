import * as THREE from 'three';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { IBiome } from '@shared/models/biome.model';

import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

class DesertBiome extends Biome {
  // private vulture: THREE.Object3D;

  constructor(generator: BiomeGenerator) {
    super('DESERT', generator);

    this.waterDistortion = false;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.desert_visited);
  }

  init(scene: THREE.Scene, terrain: Terrain) {
    // corpse
    const centerX = Terrain.SIZE_X / 2;
    const centerZ = Terrain.SIZE_Z / 2;

    const sizeX = 8192;
    const sizeZ = 8192;

    terrain.placeObject('skull', centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);

    // vulture
    // this.vulture = chunk.getObject({ ...corpseItem });
    // this.vulture.position.setY(Chunk.CLOUD_LEVEL);
    // this.vulture.children.forEach((obj: THREE.Mesh) => obj.translateX(-20));
    // chunk.placeObject(this.vulture, { save: true });
  }

  update(delta: number) {
    // this.vulture.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(0.4));
  }

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

    let e = 0.225 * this.generator.noise2(0.75 * nx, 0.75 * nz);
    e += 0.2 * this.generator.noise3(1 * nx, 1 * nz);
    e += 0.075 * this.generator.ridgeNoise(1 * nx, 1 * nz);
    e += 0.00985 * this.generator.ridgeNoise(32 * nx, 32 * nz);
    e += 0.008 * this.generator.noise2(64 * nx, 64 * nz);
    e += 0.075 * this.generator.noise(4 * nx, 4 * nz);

    e ** 0.005;

    return e - 0.135;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards low humidity because it's a desert
    return Math.max(value - 0.5, 0.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.115) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.1) {
      return SUB_BIOMES.DESERT;
    }

    return SUB_BIOMES.OASIS;
  }
}

export default DesertBiome;
