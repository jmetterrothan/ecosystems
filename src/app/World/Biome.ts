import { IColor } from '@shared/models/color.model';
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
interface BiomeWeightedObject {
  weight: number;
  name: string;
  low: number;
  high: number;
  scarcity: number;
  scale: { min: number; max: number; };
  object?: THREE.Object3D;
}

class Biome {
  static LIST = new Map<string, Biome>();

  private name: string;
  private organisms: BiomeWeightedObject[];
  private colors: IColor[];

  constructor(name: string, organisms: BiomeWeightedObject[], colors: IColor[]) {
    this.name = name;

    this.organisms = organisms.map(organism => {
      return {
        ...organism,
        object: World.LOADED_MODELS.get(organism.name)
      };
    });

    this.colors = colors;
  }

  pick(y: number): THREE.Object3D | null {
    const rand = Utils.rng();

    for (let i = 0; i < this.organisms.length; i++) {
      // retrieve an organism based on weight
      if (!this.organisms[i + 1] || rand < this.organisms[i + 1].weight) {
        const organism = this.organisms[i];
        const object = organism.object.clone();

        // test for scarcity and ground elevation criteria
        if ((organism.scarcity === 0 || Utils.rng() >= organism.scarcity) && y >= organism.low && y <= organism.high) {
          const f = Utils.randomFloat(organism.scale.min, organism.scale.max);
          const r = Utils.randomInt(0, Utils.degToRad(360));

          object.rotateY(r);
          object.scale.multiplyScalar(f);

          return object;
        }
      }
    }

    return null;
  }

  getColor(y): THREE.Color {
    // normalize height value
    const level = (y - Chunk.MIN_CHUNK_HEIGHT) / (Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT);

    for (let i = 0; i < this.colors.length; i++) {
      if (!this.colors[i + 1] || level < this.colors[i + 1].stop) {
        return this.colors[i].color;
      }
    }
  }

  static register(name: string, organisms: BiomeWeightedObject[], colors: IColor[]): Biom {
    Biome.LIST.set(name, new Biome(name, organisms, colors));
  }
}

export default Biome;
