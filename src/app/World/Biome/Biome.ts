import simplexNoise from 'simplex-noise';

import { IColor } from '@shared/models/color.model';
import { IBiomeWeightedObject } from '@shared/models/biomeWeightedObject';

import World from '../World';
import Chunk from '../Chunk';
import Utils from '@shared/Utils';

/**
 * Biome composition :
 * - name
 * - color gradient
 * - simplex noise generator
 * - noise parameters
 */

class Biome {
  protected simplex: simplexNoise;
  protected name: string;
  protected organisms: IBiomeWeightedObject[];
  protected colors: IColor[];

  constructor(name: string, organisms: IBiomeWeightedObject[], colors: IColor[]) {
    this.name = name;
    this.organisms = organisms.map(organism => {
      return {
        ...organism,
        object: World.LOADED_MODELS.get(organism.name)
      };
    });

    this.colors = colors;
    this.simplex = new simplexNoise(Utils.rng);
  }

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

  getColor(y: number): THREE.Color {
    // normalize height value
    const level = (y - Chunk.MIN_CHUNK_HEIGHT) / (Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT);

    for (let i = 0; i < this.colors.length; i++) {
      if (!this.colors[i + 1] || level < this.colors[i + 1].stop) {
        return this.colors[i].color;
      }
    }
  }

  sumOctaves(x: number, z: number): number {
    return 0;
  }
}

export default Biome;
