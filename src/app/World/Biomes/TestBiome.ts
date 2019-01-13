import Biome from '@world/Biome';
import Terrain from '@world/Terrain';

import { IBiome } from '@shared/models/biome.model';

import { SUB_BIOMES } from '@shared/constants/subBiomes.constants';

class TestBiome extends Biome {
  constructor(terrain: Terrain) {
    super('TEST', terrain);

    this.water = false;
  }

  handleClick(raycaster: THREE.Raycaster) { }

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
