import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import Biome from '@world/Biome';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';
import Boids from '@app/boids/Boids';
import Butterfly from '@app/boids/creatures/Butterfly';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '../models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import ForestSFXMp3 from '@sounds/ForestSFX.mp3';

class FjordBiome extends Biome {
  private depth: number;

  private e: number;
  private boids: Boids[];
  private oldLog: THREE.Object3D;

  private specialObjectClicked: boolean = false;

  constructor(terrain: Terrain) {
    super('FJORD', terrain);

    this.boids = [];

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.25;
    this.waterDistortionAmp = 1024.0;
    this.waterColor1 = new THREE.Color(0x79A7A8);

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.fjord_visited);

    this.e = MathUtils.randomFloat(1.85, 2.5);
    this.depth = MathUtils.randomFloat(0.2, 0.4);

    this.sound = ForestSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      // special object
      this.oldLog = this.terrain.placeSpecialObject({
        stackReference: 'old_log',
        float: false,
        underwater: ISpecialObjectCanPlaceIn.LAND,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 }
      });

      this.initButterflyBoids();
    }
  }

  private initButterflyBoids() {
    const size = 32500;
    const max = 4;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 60, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const n = MathUtils.randomInt(2, 5);
      const px = point.shift() + size / 2;
      const pz = point.shift() + size / 2;

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 3.75, Chunk.HEIGHT / 3) - 3072;
      const py = ySize / 2;

      const minSize = size - 1000;
      if (this.generator.computeHeightAt(px - minSize / 2, pz - minSize / 2) >= py + ySize / 2) return;
      if (this.generator.computeHeightAt(px - minSize / 2, pz - minSize / 2) >= py - ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz - minSize / 2) >= py + ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz - minSize / 2) >= py - ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz + minSize / 2) >= py + ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz + minSize / 2) >= py - ySize / 2) return;

      // butterflies
      const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, ySize, size), new THREE.Vector3(px, py, pz));
      const variant = Butterfly.getButterflyVariant();
      for (let i = 0; i < n; i++) {
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
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.oldLog], true);

    if (intersections.length && !this.specialObjectClicked) {

      new TWEEN.Tween(this.oldLog.position)
        .to({ y: this.oldLog.position.y + 1000 }, 250)
        .easing(TWEEN.Easing.Cubic.Out)
        .repeat(1)
        .yoyo(true)
        .start();

      new TWEEN.Tween(this.oldLog.rotation)
        .to({ y: this.oldLog.rotation.y + Math.PI / 6 }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      this.specialObjectClicked = true;

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

    return (e ** this.e * 1.65) - this.depth;
  }

  getParametersAt(e: number, m: number): IBiome {
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
