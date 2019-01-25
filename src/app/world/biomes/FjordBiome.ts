import Biome from '@world/Biome';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import MathUtils from '@shared/utils/Math.utils';

import { IBiome } from '@world/models/biome.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';

import ForestSFXMp3 from '@sounds/ForestSFX.mp3';

class FjordBiome extends Biome {
  private e: number;

  constructor(terrain: Terrain) {
    super('FJORD', terrain);

    this.waterDistortion = true;
    this.waterDistortionFreq = 2.25;
    this.waterDistortionAmp = 1024.0;

    this.e = MathUtils.randomFloat(2, 3);
    this.sound = ForestSFXMp3;
  }

  init() { }

  update(delta: number) { }

  handleClick(raycaster: THREE.Raycaster) { }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    const nx = (x - Terrain.SIZE_X / 2) / (2048 * 64);
    const nz = (z - Terrain.SIZE_Z / 2) / (2048 * 64);

    let e = 1.0 * this.generator.noise(0.85 * nx, 0.85 * nz);
    e += 0.1 * this.generator.noise2(nx * 4, nz * 4);
    e += 0.035 * this.generator.ridgeNoise(nx * 8, nz * 8);
    e += 0.01 * this.generator.noise2(nx * 16, nz * 16);
    e += 0.01 * this.generator.ridgeNoise2(nx * 32, nz * 32);
    e += 0.05 * this.generator.noise(nx * 8, nz * 8);

    e /= 0.935 + 0.1 + 0.05 + 0.01 + 0.01 + 0.05;

    return e ** this.e - 0.1;
  }

  getParametersAt(e: number, m: number): IBiome {
    if (e > Chunk.CLOUD_ELEVATION + 0.02) {
      if (m > 0.5) return SUB_BIOMES.FJORD_SNOW_CAP;
      return SUB_BIOMES.MOUNTAIN;
    }

    if (e > Chunk.SEA_ELEVATION + 0.05) {
      return SUB_BIOMES.FJORD;
    }

    if (e > Chunk.SEA_ELEVATION - 0.05) {
      return SUB_BIOMES.FJORD_BEACH;
    }

    return SUB_BIOMES.OCEAN;
  }
}

export default FjordBiome;
