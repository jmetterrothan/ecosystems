import * as THREE from 'three';

import Biome from './Biome';
import Chunk from '../Chunk';

class HillsBiome extends Biome {
  constructor() {
    super('hills', [
      {
        weight: 0.8,
        scarcity: 0.45,
        name: 'spruce',
        low: -100,
        high: 1500,
        scale: { min: 0.7, max: 1.2 }
      },
      {
        weight: 0.1,
        scarcity: 0.975,
        name: 'red_mushroom',
        low: -150,
        high: 1500,
        scale: { min: 0.9, max: 1.5 }
      },
      {
        weight: 0.1,
        scarcity: 0.975,
        name: 'brown_mushroom',
        low: -150,
        high: 1500,
        scale: { min: 0.9, max: 1.5 }
      },
    ], [
      {
        stop: 0,
        color: new THREE.Color(0xfcd95f) // underwater sand
      },
      {
        stop: 0.015,
        color: new THREE.Color(0xf0e68c) // sand
      },
      {
        stop: .04,
        color: new THREE.Color(0x93c54b) // grass
      },
      {
        stop: .125,
        color: new THREE.Color(0x62ad3e) // dark rock
      },
    ]);
  }

  /**
   * Compute a point of the heightmap
   */
  sumOctaves(x: number, z: number): number {
    const nx = x / 64 - 0.5;
    const nz = z / 64 - 0.5;

    let e = 0;
    let amp = 1;
    let f = 0.005;

    for (let i = 0; i < 8; i++) {
      e += amp * this.simplex.noise3D(f * nx, 1, f * nz);
      amp /= 2;
      f *= 2.0;
    }

    const noise = e * ((Chunk.MAX_CHUNK_HEIGHT + Chunk.MIN_CHUNK_HEIGHT) / 2 + (Chunk.MAX_CHUNK_HEIGHT - Chunk.MAX_CHUNK_HEIGHT) / 2);

    if (noise > 0) {
      return noise;
    }
    return noise / 1.5;
  }
}

export default HillsBiome;
