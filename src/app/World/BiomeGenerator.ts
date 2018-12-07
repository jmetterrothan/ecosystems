import * as THREE from 'three';
import simplexNoise from 'simplex-noise';

import World from './World';
import Chunk from './Chunk';
import MathUtils from '@utils/Math.utils';

import { IBiome } from '@shared/models/biome.model';
import { WATER_CONSTANTS } from '@shared/constants/water.constants';
import { BIOMES } from '@shared/constants/biome.constants';
import { ILowHigh } from '@shared/models/biomeWeightedObject.model';
import { IPick } from '@shared/models/pick.model';

/**
 * Biome composition :
 * - name
 * - color gradient
 * - simplex noise generator
 * - noise parameters
 */
class BiomeGenerator {
  private simplex: simplexNoise;

  constructor() {
    this.simplex = new simplexNoise();
  }

  /**
   * Tries to position an object at the given coordinates
   * @param {number} x
   * @param {number} z
   * @return {IPick|null}
   */
  pick(x: number, z: number): IPick | null {
    const e = this.computeElevation(x, z);
    const m = this.computeMoisture(x, z);
    const y = BiomeGenerator.getHeightAtElevation(e);
    const biome = this.getBiome(e, m);

    let temp = 0;
    const rand = MathUtils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    for (let i = 0, n = biome.organisms.length; i < n; i++) {
      temp += biome.organisms[i].weight;

      if (rand <= temp) {
        const organism = biome.organisms[i];
        const ty = organism.float ? Math.max(y, Chunk.SEA_LEVEL) : y;

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

  getWaterColor(m: number): THREE.Color {
    if (m > 0.55) {
      return WATER_CONSTANTS.WATER_COLOR_B;
    }
    if (m > 0.45) {
      return WATER_CONSTANTS.WATER_COLOR_TR;
    }

    return WATER_CONSTANTS.WATER_COLOR_A;
  }

  /**
   * Return the biom corresponding to the given elevation and moisture
   * @param {number} e elevation value
   * @param {number} m moisture value
   * @return {IBiome} Biome informations
   */
  getBiome(e: number, m: number): IBiome {
    const seaLevel = Chunk.SEA_LEVEL / Chunk.HEIGHT;
    if (e < seaLevel) {
      return BIOMES.OCEAN;
    }

    return BIOMES.BEACH;
  }

  /**
   * Retrieve the biome at the given coordinates
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {IBiome}
   */
  getBiomeAt(x: number, z: number): IBiome {
    return this.getBiome(this.computeElevation(x, z), this.computeMoisture(x, z));
  }

  /**
   * Compute elevation
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} elevation value
   */
  computeElevation(x: number, z: number): number {
    const nx = x / 100000;
    const nz = z / 100000;
    return 0.02 * (this.simplex.noise3D(64 * nx, 1, 64 * nz) + 1) / 2;
  }

  /**
   * Compute moisture
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} moisture value
   */
  computeMoisture(x: number, z: number): number {
    return 0.5;
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
    return y / Chunk.HEIGHT;
  }

  /**
   * Returns the world coordinate at the given elevation
   * @param {number} e elevation
   * @return {number}
   */
  static getHeightAtElevation(e: number) {
    return e * Chunk.HEIGHT;
  }

  /**
   * Returns the world coordinate at the given elevation
   * @param {number} e elevation
   * @return {number}
   */
  static getHeightAtElevationWithWater(e: number) {
    return Math.max(this.getHeightAtElevation(e), Chunk.SEA_LEVEL);
  }
}

export default BiomeGenerator;
