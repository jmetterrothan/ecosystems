import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';
import Butterfly from '@app/boids/creatures/Butterfly';
import MathUtils from '@utils/Math.utils';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '@world/models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import ForestSFXMp3 from '@sounds/ForestSFX.mp3';

class TaigaBiome extends Biome {
  private boids: Boids[];
  private oldLog: THREE.Object3D;

  private specialObjectClicked: boolean = false;

  constructor(terrain: Terrain) {
    super('TAIGA', terrain);

    this.boids = [];

    this.temperature = 25;

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.25;
    this.waterDistortionAmp = 512.0;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.taiga_visited);
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

  initButterflyBoids() {
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

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 4, Chunk.HEIGHT / 3.75) - 3072;
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
   * @param {number} z coord componentw²
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (1024 * 128);
    const nz = (z - Terrain.SIZE_Z / 2) / (1024 * 128);

    let e = 0.235 * this.generator.noise2(0.75 * nx, 0.75 * nz);
    e += 0.2 * this.generator.noise3(1 * nx, 1 * nz);
    e += 0.085 * this.generator.ridgeNoise(1 * nx, 1 * nz);
    e += 0.0125 * this.generator.noise(32 * nx, 32 * nz);
    e += 0.006 * this.generator.noise2(64 * nx, 64 * nz);
    e += 0.075 * this.generator.noise(4 * nx, 4 * nz);

    return e - 0.265;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.115) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.05) {
      if (e > Chunk.SEA_ELEVATION + 0.105) {
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
