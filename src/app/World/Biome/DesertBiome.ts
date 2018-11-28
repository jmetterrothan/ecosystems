import * as THREE from 'three';

import Biome from './Biome';
import Chunk from '../Chunk';

class DesertBiome extends Biome {
  constructor() {
    super('desert', [
      {
        weight: 0.3,
        scarcity: 0.985,
        name: 'cactus1',
        low: -200,
        high: -75,
        scale: { min: 0.75, max: 2 }
      },
      {
        weight: 0.20,
        scarcity: 0.985,
        name: 'cactus2',
        low: -200,
        high: -75,
        scale: { min: 0.85, max: 1.75 }
      },
      {
        weight: 0.3,
        scarcity: 0.985,
        name: 'cactus3',
        low: -200,
        high: -75,
        scale: { min: 0.9, max: 3 }
      },
      {
        weight: 0.05,
        scarcity: 0.985,
        name: 'cactus4',
        low: -200,
        high: -75,
        scale: { min: 1.0, max: 1.75 }
      },
      {
        weight: 0.1,
        scarcity: 0.975,
        name: 'rock1',
        low: -100,
        high: 0,
        scale: { min: 1.0, max: 4 }
      },
      {
        weight: 0.15,
        scarcity: 0.975,
        name: 'rock1',
        low: -100,
        high: 0,
        scale: { min: 0.5, max: 1.0 }
      },
    ], [
      {
        stop: 0,
        color: new THREE.Color(0xf0e9ae) // dried up water puddle
      },
      {
        stop: 0.05,
        color: new THREE.Color(0xf0e68c) // sand
      }, {
        stop: 0.125,
        color: new THREE.Color(0xdfbb74) // red sand
      },
      {
        stop: 0.145,
        color: new THREE.Color(0xcbb067) // rock
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
    let f = 0.0025;

    for (let i = 0; i < 8; i++) {
      e += amp * this.simplex.noise3D(f * nx, 1, f * nz);
      amp /= 1.75;
      f *= 1.95;
    }

    const noise = e * ((Chunk.MAX_CHUNK_HEIGHT + Chunk.MIN_CHUNK_HEIGHT) / 2 + (Chunk.MAX_CHUNK_HEIGHT - Chunk.MAX_CHUNK_HEIGHT) / 2);

    if (noise > 5) {
      const t = 100 + noise + (noise / 50) * (1.25 + this.simplex.noise2D(nx / 100, nz / 100));

      return Math.pow(noise, 1 + (t - noise) / t);
    }
    return noise / 2.5;
  }
}

export default DesertBiome;
