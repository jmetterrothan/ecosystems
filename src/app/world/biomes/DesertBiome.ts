import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import * as THREE from 'three';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '../models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import DesertSFXMp3 from '@sounds/DesertSFX.mp3';

class DesertBiome extends Biome {
  private skull: THREE.Object3D;
  private carcass: THREE.Object3D;

  constructor(terrain: Terrain) {
    super('DESERT', terrain);

    this.waterDistortion = false;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.desert_visited);
    this.sound = DesertSFXMp3;
  }

  init() {
    // corpse
    const centerX = Terrain.SIZE_X / 2;
    const centerZ = Terrain.SIZE_Z / 2;

    const sizeX = 8192;
    const sizeZ = 8192;

    this.skull = this.terrain.placeSpecialObject({
      stackReference: 'skull',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.LAND
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);

    this.carcass = this.terrain.placeSpecialObject({
      stackReference: 'carcass',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.LAND
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);

    // vulture
    // this.vulture = chunk.getObject({ ...corpseItem });
    // this.vulture.position.setY(Chunk.CLOUD_LEVEL);
    // this.vulture.children.forEach((obj: THREE.Mesh) => obj.translateX(-20));
    // chunk.placeObject(this.vulture, { save: true });
  }

  update(delta: number) {
    // this.vulture.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(0.4));
  }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.skull, this.carcass], true);

    if (intersections.length) {
      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.archaeology);
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

    let e = 0.225 * this.generator.noise2(0.75 * nx, 0.75 * nz);
    e += 0.2 * this.generator.noise3(1 * nx, 1 * nz);
    e += 0.075 * this.generator.ridgeNoise(1 * nx, 1 * nz);
    e += 0.00985 * this.generator.ridgeNoise(32 * nx, 32 * nz);
    e += 0.008 * this.generator.noise2(64 * nx, 64 * nz);
    e += 0.075 * this.generator.noise(4 * nx, 4 * nz);

    return e - 0.135;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards low humidity because it's a desert
    return Math.max(value - 0.25, 0.0);
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
