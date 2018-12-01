import simplexNoise from 'simplex-noise';

import { IColor } from '@shared/models/color.model';
import { IBiomeWeightedObject } from '@shared/models/biomeWeightedObject';

import World from './World';
import Chunk from './Chunk';
import Utils from '@shared/Utils';

/**
 * Biome composition :
 * - name
 * - color gradient
 * - simplex noise generator
 * - noise parameters
 */

class BiomeGenerator {
  protected simplexTerrain: simplexNoise;
  protected simplexMoisture: simplexNoise;

  constructor() {
    this.simplexTerrain = new simplexNoise(Utils.rng);
    this.simplexMoisture = new simplexNoise(Utils.rng);

    this.colors = [
      {
        stop: 0,
        color: new THREE.Color(0xf0e68c) // sand
      },
      {
        stop: 0.35,
        color: new THREE.Color(0x93c54b) // grass
      },
      {
        stop: 0.75,
        color: new THREE.Color(0x62ad3e) // grass
      }
    ];

    this.organisms = [

    ];
  }

  /*
  pick(y: number): THREE.Object3D | null {
    let temp = 0;
    const rand = Utils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    for (let i = 0, n = this.organisms.length; i < n; i++) {
      temp += this.organisms[i].weight;

      if (rand <= temp) {
        const organism = this.organisms[i];

        // test for scarcity and ground elevation criteria
        if ((organism.scarcity === 0 || Utils.rng() >= organism.scarcity) && y >= organism.low && y <= organism.high) {
          const object = organism.object.clone();

          const f = Utils.randomFloat(organism.scale.min, organism.scale.max);
          const r = Utils.randomFloat(0, Utils.degToRad(360));

          object.rotateY(r);
          object.scale.multiplyScalar(f);

          return object;
        }
      }
    }

    return null;
  }
  */

  paint(e: number, m: number): THREE.Color {
    if (e >= 0.80) {
      return new THREE.Color(0xffffff);
    }

    if (e >= 0.02) {
      return new THREE.Color(0x93c54b);
    }

    if (e >= 0.5) {
      return new THREE.Color(0x62ad3e);
    }

    return new THREE.Color(0xf0e68c);
  }

  /**
   * Compute a point of the heightmap
   */
  computeElevation(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 64) - 0.5;
    const nz = z / (Chunk.DEPTH * 64) - 0.5;

    let e = 0;

    e = 1 * this.noise(nx, nz) +
        0.5 * this.noise(2 * nx, 2 * nz) +
        0.25 * this.noise(4 * nx, 4 * nz) +
        0.125 * this.noise(8 * nx, 8 * nz) +
        0.0625 * this.noise(16 * nx, 16 * nz) +
        0.03125 * this.noise(32 * nx, 32 * nz) +
        0.015625 * this.noise(64 * nx, 64 * nz) +
        0.0078125 * this.noise(128 * nx, 128 * nz);

    e /= (1 + 0.5 + 0.25 + 0.125 + 0.0625 + 0.03125);

    return Math.pow(e, 6);
  }

  computeMoisture(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 64) - 0.5;
    const nz = z / (Chunk.DEPTH * 64) - 0.5;

    let m = 0;

    m += 0.59 * this.noise(nx * 1, nz * 1);
    m += 0.21 * this.noise(nx * 2, nz * 2);
    m += 0.32 * this.noise(nx * 4, nz * 4);
    m += 0.13 * this.noise(nx * 8, nz * 8);
    m += 0.14 * this.noise(nx * 16, nz * 16);
    m += 0.24 * this.noise(nx * 32, nz * 32);

    m /= 1.63;

    return m;
  }

  private noise(nx: number, nz: number): number {
    return this.simplexTerrain.noise2D(nx, nz) / 2 + 0.5;
  }
}

export default BiomeGenerator;
