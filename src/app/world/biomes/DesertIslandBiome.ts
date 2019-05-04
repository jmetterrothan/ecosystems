import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';
import BiomeGenerator from '@world/BiomeGenerator';
import Boids from '@boids/Boids';
import TropicalFish from '@boids/creatures/TropicalFish';
import ClownFish from '@app/boids/creatures/ClownFish';
import BubbleEmitter from '@world/biomes/particles/BubbleEmitter';
import World from '@world/World';

import { IBiome } from '@world/models/biome.model';
import { ISpecialObjectCanPlaceIn } from '../models/objectParameters.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

import OceanSFXMp3 from '@sounds/WaterSFX.mp3';

class DesertIslandBiome extends Biome {
  private a: number;
  private b: number;
  private c: number;

  private boids: Boids[];

  private chestBottom: THREE.Object3D;
  private chestTop: THREE.Object3D;
  private chestOpened: boolean = false;

  private bubbleEmitter: BubbleEmitter;

  constructor(terrain: Terrain) {
    super('DESERT_ISLAND', terrain);

    this.boids = [];
    this.bubbleEmitter = new BubbleEmitter();

    this.a = MathUtils.randomFloat(0.02, 0.06); // best around 0.04, size of the island
    this.b = MathUtils.randomFloat(2.75, 3.25); // best around 3, makes multiple hills even when low
    this.c = MathUtils.randomFloat(1.25, 1.75); // best around 1.5 makes it round

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.desert_island_visited);
    this.sound = OceanSFXMp3;
  }

  init() {
    if (World.POPULATE) {
      this.initSpecialObject();
      this.initFishBoids();
      this.bubbleEmitter.init(this.terrain.getScene(), this.generator);
    }
  }

  private initSpecialObject() {
    const rotation = new THREE.Vector3(0, MathUtils.randomFloat(0, Math.PI * 2), 0);

    const centerX = Terrain.SIZE_X / 2;
    const centerZ = Terrain.SIZE_Z / 2;

    const sizeX = 8192;
    const sizeZ = 8192;

    this.chestBottom = this.terrain.placeSpecialObject({
      rotation,
      stackReference: 'chest_part2',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.BOTH
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);

    this.chestTop = this.terrain.placeSpecialObject({
      rotation,
      position: this.chestBottom.position.clone(),
      stackReference: 'chest_part1',
      float: false,
      underwater: ISpecialObjectCanPlaceIn.BOTH
    }, centerX - sizeX / 2, centerZ - sizeZ / 2, sizeX, sizeZ);
  }

  initFishBoids() {
    // boids
    const size = 42500;
    const max = 4;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 60, MathUtils.rng);
    const points = pds.fill();

    let it = 0;
    points.forEach((point: number[]) => {
      if (it >= max) { return; }

      const n = MathUtils.randomInt(2, 6);
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

      const fishClass = MathUtils.rng() >= 0.5 ? TropicalFish : ClownFish;
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
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.chestBottom, this.chestTop], true);

    if (intersections.length && !this.chestOpened) {
      new TWEEN.Tween(this.chestTop.rotation)
        .to({ y: this.chestTop.rotation.y + Math.PI / 10, }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
      new TWEEN.Tween(this.chestTop.position)
        .to({ x: this.chestTop.position.x + 800, z: this.chestTop.position.z + 800 }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

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

    let e = (0.50 * this.generator.noise(1 * nx, 1 * nz)
      + 1.00 * this.generator.noise(2 * nx, 2 * nz)
      + 0.13 * this.generator.noise2(8 * nx, 8 * nz)
      + 0.06 * this.generator.noise3(16 * nx, 16 * nz)
      + 0.035 * this.generator.noise2(128 * nx, 128 * nz)
      + 0.025 * this.generator.noise(512 * nx, 512 * nz));

    e /= (0.05 + 1 + 0.13 + 0.06 + 0.035 + 0.025);

    e -= 0.65;

    if (e < 0) {
      e **= 2;
    }

    const d = BiomeGenerator.getEuclideanDistance(nx, nz);
    return BiomeGenerator.islandAddMethod(this.a, this.b, this.c, d, e);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.115) {
      return SUB_BIOMES.TROPICAL_OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.145) {
      return SUB_BIOMES.TROPICAL_FOREST;
    }

    return SUB_BIOMES.TROPICAL_BEACH;
  }
}

export default DesertIslandBiome;
