import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';
import Bee from '@app/boids/creatures/Bee';
import MathUtils from '@shared/utils/Math.utils';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '../models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

import HighlandSFXMp3 from '@sounds/HighlandSFX.mp3';

class HighlandBiome extends Biome {
  private a: number;
  private b: number;
  private c: number;

  private f: number;
  private spread: number;

  private boids: Boids[];
  private scarecrow: THREE.Object3D;

  constructor(terrain: Terrain) {
    super('HIGHLANDS', terrain);

    this.boids = [];

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.25;
    this.waterDistortionAmp = 1024.0;

    this.a = MathUtils.randomFloat(0.075, 0.3); // best around 0.65, size of the island
    this.b = MathUtils.randomFloat(0.5, 0.750); // best around 0.80, makes multiple hills even when low
    this.c = MathUtils.randomFloat(0.85, 1.00); // best around 0.85;

    this.spread = MathUtils.randomFloat(1.5, 2); // expand over the map (higher values means more space available for water)
    this.f = MathUtils.randomFloat(0.95, 3);

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.highland_visited);
    this.sound = HighlandSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      // scarecrow
      this.scarecrow = this.terrain.placeSpecialObject({
        stackReference: 'scarecrow',
        float: false,
        underwater: ISpecialObjectCanPlaceIn.LAND,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.3 }
      });

      this.initBeeBoids();
    }
  }

  private initBeeBoids() {
    const size = MathUtils.randomInt(100000, 140000);
    const max = 2;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 30, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const px = size / 2 + point.shift();
      const pz = size / 2 + point.shift();

      const sy = MathUtils.randomFloat(Chunk.HEIGHT / 5, Chunk.HEIGHT / 3);
      const py = Math.max(Chunk.SEA_LEVEL + sy / 2, this.generator.computeHeightAt(px, pz) + sy / 3);

      // bee
      const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, sy, size), new THREE.Vector3(px, py, pz));
      for (let i = 0, n = MathUtils.randomInt(4, 8); i < n; i++) {
        boids.addCreature(new Bee());
      }

      this.boids.push(boids);
      it++;
    });
  }

  update(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
  }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.scarecrow], true);

    if (intersections.length) {
      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.find_scarecrow);
      new TWEEN.Tween(this.scarecrow.rotation)
        .to({ y: this.scarecrow.rotation.y + Math.PI * 2 }, 1200)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();
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

    let e = 0.50 * this.generator.noise(1 * nx, 1 * nz)
      + 1.00 * this.generator.noise(2 * nx, 2 * nz)
      + 0.35 * this.generator.ridgeNoise(3 * nx, 3 * nz)
      + 0.13 * this.generator.noise(8 * nx, 8 * nz)
      + 0.06 * this.generator.noise(16 * nx, 16 * nz)
      + 0.035 * this.generator.noise(128 * nx, 128 * nz)
      + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
      + 0.025 * this.generator.noise(512 * nx, 512 * nz)
      // second layer
      + (0.50 * this.generator.noise2(1 * nx, 1 * nz)
        + 1.00 * this.generator.noise3(2 * nx, 2 * nz)
        + 0.2 * this.generator.ridgeNoise2(4 * nx, 4 * nz)
        + 0.13 * this.generator.noise2(8 * nx, 8 * nz)
        + 0.06 * this.generator.noise3(16 * nx, 16 * nz)
        + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
        + 0.025 * this.generator.noise2(512 * nx, 512 * nz));

    e /= 0.5 + 1.0 + 0.35 + 0.13 + 0.06 + 0.035 * 2 + 0.025 + 1.00 + 0.50 + 0.2 + 0.13 + 0.06 + 0.035 + 0.025;
    e **= this.f;
    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    e = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return e;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards high humidity
    return Math.min(value + 0.2, 1.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.05) {
      if (m > 0.625) {
        return SUB_BIOMES.SWAMP_WATER;
      }
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.CLOUD_ELEVATION + 0.075) {
      return SUB_BIOMES.MOUNTAIN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.15) {
      if (e > Chunk.SEA_ELEVATION + 0.25 && m > 0.925) {
        // return SUB_BIOMES.GRASSLAND;
      }
      return SUB_BIOMES.TUNDRA;
    }

    return SUB_BIOMES.SWAMP;
  }
}

export default HighlandBiome;
