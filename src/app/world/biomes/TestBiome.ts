import Biome from '@world/Biome';
import Terrain from '@world/Terrain';

import { IBiome } from '@world/models/biome.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';

import ForestSFXMp3 from '@sounds/ForestSFX.mp3';

class TestBiome extends Biome {
  constructor(terrain: Terrain) {
    super('TEST', terrain);

    this.water = false;
    this.sound = ForestSFXMp3;
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
