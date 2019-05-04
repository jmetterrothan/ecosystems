import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';
import Butterfly from '@boids/creatures/Butterfly';
import MathUtils from '@shared/utils/Math.utils';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '@world/models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

import SwampSFXMp3 from '@sounds/SwampSFX.mp3';

class SwampBiome extends Biome {
  private boids: Boids[];
  private tubecluster: THREE.Object3D;
  private tubecluster2: THREE.Object3D;
  private specialObjectClicked: boolean;

  constructor(terrain: Terrain) {
    super('SWAMPS', terrain);

    this.boids = [];
    this.specialObjectClicked = false;

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.25;
    this.waterDistortionAmp = 512.0;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.swamp_visited);
    this.sound = SwampSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      // special object
      this.tubecluster = this.terrain.placeSpecialObject({
        stackReference: 'tubecluster',
        float: false,
        underwater: ISpecialObjectCanPlaceIn.LAND,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: null }
      });

      this.tubecluster2 = this.terrain.placeSpecialObject({
        stackReference: 'tubecluster2',
        float: false,
        underwater: ISpecialObjectCanPlaceIn.LAND,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: null }
      });

      this.initButterflyBoids();
    }
  }

  private initButterflyBoids() {
    const size = 100000;
    const max = 4;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 30, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const px = size / 2 + point.shift();
      const pz = size / 2 + point.shift();

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 6, Chunk.HEIGHT / 4);
      const py = Math.max(Chunk.SEA_LEVEL + ySize / 2, this.generator.computeHeightAt(px, pz) + ySize / 2 + 4096);

      // butterflies
      const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, ySize, size), new THREE.Vector3(px, py, pz));
      const variant = Butterfly.getButterflyVariant();

      for (let i = 0, n = MathUtils.randomInt(2, 5); i < n; i++) {
        boids.addCreature(new Butterfly(variant));
      }

      this.boids.push(boids);
      it++;
    });
  }

  update(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
  }

  handleClick(raycaster: THREE.Raycaster) {
    this.testSpecialObjectClick(raycaster, this.tubecluster);
    this.testSpecialObjectClick(raycaster, this.tubecluster2);
  }

  private testSpecialObjectClick(raycaster: THREE.Raycaster, object: THREE.Object3D) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([object], true);

    if (intersections.length && !this.specialObjectClicked) {
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

      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.weird_mushroom);
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

    let e = -0.2 * this.generator.noise2(0.35 * nx, 0.35 * nz);
    e += 0.2 * this.generator.noise3(2 * nx, 2 * nz);
    e += 0.15 * this.generator.ridgeNoise2(1 * nx, 1 * nz);
    e += 0.05 * this.generator.ridgeNoise(6 * nx, 6 * nz);
    e += 0.15 * this.generator.noise(4 * nx, 4 * nz);
    e += 0.015 * this.generator.noise(16 * nx, 16 * nz);
    e += 0.0095 * this.generator.noise2(32 * nx, 32 * nz);
    e += 0.0095 * this.generator.ridgeNoise(64 * nx, 64 * nz);

    return e - 0.275;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards high humidity because it's a swamp
    return Math.min(value + 0.35, 1.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.116) {
      if (m > 0.25) {
        return SUB_BIOMES.SWAMP_WATER;
      }
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.1) {
      return SUB_BIOMES.GRASSLAND;
    }

    if (m > 0.525) {
      return SUB_BIOMES.SWAMP;
    }

    return SUB_BIOMES.BEACH;
  }
}

export default SwampBiome;
