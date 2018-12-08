import * as THREE from 'three';
import simplexNoise from 'simplex-noise';

import World from './World';
import Chunk from './Chunk';
import MathUtils from '@utils/Math.utils';
import CommonUtils from '@shared/utils/Common.utils';

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
  private static WATER_COLORS = new Map<number, THREE.Color>();

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

        let ty = y;

        if (organism.float) {
          // sample 4 points and take the highest one to prevent (as much as possible) clipping into the water
          const p1 = this.getWaterHeight(x - 350, z);
          const p2 = this.getWaterHeight(x + 350, z);
          const p3 = this.getWaterHeight(x, z + 350);
          const p4 = this.getWaterHeight(x, z + 350);

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

  getWaterColor(m: number): THREE.Color {
    const value = Math.round(m * 100);
    if (!BiomeGenerator.WATER_COLORS.has(value)) {
      BiomeGenerator.WATER_COLORS.set(value, new THREE.Color(CommonUtils.lerpColor(WATER_CONSTANTS.WATER_COLOR_A.getHexString(), WATER_CONSTANTS.WATER_COLOR_B.getHexString(), value / 100)));
    }
    return BiomeGenerator.WATER_COLORS.get(value);
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
    const nx = x / (Chunk.WIDTH * 128);
    const nz = z / (Chunk.DEPTH * 128);
    return 0.075 * this.noise(nx * 8, nz * 8) + 0.03 * this.noise(nx * 128, nz * 128) + 0.0025 * this.noise(nx * 256, nz * 256);
  }

  /**
   * Compute moisture
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} moisture value
   */
  computeMoisture(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 64);
    const nz = z / (Chunk.DEPTH * 64);
    return this.noise(nx, nz);
  }

  getWaterHeight(x, z) {
    const nx = x / (Chunk.WIDTH * 0.5);
    const nz = z / (Chunk.DEPTH * 0.5);
    return Chunk.SEA_LEVEL + this.noise(nx, nz) * 400;
  }

  noise(x: number, z: number) {
    return (this.simplex.noise2D(x, z) + 1) / 2;
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
