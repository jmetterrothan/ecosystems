import * as THREE from 'three';
// import * as TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';
import Boids from '@boids/Boids';
import Butterfly from '@boids/creatures/Butterfly';
import Fish from '@boids/creatures/Fish';
import BubbleEmitter from '@world/biomes/particles/BubbleEmitter';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
// import { ISpecialObjectCanPlaceIn } from '@world/models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import RainSFXMp3 from '@sounds/RainSFX.mp3';

class RainForestBiome extends Biome {
  private a: number;
  private b: number;
  private c: number;

  private amplified: boolean;
  private spread: number;
  private ridges: number;

  private boids: Boids[];
  // private specialObject: THREE.Object3D;
  // private specialObjectClicked: boolean;
  private bubbleEmitter: BubbleEmitter;

  constructor(terrain: Terrain) {
    super('RAINFOREST', terrain);

    this.boids = [];
    // this.specialObjectClicked = false;
    this.bubbleEmitter = new BubbleEmitter();

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.5;
    this.waterDistortionAmp = 1024.0;

    this.a = MathUtils.randomFloat(0, 0.65); // best around 0.65, size of the island
    this.b = MathUtils.randomFloat(0.85, 1.5); // best around 0.80, makes multiple hills even when low
    this.c = MathUtils.randomFloat(0.85, 1.5); // best around 0.85;

    this.amplified = MathUtils.rng() >= 0.25; // magnify everything
    this.spread = MathUtils.randomFloat(1.75, 2.00); // expand over the map (higher values means more space available for water)

    this.ridges = MathUtils.randomFloat(0.225, 0.35); // makes ridges more prevalent

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.rainforest_visited);
    this.sound = RainSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      // special object
      /*
      this.specialObject = this.terrain.placeSpecialObject({
        stackReference: '',
        float: false,
        underwater: ISpecialObjectCanPlaceIn.LAND,
        e: { low: Chunk.SEA_ELEVATION + 0.65, high: null }
      });
      */

      this.initButterflyBoids();
      this.initFishBoids();
      this.bubbleEmitter.init(this.terrain.getScene(), this.generator);
    }
  }

  initButterflyBoids() {
    const size = 85000;
    const max = 2;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 30, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const px = size / 2 + point.shift();
      const pz = size / 2 + point.shift();

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 6, Chunk.HEIGHT / 4);
      const py = Math.max(Chunk.SEA_LEVEL + ySize / 2, this.generator.computeHeightAt(px, pz) + ySize / 3);

      // butterflies
      const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, ySize, size), new THREE.Vector3(px, py, pz));
      const variant = Butterfly.getButterflyVariant();

      for (let i = 0, n = MathUtils.randomInt(2, 4); i < n; i++) {
        boids.addCreature(new Butterfly(variant));
      }

      this.boids.push(boids);
      it++;
    });
  }

  initFishBoids() {
    // boids
    const size = 40000;
    const max = 3;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 60, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const n = MathUtils.randomInt(2, 4);
      const px = point.shift() + size / 2;
      const pz = point.shift() + size / 2;

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 3.75, Chunk.HEIGHT / 3) - 3072;
      const py = Chunk.SEA_LEVEL - 3072 - ySize / 2;

      const minSize = size - 1000;
      if (this.generator.computeHeightAt(px - minSize / 2, pz - minSize / 2) >= py + ySize / 2) return;
      if (this.generator.computeHeightAt(px - minSize / 2, pz - minSize / 2) >= py - ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz - minSize / 2) >= py + ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz - minSize / 2) >= py - ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz + minSize / 2) >= py + ySize / 2) return;
      if (this.generator.computeHeightAt(px + minSize / 2, pz + minSize / 2) >= py - ySize / 2) return;

      const m = this.generator.computeWaterMoistureAt(px, pz);
      const fishClass = Fish.getFishClass(m);

      // fishs
      const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, ySize, size), new THREE.Vector3(px, py, pz));
      for (let i = 0; i < n; i++) {
        boids.addCreature(new fishClass());
      }

      this.boids.push(boids);
      it++;
    });
  }

  update(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
    this.bubbleEmitter.update(delta);
  }

  handleClick(raycaster: THREE.Raycaster) {
    /*
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.specialObject], true);

    if (intersections.length && !this.specialObjectClicked) {

      new TWEEN.Tween(this.specialObject.position)
        .to({ y: this.specialObject.position.y + 1000 }, 250)
        .easing(TWEEN.Easing.Cubic.Out)
        .repeat(1)
        .yoyo(true)
        .start();

      new TWEEN.Tween(this.specialObject.rotation)
        .to({ y: this.specialObject.rotation.y + Math.PI / 6 }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      this.specialObjectClicked = true;

      // this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.woodcutter);
    }
    */
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

    // const m = this.computeMoistureAt(x, z);

    let e = (0.50 * this.generator.noise(1 * nx, 1 * nz)
      + 1.00 * this.generator.noise(2 * nx, 2 * nz)
      + this.ridges * this.generator.ridgeNoise(3 * nx, 3 * nz)
      + 0.13 * this.generator.noise(8 * nx, 8 * nz)
      + 0.06 * this.generator.noise(16 * nx, 16 * nz)
      + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
      + 0.025 * this.generator.noise(512 * nx, 512 * nz));

    e /= (1.00 + 0.50 + this.ridges + 0.13 + 0.06 + 0.035 + 0.025);

    const d = this.spread * BiomeGenerator.getEuclideanDistance(nx, nz);
    const ne = BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);

    return this.amplified ? (e + ne) / 1.15 : ne;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards high humidity because it's a rainforest
    return Math.min(value + 0.25, 1.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.1) {
      if (m > 0.625) {
        return SUB_BIOMES.SWAMP_WATER;
      }
      return SUB_BIOMES.TROPICAL_OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.2) {
      if (m > 0.695) {
        return SUB_BIOMES.RAINFOREST;
      }
      return SUB_BIOMES.RAINFOREST_HILLS;
    }

    if (m > 0.625) {
      return SUB_BIOMES.RAINFOREST_SWAMPS;
    }
    return SUB_BIOMES.BEACH;
  }
}

export default RainForestBiome;
