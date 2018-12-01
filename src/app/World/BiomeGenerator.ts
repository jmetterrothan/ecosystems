import simplexNoise from 'simplex-noise';

import { IColor } from '@shared/models/color.model';
import { IBiome } from '@shared/models/biome';
import { IBiomeWeightedObject } from '@shared/models/biomeWeightedObject';

import World from './World';
import Chunk from './Chunk';
import Utils from '@shared/Utils';

let BIOME_DESERT: IBiome = null;
let BIOME_FOREST: IBiome = null;
let BIOME_GRASSLAND: IBiome = null;

const BIOME_TUNDRA: IBiome = {
  color: new THREE.Color(0xB4C1A9),
  organisms: []
};
const BIOME_TAIGA: IBiome = {
  color: new THREE.Color(0xb4c09c),
  organisms: []
};
const BIOME_MOUNTAIN: IBiome = {
  color: new THREE.Color(0x9C9B7A),
  organisms: []
};
const BIOME_RAINFOREST: IBiome = {
  color: new THREE.Color(0x3ead52),
  organisms: []
};
const BIOME_BEACH: IBiome = {
  color: new THREE.Color(0xf0e68c),
  organisms: []
};
const BIOME_OCEAN: IBiome = {
  color: new THREE.Color(0xedc375),
  organisms: []
};
const BIOME_SNOW: IBiome = {
  color: new THREE.Color(0xfffffff),
  organisms: []
};
const BIOME_TEST: IBiome = {
  color: new THREE.Color('purple'),
  organisms: []
};

/**
 * Biome composition :
 * - name
 * - color gradient
 * - simplex noise generator
 * - noise parameters
 */

class BiomeGenerator {
  static readonly MOISTURE_OCTAVES: number[] = [0.59, 0.21, 0.32, 0.13];
  static readonly MOISTURE_OCTAVES_SUM: number = BiomeGenerator.MOISTURE_OCTAVES.reduce((a, b) => a + b, 0);

  static readonly TERRAIN_OCTAVES: number[] = [0.95, 0.35, 0.25, 0.125, 0.0625, 0.0005];
  static readonly TERRAIN_OCTAVES_SUM: number = BiomeGenerator.TERRAIN_OCTAVES.reduce((a, b) => a + b, 0);

  protected simplexTerrain: simplexNoise;
  protected simplexMoisture: simplexNoise;

  constructor() {
    this.simplexTerrain = new simplexNoise(Utils.rng);
    this.simplexMoisture = new simplexNoise(Utils.rng);

    BIOME_FOREST = {
      color: new THREE.Color(0x5da736),
      organisms: [
        {
          weight: 0.9,
          name: 'spruce',
          scarcity: 0.5,
          scale: { min: 0.75, max: 1.25 },
          object: World.LOADED_MODELS.get('spruce'),
        },
        {
          weight: 0.05,
          name: 'red_mushroom',
          scarcity: 0.975,
          scale: { min: 0.75, max: 1.25 },
          object: World.LOADED_MODELS.get('red_mushroom'),
        },
        {
          weight: 0.05,
          name: 'brown_mushroom',
          scarcity: 0.995,
          scale: { min: 0.75, max: 1.25 },
          object: World.LOADED_MODELS.get('brown_mushroom'),
        }
      ]
    };

    BIOME_GRASSLAND = {
      color: new THREE.Color(0x93c54b),
      organisms: [
        {
          weight: 1.0,
          name: 'spruce',
          scarcity: 0.995,
          scale: { min: 0.75, max: 1.25 },
          object: World.LOADED_MODELS.get('spruce'),
        }
      ]
    };

    BIOME_DESERT = {
      color: new THREE.Color(0xf0e68c),
      organisms: [
        {
          weight: 0.3,
          name: 'cactus1',
          scarcity: 0.985,
          scale: { min: 1, max: 2.5 },
          object: World.LOADED_MODELS.get('cactus1'),
        },
        {
          weight: 0.2,
          name: 'cactus2',
          scarcity: 0.985,
          scale: { min: 1, max: 2.5 },
          object: World.LOADED_MODELS.get('cactus2'),
        },
        {
          weight: 0.3,
          name: 'cactus3',
          scarcity: 0.985,
          scale: { min: 1, max: 2.5 },
          object: World.LOADED_MODELS.get('cactus3'),
        },
        {
          weight: 0.2,
          name: 'cactus4',
          scarcity: 0.995,
          scale: { min: 0.75, max: 1.2 },
          object: World.LOADED_MODELS.get('cactus4'),
        }
      ]
    };
  }

  /**
   * Tries to position an object at the given coordinates
   * @param {number} x
   * @param {number} z
   * @return {THREE.Object3D|null}
   */
  pick(x: number, z: number): THREE.Object3D | null {
    const e = this.computeElevation(x, z);
    const m = this.computeMoisture(x, z);
    const y = BiomeGenerator.getHeightAtElevation(e);
    const biome = this.getBiome(e, m);

    let temp = 0;
    const rand = Utils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    for (let i = 0, n = biome.organisms.length; i < n; i++) {
      temp += biome.organisms[i].weight;

      if (rand <= temp) {
        const organism = biome.organisms[i];

        // test for scarcity and ground elevation criteria
        if ((organism.scarcity === 0 || Utils.rng() >= organism.scarcity)) {
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

  /**
   * Return the biom corresponding to the given elevation and moisture
   * @param {number} e elevation value
   * @param {number} m moisture value
   * @return {IBiome} Biome informations
   */
  getBiome(e: number, m: number): IBiome {
    if (e < 0.0026) { return BIOME_OCEAN; }
    if (e < 0.0175) { return BIOME_BEACH; }

    // level 1
    if (e < 0.05) {
      if (m > 0.65) { return BIOME_RAINFOREST; }
      if (m > 0.24) { return BIOME_GRASSLAND; }

      return BIOME_DESERT;
    }
    // level 2
    if (e < 0.10) {
      if (m > 0.80) { return BIOME_RAINFOREST; }
      if (m > 0.38) { return BIOME_FOREST; }
      if (m > 0.24) { return BIOME_GRASSLAND; }

      return BIOME_DESERT;
    }

    // level 3
    if (e < 0.25) {
      if (m > 0.5) { return BIOME_MOUNTAIN; }
      if (m > 0.24) { return BIOME_TAIGA; }
      return BIOME_DESERT;
    }

    // level 4
    if (e < 0.4) {
      if (m > 0.65) { return BIOME_SNOW; }
      if (m > 0.35) { return BIOME_TUNDRA; }
      return BIOME_MOUNTAIN;
    }

    return BIOME_SNOW;
  }

  /**
   * Retrieve the biome at the given coordinates
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {IBiome}
   */
  getBiomeAt(x: number, z:  number): IBiome {
    return this.getBiome(
      this.computeElevation(x, z),
      this.computeMoisture(x, z)
    );
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevation(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 48) - 0.5;
    const nz = z / (Chunk.DEPTH * 48) - 0.5;

    let e = 0;

    e += BiomeGenerator.TERRAIN_OCTAVES[0] * this.elevationNoise(nx, nz);
    e += BiomeGenerator.TERRAIN_OCTAVES[1] * this.elevationNoise(2 * nx, 2 * nz);
    e += BiomeGenerator.TERRAIN_OCTAVES[2] * this.elevationNoise(4 * nx, 4 * nz);
    e += BiomeGenerator.TERRAIN_OCTAVES[3] * this.elevationNoise(8 * nx, 8 * nz);
    e += BiomeGenerator.TERRAIN_OCTAVES[4] * this.elevationNoise(16 * nx, 16 * nz);
    e += BiomeGenerator.TERRAIN_OCTAVES[5] * this.elevationNoise(32 * nx, 32 * nz);

    e /= BiomeGenerator.TERRAIN_OCTAVES_SUM;
    e **= 5;

    return Math.round(e * 180) / 180;
  }

  /**
   * Compute moisture
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} moisture value
   */
  computeMoisture(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 80) - 0.5;
    const nz = z / (Chunk.DEPTH * 80) - 0.5;

    let m = 0;

    m += BiomeGenerator.MOISTURE_OCTAVES[0] * this.moisturenNoise(nx, nz);
    m += BiomeGenerator.MOISTURE_OCTAVES[1] * this.moisturenNoise(nx * 2, nz * 2);
    m += BiomeGenerator.MOISTURE_OCTAVES[2] * this.moisturenNoise(nx * 4, nz * 4);
    m += BiomeGenerator.MOISTURE_OCTAVES[3] * this.moisturenNoise(nx * 8, nz * 8);

    m /= BiomeGenerator.MOISTURE_OCTAVES_SUM;

    return Math.round(m * 180) / 180;
  }

  // make the range of the simplex noise [-1, 1] => [0, 1]
  private elevationNoise(nx: number, nz: number): number {
    return Utils.mapInterval(this.simplexTerrain.noise2D(nx, nz), -1, 1, 0, 1);
  }

  private moisturenNoise(nx: number, nz: number): number {
    return Utils.mapInterval(this.simplexMoisture.noise2D(nx, nz), -1, 1, 0, 1);
  }

  /**
   * Returns the world y position at the given coordinates
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  computeHeight(x: number, z: number) {
    return BiomeGenerator.getHeightAtElevation(this.computeElevation(x, z));
  }

  /**
   * Returns the elevation at the given y world coordinate
   * @param {number} y coord component
   * @return {number}
   */
  static getElevationFromHeight(y: number) {
    return y / ((Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT) + Chunk.MIN_CHUNK_HEIGHT);
  }

  /**
   * Returns the world coordinate at the given elevation
   * @param {number} e elevation
   * @return {number}
   */
  static getHeightAtElevation(e: number) {
    return e * ((Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT) + Chunk.MIN_CHUNK_HEIGHT);
  }
}

export default BiomeGenerator;
