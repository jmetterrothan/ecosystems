import SnowBiome from '@world/Biomes/SnowBiome';
import * as THREE from 'three';
import simplexNoise from 'simplex-noise';

import World from '@world/World';
import Chunk from '@world/Chunk';
import MathUtils from '@utils/Math.utils';

import Biome from '@world/Biome';

import { IBiome } from '@shared/models/biome.model';
import { ILowHigh } from '@shared/models/biomeWeightedObject.model';
import { IPick } from '@shared/models/pick.model';

import { BIOMES } from '@shared/constants/biomes.constants';
import { IPickObject } from '@shared/models/objectParameters.model';

class BiomeGenerator {
  // @ts-ignore
  public static readonly BIOME: Biome | null = SnowBiome; // lock a specific biome here, if null a biome is selected randomly

  private simplex: simplexNoise;
  private simplex2: simplexNoise;
  private simplex3: simplexNoise;
  private biome: Biome;

  constructor() {
    this.simplex = new simplexNoise(MathUtils.rng);
    this.simplex2 = new simplexNoise(MathUtils.rng);
    this.simplex3 = new simplexNoise(MathUtils.rng);

    if (BiomeGenerator.BIOME === null) {
      const biomeClass = BIOMES[MathUtils.randomInt(0, BIOMES.length - 1)];
      this.biome = new biomeClass(this);
    } else {
      // @ts-ignore
      this.biome = new BiomeGenerator.BIOME(this);
    }
  }

  /**
   * Tries to position an object at the given coordinates
   * @param {number} x
   * @param {number} z
   * @return {IPick|null}
   */
  pick(x: number, z: number, parameters: IPickObject = {}): IPick | null {
    const e = this.computeElevationAt(x, z);
    const m = this.computeMoistureAt(x, z);

    const biome = this.biome.getParametersAt(e, m);

    let temp = 0;
    const rand = MathUtils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    const organisms = (<Object>parameters).hasOwnProperty('float')
      ? biome.organisms.filter(object => object.float === parameters.float)
      : biome.organisms;

    for (let i = 0, n = organisms.length; i < n; i++) {
      let y = e * Chunk.MAX_TERRAIN_HEIGHT;
      temp += biome.organisms[i].weight;

      if (rand <= temp) {
        const organism = organisms[i];

        const scale = organism.scale ? MathUtils.randomFloat(organism.scale.min, organism.scale.max) : 1;

        const lowM = organism.m !== null && organism.m !== undefined ? (<ILowHigh>organism.m).low : 0;
        const highM = organism.m !== null && organism.m !== undefined ? (<ILowHigh>organism.m).high : 1;

        const lowE = organism.e !== null && organism.e !== undefined ? (<ILowHigh>organism.e).low : -1;
        const highE = organism.e !== null && organism.e !== undefined ? (<ILowHigh>organism.e).high : 1;

        if (organism.float === true) {
          // sample 4 points and take the highest one to prevent (as much as possible) clipping into the water
          const p1 = this.computeWaterHeightAt(x - 350, z);
          const p2 = this.computeWaterHeightAt(x + 350, z);
          const p3 = this.computeWaterHeightAt(x, z + 350);
          const p4 = this.computeWaterHeightAt(x, z + 350);

          const p = Math.max(p1, p2, p3, p4);
          y = Math.max(y, p);
        }

        const rand = MathUtils.rng();

        // test for scarcity and ground elevation criteria
        if (parameters.force || (rand >= organism.scarcity &&
          (e >= lowE && e <= highE) &&
          (m >= lowM && m <= highM))) {
          return (<IPick>{
            x,
            z,
            y,
            n: organism.name,
            r: MathUtils.randomFloat(0, Math.PI * 2),
            s: scale * World.OBJ_INITIAL_SCALE
          });
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
  getSubBiome(e: number, m: number): IBiome {
    return this.biome.getParametersAt(e, m);
  }

  /**
   * Return the current biome
   * @return {Biome} Biome
   */
  getBiome(): Biome {
    return this.biome;
  }

  /**
   * Compute elevation (0 - 1)
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    let e = this.biome.computeElevationAt(x, z);

    // clamp to a minimum elevation
    const minElevation = -(Chunk.HEIGHT / 2) / Chunk.MAX_TERRAIN_HEIGHT + 0.1;
    if (e < minElevation) { e = minElevation; }

    return e;
  }

  /**
   * Returns the world y position at the given coordinates
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  computeHeightAt(x: number, z: number) {
    return this.computeElevationAt(x, z) * Chunk.MAX_TERRAIN_HEIGHT;
  }

  /**
   * Compute moisture
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} moisture value
   */
  computeMoistureAt(x: number, z: number): number {
    return this.biome.computeMoistureAt(x, z);
  }

  /**
   * Compute water height
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} water height
   */
  computeWaterHeightAt(x, z) {
    const nx = x / (1024 * 16);
    const nz = z / (1024 * 16);

    let e = 1 * this.noise2(nx, nz);
    e += 0.75 * this.noise(nx * 8, nz * 8);

    return Chunk.SEA_LEVEL + e * 1000 - 500;
  }

  /**
   * Retrieve water color from current biome
   * @param {number} m moisture value
   * @return {THREE.Color}
   */
  getWaterColor(m: number): THREE.Color {
    return this.biome.getWaterColor(m);
  }

  /**
   * Noise
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  noise(x: number, z: number) {
    return (this.simplex.noise2D(x, z) + 1) / 2;
  }

  /**
   * Noise
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  noise2(x: number, z: number) {
    return (this.simplex2.noise2D(x, z) + 1) / 2;
  }

  /**
   * Noise
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  noise3(x: number, z: number) {
    return (this.simplex3.noise2D(x, z) + 1) / 2;
  }

  /**
   * Noise
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  ridgeNoise(x: number, z: number) {
    return 2 * (0.5 - Math.abs(0.5 - this.noise(x, z)));
  }

  /**
   * Noise
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  ridgeNoise2(x: number, z: number) {
    return 2 * (0.5 - Math.abs(0.5 - this.noise2(x, z)));
  }

  /**
   * @param {number} a
   * @param {number} b
   * @param {number} d
   * @param {number} e
   * @return {number}
   */
  static islandAddMethod(a, b, c, d, e) {
    return e + a - b * Math.pow(d, c);
  }

  /**
   * @param {number} a
   * @param {number} b
   * @param {number} d
   * @param {number} e
   * @return {number}
   */
  static islandMultiplyMethod(a, b, c, d, e) {
    return (e + a) * (1 - b * Math.pow(d, c));
  }

  /**
   * Calculate euclidean distance
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  static getEuclideanDistance(x, z) {
    return Math.sqrt(x * x + z * z);
  }

  /**
   * Calculate manhattan distance
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  static getManhattanDistance(x, z) {
    return Math.max(Math.abs(x), Math.abs(z));
  }
}

export default BiomeGenerator;
