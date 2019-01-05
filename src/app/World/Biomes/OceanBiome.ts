import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import { IPick } from '@shared/models/pick.model';

class OceanBiome extends Biome {
  private spike: number;
  private depth: number;

  private boids: Boids;
  private boids2: Boids;

  constructor(generator: BiomeGenerator) {
    super('OCEAN', generator);

    this.spike = MathUtils.randomFloat(0.025, 0.125);
    this.depth = 1.425;

    this.waterDistortion = true;
    this.waterDistortionFreq = 3.0;
    this.waterDistortionAmp = 720.0;
  }

  init(scene: THREE.Scene, terrain: Terrain) {
    const sx = 100000;
    const sy = Chunk.HEIGHT / 3;
    const sz = 100000;
    const px = MathUtils.randomFloat(sx / 2, Terrain.SIZE_X - sx / 2);
    const pz = MathUtils.randomFloat(sz / 2, Terrain.SIZE_Z - sz / 2);

    // fish
    this.boids = new Boids(
      scene,
      new THREE.Vector3(Terrain.SIZE_X - 35000, sy, Terrain.SIZE_Z - 35000),
      new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.SEA_LEVEL - sy / 2, Terrain.SIZE_Z / 2),
      'fish1',
      MathUtils.randomInt(8, 36),
      {
        speed: 100,
        neighbourRadius: 6000,
        alignmentWeighting: 0.0065,
        cohesionWeighting: 0.01,
        separationWeighting: 0.05,
        viewAngle: 4
      }
    );

    this.boids2 = new Boids(
      scene,
      new THREE.Vector3(sx, sy, sz),
      new THREE.Vector3(px, Chunk.SEA_LEVEL - sy / 2, px),
      'fish2',
      MathUtils.randomInt(1, 3),
      {
        speed: 75,
        neighbourRadius: 10000,
        alignmentWeighting: 0.0065,
        cohesionWeighting: 0.01,
        separationWeighting: 0.2,
        viewAngle: 6
      }
    );

    // chest
    let chunk: Chunk;
    let corpseItem: IPick;
    let corpseObject: THREE.Object3D;

    do {
      const x = Terrain.SIZE_X / 4 + Math.floor(Math.random() * Terrain.SIZE_X / 2);
      const z = Terrain.SIZE_Z / 4 + Math.floor(Math.random() * Terrain.SIZE_Z / 2);

      chunk = terrain.getChunkAt(x, z);

      const y = terrain.getHeightAt(x, z);

      corpseItem = {
        x, y, z,
        s: World.OBJ_INITIAL_SCALE,
        n: 'chest',
        r: MathUtils.randomFloat(0, Math.PI * 2)
      };

      corpseObject = chunk.getObject(corpseItem);

    } while (!chunk.canPlaceObject(corpseObject));

    chunk.placeObject(corpseObject, { save: true });
  }

  update(delta: number) {
    this.boids.update(this.generator, delta);
    this.boids2.update(this.generator, delta);
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

    let e = 0.2 * this.generator.noise(1 * nx, 1 * nz);
    e += 0.0035 * this.generator.noise(8 * nx, 8 * nz);
    e += 0.015 * this.generator.noise(32 * nx, 32 * nz);
    e += 0.025 * this.generator.ridgeNoise2(8 * nx, 8 * nz);
    e += 0.25 * this.generator.noise(4 * nx, 4 * nz) * this.generator.noise3(nx, nz);

    e /= (0.25 + 0.0035 + 0.015 + 0.025 + 0.25) - this.spike;

    e **= 2.25;
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

    return Math.round(e * 100) / 100;
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
