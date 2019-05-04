import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import Boids from '@app/boids/Boids';
import Fly from '@app/boids/creatures/Fly';
import MathUtils from '@app/shared/utils/Math.utils';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '../models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

import DesertSFXMp3 from '@sounds/DesertSFX.mp3';

class DesertBiome extends Biome {
  private boids: Boids[];

  private skull: THREE.Object3D;
  private carcass: THREE.Object3D;

  private specialObjectClicked: boolean = false;

  constructor(terrain: Terrain) {
    super('DESERT', terrain);

    this.boids = [];

    this.temperature = 45;

    this.waterDistortion = false;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.desert_visited);
    this.sound = DesertSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      this.initSpecialObject();
      this.initFlyBoids();
    }
  }

  private initSpecialObject() {
    // corpse
    const centerX = Terrain.SIZE_X / 2;
    const centerZ = Terrain.SIZE_Z / 2;

    const sizeX = 8192;
    const sizeZ = 8192;

    this.skull = this.terrain.placeSpecialObject({
      stackReference: 'skull',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.BOTH
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);

    this.carcass = this.terrain.placeSpecialObject({
      stackReference: 'carcass',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.BOTH
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);
  }

  private initFlyBoids() {
    const size = MathUtils.randomInt(100000, 140000);

    const px = this.carcass.position.x;
    const pz = this.carcass.position.z;

    const sy = 40960;
    const py = Math.max(Chunk.SEA_LEVEL + sy / 2, this.generator.computeHeightAt(px, pz) + sy / 3);

    // flies
    const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, sy, size), new THREE.Vector3(px, py, pz));
    for (let i = 0, n = MathUtils.randomInt(4, 8); i < n; i++) {
      boids.addCreature(new Fly());
    }

    this.boids.push(boids);
  }

  update(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
  }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.skull, this.carcass], true);

    if (intersections.length) {
      const object = intersections[0].object.parent;
      if (object.userData.stackReference && !this.specialObjectClicked) {

        new TWEEN.Tween(object.position)
          .to({ y: object.position.y + 1000 }, 250)
          .easing(TWEEN.Easing.Cubic.Out)
          .repeat(1)
          .yoyo(true)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({ y: object.rotation.y + Math.PI / 6 }, 500)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();

        this.specialObjectClicked = true;
      }

      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.archaeology);
    }
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord componentw²
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
