import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';
import MathUtils from '@shared/utils/Math.utils';

class OceanBiome extends Biome {
  private spike: number;
  private depth: number;

  private boids: Boids;

  constructor(generator: BiomeGenerator) {
    super('OCEAN', generator);

    this.spike = MathUtils.randomFloat(0.025, 0.125);
    this.depth = 1.425;

    this.waterDistortion = true;
    this.waterDistortionFreq = 3.0;
    this.waterDistortionAmp = 720.0;
  }

  init(scene: THREE.Scene, terrain: Terrain) {
    // fish
    this.boids = new Boids(
      scene,
      new THREE.Vector3(Terrain.SIZE_X - 35000, 27500, Terrain.SIZE_Z - 35000),
      new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.SEA_LEVEL - 32500, Terrain.SIZE_Z / 2)
    );
    this.boids.generate();

    // chest
    const x = Terrain.SIZE_X / 4 + Math.floor(Math.random() * Terrain.SIZE_X / 2);
    const z = Terrain.SIZE_Z / 4 + Math.floor(Math.random() * Terrain.SIZE_Z / 2);
    const y = terrain.getHeightAt(x, z);
    const chunk = terrain.getChunkAt(x, z);
    const r = MathUtils.randomFloat(0, Math.PI * 2);
    const params = { x, y, z, r, s: World.OBJ_INITIAL_SCALE, n: 'chest' };

    const obj = chunk.getObject(params);
    chunk.placeObject(obj);
  }

  update(delta: number) {
    this.boids.update(delta);
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

  getParametersAt(e: number, m: number): IBiome {
    if (m < 0.3) {
      return SUB_BIOMES.CORAL_REEF;
    }

    return SUB_BIOMES.OCEAN;
  }
}

export default OceanBiome;
