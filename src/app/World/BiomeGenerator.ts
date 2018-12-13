import * as THREE from 'three';
import simplexNoise from 'simplex-noise';

import World from '@world/World';
import Chunk from '@world/Chunk';
import MathUtils from '@utils/Math.utils';

import Biome from '@world/Biome';
import RainForestBiome from '@world/Biomes/RainForestBiome';
import HighlandBiome from '@world/Biomes/HighlandBiome';
import OceanBiome from '@world/Biomes/OceanBiome';
import MountainBiome from '@world/Biomes/MountainBiome';

import { IBiome } from '@shared/models/biome.model';
import { ILowHigh } from '@shared/models/biomeWeightedObject.model';
import { IPick } from '@shared/models/pick.model';

class BiomeGenerator {
  private simplex: simplexNoise;
  private simplex2: simplexNoise;
  private simplex3: simplexNoise;
  private biome: Biome;

  constructor() {
    this.simplex = new simplexNoise(MathUtils.rng);
    this.simplex2 = new simplexNoise(MathUtils.rng);
    this.simplex3 = new simplexNoise(MathUtils.rng);
    this.biome = new OceanBiome(this); // MathUtils.rng() > 0.5 ? new HighlandBiome(this) : new RainForestBiome(this);

    console.info(this.biome);
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

    if (e < 0 && e > 1) return;

    const biome = this.biome.getParametersAt(e, m);

    let temp = 0;
    const rand = MathUtils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    for (let i = 0, n = biome.organisms.length; i < n; i++) {
      let y = e * Chunk.HEIGHT;
      temp += biome.organisms[i].weight;

      if (rand <= temp) {
        const organism = biome.organisms[i];

        const scale = organism.scale ? MathUtils.randomFloat(organism.scale.min, organism.scale.max) : 1;

        const lowM = organism.m !== null && organism.m !== undefined ? (<ILowHigh>organism.m).low : 0;
        const highM = organism.m !== null && organism.m !== undefined ? (<ILowHigh>organism.m).high : 1;

        const lowE = organism.e !== null && organism.e !== undefined ? (<ILowHigh>organism.e).low : 0;
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

        // test for scarcity and ground elevation criteria
        if ((organism.scarcity === 0 || MathUtils.rng() >= organism.scarcity) &&
          (e >= lowE && e <= highE) &&
          (m >= lowM && m <= highM)) {
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
    const nx = x / (1024 * 16);
    const nz = z / (1024 * 16);

    let e = this.noise2(nx, nz);
    e += 0.75 * this.noise(nx * 4, nz * 4);

    return Chunk.SEA_LEVEL + e * 1000;
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

  noise2(x: number, z: number) {
    return (this.simplex2.noise2D(x, z) + 1) / 2;
  }

  noise3(x: number, z: number) {
    return (this.simplex3.noise2D(x, z) + 1) / 2;
  }

  ridgeNoise(x: number, z: number) {
    return 2 * (0.5 - Math.abs(0.5 - this.noise(x, z)));
  }

  ridgeNoise2(x: number, z: number) {
    return 2 * (0.5 - Math.abs(0.5 - this.noise2(x, z)));
  }

  static islandAddMethod(a, b, c, d, e) {
    return e + a - b * Math.pow(d, c);
  }

  static islandMultiplyMethod(a, b, c, d, e) {
    return (e + a) * (1 - b * Math.pow(d, c));
  }

  static getEuclideanDistance(x, z) {
    return Math.sqrt(x * x + z * z);
  }

  static getManhattanDistance(x, z) {
    return Math.max(Math.abs(x), Math.abs(z));
  }
}

export default BiomeGenerator;
