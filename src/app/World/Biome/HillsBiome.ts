import * as THREE from 'three';

import Biome from './Biome';
import Chunk from '../Chunk';

class HillsBiome extends Biome {
  constructor() {
    super('hills', [
      {
        weight: 0,
        scarcity: 0,
        name: 'spruce',
        low: -150,
        high: 5,
        scale: { min: 0.75, max: 1.2 }
      },
      {
        weight: 0.5,
        scarcity: 0.95,
        name: 'red_mushroom',
        low: -150,
        high: 5,
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
      }, {
        stop: .06,
        color: new THREE.Color(0x62ad3e) // dark grass
      },
      {
        stop: .14,
        color: new THREE.Color(0x7c6a4a) // dark rock
      },
      {
        stop: .3,
        color: new THREE.Color(0x40424a)
      },
      {
        stop: 1.25,
        color: new THREE.Color(0xffffff) // snow cap
      }
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
    let f = 0.00365;

    for (let i = 0; i < 8; i++) {
      e += amp * this.simplex.noise3D(f * nx, 1, f * nz);
      amp /= 1.85;
      f *= 1.95;
    }

    const noise = e * ((Chunk.MAX_CHUNK_HEIGHT + Chunk.MIN_CHUNK_HEIGHT) / 2 + (Chunk.MAX_CHUNK_HEIGHT - Chunk.MAX_CHUNK_HEIGHT) / 2);

    if (noise > 10) {
      return Math.pow(noise, 1.115);
    }
    return noise / 2;
  }
}

export default HillsBiome;
