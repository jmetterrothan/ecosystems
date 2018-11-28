import Biome from './Biome';
import Chunk from '../Chunk';

class FlatLandsBiome extends Biome
{
  constructor() {
    super('flatlands', [
      {
        weight: 0,
        scarcity: 0.25,
        name: 'spruce',
        low: 0,
        high: 150,
        scale: { min: 0.75, max: 1.2 }
      },
      {
        weight: 0.5,
        scarcity: 0.95,
        name: 'red_mushroom',
        low: 5,
        high: 100,
        scale: { min: 0.9, max: 1.5 }
      },
    ], [
      {
        stop: 0,
        color: new THREE.Color(0xf0e68c) // sand
      }, {
        stop: 0.125,
        color: new THREE.Color(0x93c54b) // grass
      }, {
        stop: 0.165,
        color: new THREE.Color(0x62ad3e) // grass
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
    let f = 0.01;

    for (let i = 0; i < 8; i++) {
      e += amp * this.simplex.noise3D(f * nx, 1, f * nz);
      amp /= 1.85;
      f *= 1.95;
    }

    const noise = e * 100;

    return noise;
  }
}

export default FlatLandsBiome;
