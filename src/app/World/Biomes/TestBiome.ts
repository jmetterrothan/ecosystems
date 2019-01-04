import Biome from '@world/Biome';
import BiomeGenerator from '@world/BiomeGenerator';

import { IBiome } from '@shared/models/biome.model';
import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';

class TestBiome extends Biome {
  constructor(generator: BiomeGenerator) {
    super('TEST', generator);

    this.water = false;
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    return 0.0;
  }

  getParametersAt(e: number, m: number): IBiome {
    return SUB_BIOMES.TEST;
  }
}

export default TestBiome;
