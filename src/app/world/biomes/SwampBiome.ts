import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import Boids from '@boids/Boids';
import Butterfly from '@boids/creatures/Butterfly';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@world/models/biome.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';

import SwampSFXMp3 from '@sounds/SwampSFX.mp3';

class SwampBiome extends Biome {
  private boids: Boids[];
  private flat: boolean;

  constructor(terrain: Terrain) {
    super('SWAMPS', terrain);

    this.boids = [];
    this.flat = MathUtils.rng() >= 0.5;

    this.waterDistortion = true;
    this.waterDistortionFreq = 1.25;
    this.waterDistortionAmp = 512.0;

    this.progressionSvc.increment(PROGRESSION_BIOME_STORAGE_KEYS.swamp_visited);
    this.sound = SwampSFXMp3;
  }

  init() {
    const size = 100000;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 30, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const px = size / 2 + point.shift();
      const pz = size / 2 + point.shift();

      const ySize = MathUtils.randomFloat(Chunk.HEIGHT / 6, Chunk.HEIGHT / 4);
      const py = Math.max(Chunk.SEA_LEVEL + ySize / 2, this.generator.computeHeightAt(px, pz) + ySize / 3);

      // butterflies
      const boids: Boids = new Boids(this.terrain.getScene(), new THREE.Vector3(size, ySize, size), new THREE.Vector3(px, py, pz));
      for (let i = 0, n = MathUtils.randomInt(2, 5); i < n; i++) {
        boids.addCreature(new Butterfly());
      }

      this.boids.push(boids);
    });
  }

  update(delta: number) {
    this.boids.forEach(boids => boids.update(this.generator, delta));
  }

  handleClick(raycaster: THREE.Raycaster) { }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (1024 * 128);
    const nz = (z - Terrain.SIZE_Z / 2) / (1024 * 128);

    const m = this.computeMoistureAt(x, z);

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
