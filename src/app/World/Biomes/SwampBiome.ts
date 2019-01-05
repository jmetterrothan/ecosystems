import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';

class SwampBiome extends Biome {
  private boids: Boids[];

  constructor(generator: BiomeGenerator) {
    super('SWAMPS', generator);

    this.boids = [];

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.25;
    this.waterDistortionAmp = 512.0;
  }

  init(scene: THREE.Scene, terrain: Terrain) {
    const sx = 100000;
    const sz = 100000;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - sx, Terrain.SIZE_Z - sz], sx, sz, 30, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const px = sx / 2 + point.shift();
      const pz = sz / 2 + point.shift();

      const sy = MathUtils.randomFloat(Chunk.HEIGHT / 6, Chunk.HEIGHT / 4);

      // butterflies
      const boids = new Boids(
        scene,
        new THREE.Vector3(sx, sy, sz),
        new THREE.Vector3(px, Chunk.SEA_LEVEL + sy / 2, pz),
        'butterfly',
        MathUtils.randomInt(1, 6),
        {
          speed: 75,
          neighbourRadius: 6000,
          alignmentWeighting: 0.005,
          cohesionWeighting: 0.075,
          separationWeighting: 0.1,
          viewAngle: 12
        }
      );

      this.boids.push(boids);
    });
  }

  update(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
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

    return e - 0.25;
  }

  computeMoistureAt(x: number, z: number): number {
    const value = super.computeMoistureAt(x, z);

    // bias towards high humidity because it's a swamp
    return Math.min(value + 0.35, 1.0);
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e < Chunk.SEA_ELEVATION - 0.10 - 0.016) {
      return SUB_BIOMES.OCEAN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.1) {
      return SUB_BIOMES.GRASSLAND;
    }

    if (m > 0.5 + 0.025) {
      return SUB_BIOMES.SWAMP;
    }

    return SUB_BIOMES.BEACH;
  }
}

export default SwampBiome;
