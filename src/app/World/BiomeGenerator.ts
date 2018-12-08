import * as THREE from 'three';
import simplexNoise from 'simplex-noise';

import World from './World';
import Chunk from './Chunk';
import MathUtils from '@utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { ILowHigh } from '@shared/models/biomeWeightedObject.model';
import { IPick } from '@shared/models/pick.model';
import Biome, { RainForestBiome } from './Biome';

class BiomeGenerator {
  private simplex: simplexNoise;
  private biome: Biome;

  constructor() {
    this.simplex = new simplexNoise();
    this.biome = new RainForestBiome(this);
  }

  /**
   * Tries to position an object at the given coordinates
   * @param {number} x
   * @param {number} z
   * @return {IPick|null}
   */
  pick(x: number, z: number): IPick | null {
    const e = this.computeElevationAt(x, z);
    const m = this.computeMoistureAt(x, z);
    const y = e * Chunk.HEIGHT;
    if (e < 0 && e > 1) return;

    const biome = this.biome.getParametersAt(e, m);

    let temp = 0;
    const rand = MathUtils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    for (let i = 0, n = biome.organisms.length; i < n; i++) {
      temp += biome.organisms[i].weight;

      if (rand <= temp) {
        const organism = biome.organisms[i];

        let ty = y;

        if (organism.float) {
          // sample 4 points and take the highest one to prevent (as much as possible) clipping into the water
          const p1 = this.computeWaterHeightAt(x - 350, z);
          const p2 = this.computeWaterHeightAt(x + 350, z);
          const p3 = this.computeWaterHeightAt(x, z + 350);
          const p4 = this.computeWaterHeightAt(x, z + 350);

          const p = Math.max(p1, p2, p3, p4);
          ty = Math.max(y, p);
        }

        // test for scarcity and ground elevation criteria
        if (
          (organism.scarcity === 0 || MathUtils.rng() >= organism.scarcity) &&
          (organism.e === null || (e >= (<ILowHigh>organism.e).low && e <= (<ILowHigh>organism.e).high)) &&
          (organism.m === null || (m >= (<ILowHigh>organism.m).low && m <= (<ILowHigh>organism.m).high))
        ) {
          return (<IPick>{
            x,
            z,
            y: ty,
            n: organism.name,
            r: MathUtils.randomFloat(0, Math.PI * 2),
            s: MathUtils.randomFloat(organism.scale.min, organism.scale.max) * World.OBJ_INITIAL_SCALE
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
  getBiome(e: number, m: number): IBiome {
    return this.biome.getParametersAt(e, m);
  }

  /**
   * Compute elevation (0 - 1)
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevationAt(x: number, z: number): number {
    return this.biome.computeElevationAt(x, z);
  }

  /**
   * Returns the world y position at the given coordinates
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number}
   */
  computeHeightAt(x: number, z: number) {
    return this.biome.computeElevationAt(x, z) * Chunk.HEIGHT;
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
    const nx = x / (Chunk.WIDTH * 0.5);
    const nz = z / (Chunk.DEPTH * 0.5);
    return Chunk.SEA_LEVEL + this.noise(nx, nz) * 400;
  }

  /**
   * Retrieve water color from current biome
   * @param {number} m moisture value
   * @return {THREE.Color}
   */
  getWaterColor(m: number): THREE.Color {
    return this.biome.getWaterColor(m);
  }

  noise(x: number, z: number) {
    return (this.simplex.noise2D(x, z) + 1) / 2;
  }

  ridgeNoise(x: number, z: number) {
    return 2 * (0.5 - Math.abs(0.5 - this.noise(x, z)));
  }

  static islandAddMethod(a, b, c, d, e) {
    return e + a - b * Math.pow(d, c);
  }

  static islandMultiplyMethod(a, b, c, d, e) {
    return (e + a) * (1 - b * Math.pow(d, c));
  }

  static getEuclideanDistance(x, z) {
    return 2 * Math.sqrt(x * x + z * z);
  }

  static getManhattanDistance(x, z) {
    return Math.max(Math.abs(x), Math.abs(z));
  }
}

export default BiomeGenerator;
