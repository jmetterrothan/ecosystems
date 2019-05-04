import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';
import Boids from '@boids/Boids';
import Fish from '@boids/creatures/Fish';
import BubbleEmitter from '@world/biomes/particles/BubbleEmitter';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '../models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

import WaterSFXMp3 from '@sounds/WaterSFX.mp3';

class OceanBiome extends Biome {
  private spike: number;
  private depth: number;
  private flat: boolean;

  private boids: Boids[];

  private chestBottom: THREE.Object3D;
  private chestTop: THREE.Object3D;
  private chestOpened: boolean = false;

  private bubbleEmitter: BubbleEmitter;

  constructor(terrain: Terrain) {
    super('OCEAN', terrain);

    this.boids = [];
    this.bubbleEmitter = new BubbleEmitter();

    this.spike = MathUtils.randomFloat(0.025, 0.125);
    this.depth = 1.425;
    this.flat = MathUtils.rng() >= 0.25;

    this.waterColor1 = new THREE.Color(0x07c9d0);
    this.waterColor2 = new THREE.Color(0x3e73d4);

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.5;
    this.waterDistortionAmp = 2048.0;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.ocean_visited);
    this.sound = WaterSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      this.initSpecialObject();
      this.initFishBoids();
      this.bubbleEmitter.init(this.terrain.getScene(), this.generator);
    }
  }

  private initSpecialObject() {
    // chest
    const centerX = Terrain.SIZE_X / 2;
    const centerZ = Terrain.SIZE_Z / 2;

    const sizeX = 8192;
    const sizeZ = 8192;

    const rotation = new THREE.Vector3(0, MathUtils.randomFloat(0, Math.PI * 2), 0);

    this.chestBottom = this.terrain.placeSpecialObject({
      rotation,
      stackReference: 'chest_part2',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.WATER
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);

    this.chestTop = this.terrain.placeSpecialObject({
      rotation,
      position: this.chestBottom.position.clone(),
      stackReference: 'chest_part1',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.WATER
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);
  }

  private initFishBoids() {
    const minSize = 60000;
    const maxSize = 120000;
    const size = MathUtils.randomFloat(minSize, maxSize);
    const max = 4;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 30, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const nbMax = (size * 20 / maxSize) || 0; // maximum nb based on boids size
      const n = MathUtils.randomInt(2, nbMax);
      const px = size / 2 + point.shift();
      const pz = size / 2 + point.shift();

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 3.75, Chunk.HEIGHT / 3) - 5120;
      const py = Chunk.SEA_LEVEL - 5120 - ySize / 2;

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
    this.updateFishBoids(delta);
    this.bubbleEmitter.update(delta);
  }

  private updateFishBoids(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
  }

  handleClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.chestBottom, this.chestTop], true);

    if (intersections.length && !this.chestOpened) {
      new TWEEN.Tween(this.chestTop.rotation)
        .to({ y: this.chestTop.rotation.y + Math.PI / 10, }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
      new TWEEN.Tween(this.chestTop.position)
        .to({ x: this.chestTop.position.x + 800, z: this.chestTop.position.z + 800 }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
        .onComplete(() => {
          this.chestTop.updateMatrix();
          // bubbles coming out of the chest
          this.bubbleEmitter.createEmitter(this.terrain.getScene(), this.chestTop.position, 3072, 8);
        });

      this.chestOpened = true;

      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.find_captain_treasure);
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

    let e = 0;
    const m = this.computeMoistureAt(x, z);

    if (this.flat) {
      // flat ocean bottom
      e += 0.225 * this.generator.noise2(0.75 * nx, 0.75 * nz);
      e += 0.2 * this.generator.noise3(1 * nx, 1 * nz);
      e += 0.075 * this.generator.ridgeNoise(1 * nx, 1 * nz);
      e += 0.00985 * this.generator.ridgeNoise(32 * nx, 32 * nz);
      e += 0.008 * this.generator.noise2(64 * nx, 64 * nz);
      e += 0.075 * this.generator.noise(4 * nx, 4 * nz);
    } else {
      // spiky ocean bottom
      e += 0.2 * this.generator.noise(1 * nx, 1 * nz);
      e += 0.0035 * this.generator.noise(8 * nx, 8 * nz);
      e += 0.015 * this.generator.noise(32 * nx, 32 * nz);
      e += 0.025 * this.generator.ridgeNoise2(8 * nx, 8 * nz);
      e += 0.25 * this.generator.noise(4 * nx, 4 * nz) * this.generator.noise3(nx, nz);

      e /= (0.25 + 0.0035 + 0.015 + 0.025 + 0.25) - this.spike;

      e **= 2.25;
    }

    return e - this.depth;
  }

  computeMoistureAt(x: number, z: number): number {
    const nx = x / (1024 * 192);
    const nz = z / (1024 * 192);

    let e = 0.2 * this.generator.noise(1 * nx, 1 * nz);
    e += 0.25 * this.generator.noise(4 * nx, 4 * nz);
    e += 0.0035 * this.generator.noise2(8 * nx, 8 * nz);
    e += 0.05 * this.generator.noise3(16 * nx, 16 * nz);

    e /= 0.2 + 0.25 + 0.0035 + 0.05;

    return e;
  }

  computeWaterMoistureAt(x: number, z: number): number {
    const nx = x / (1024 * 192);
    const nz = z / (1024 * 192);

    return Math.round(this.generator.noise2(nx, nz) * 100) / 100;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (m < 0.4) {
      return SUB_BIOMES.CORAL_REEF;
    }

    return SUB_BIOMES.OCEAN;
  }
}

export default OceanBiome;
