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
  static readonly MOISTURE_OCTAVES: number[] = [0.01, 0.75, 0.50, 0.33, 2.00];
  static readonly MOISTURE_OCTAVES_SUM: number = BiomeGenerator.MOISTURE_OCTAVES.reduce((a, b) => a + b, 0);

  static readonly TERRAIN_OCTAVES: number[] = [1.0, 0.35, 0.25, 0.125];
  static readonly TERRAIN_OCTAVES_SUM: number = BiomeGenerator.TERRAIN_OCTAVES.reduce((a, b) => a + b, 0);

  protected curvePow: number = MathUtils.randomInt(4, 9);

  protected simplexTerrain: simplexNoise;
  protected simplexMoisture: simplexNoise;

  constructor() {
    this.simplexTerrain = new simplexNoise(MathUtils.rng);
    this.simplexMoisture = new simplexNoise(MathUtils.rng);
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
    const y = Math.max(BiomeGenerator.getHeightAtElevation(e), Chunk.SEA_LEVEL);
    const biome = this.getBiome(e, m);

    let temp = 0;
    const rand = MathUtils.rng(); // random float bewteen 0 - 1 included (sum of weights must be = 1)

    for (let i = 0, n = biome.organisms.length; i < n; i++) {
      temp += biome.organisms[i].weight;

      if (rand <= temp) {
        const organism = biome.organisms[i];

        // test for scarcity and ground elevation criteria
        if (
          (organism.scarcity === 0 || MathUtils.rng() >= organism.scarcity) &&
          (organism.e === null || (e >= (<ILowHigh>organism.e).low && e <= (<ILowHigh>organism.e).high)) &&
          (organism.m === null || (m >= (<ILowHigh>organism.m).low && m <= (<ILowHigh>organism.m).high))
        ) {
          return (<IPick>{
            x,
            y,
            z,
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
    if (e < 0.0024) { return BIOMES.OCEAN; }
    if (e < 0.032) {
      if (e > 0.004 && m > 0.5) {
        return BIOMES.SWAMP;
      }
      return BIOMES.BEACH;
    }

    // level 1
    if (e < 0.065) {
      if (m > 0.66) { return BIOMES.RAINFOREST; }
      if (m > 0.33) { return BIOMES.GRASSLAND; }

      return BIOMES.DESERT;
    }
    // level 2
    if (e < 0.10) {
      if (m > 0.66) { return BIOMES.RAINFOREST; }
      if (m > 0.33) { return BIOMES.TAIGA; }

      return BIOMES.DESERT;
    }

    // level 3
    if (e < 0.45) {
      if (m > 0.66) { return BIOMES.RAINFOREST; }
      if (m > 0.33) { return BIOMES.MOUNTAIN; }

      return BIOMES.DESERT;
    }

    // level 4
    if (e < 0.6) {
      if (m > 0.875) { return BIOMES.SNOW; }
      if (m > 0.33) { return BIOMES.TUNDRA; }
      return BIOMES.MOUNTAIN;
    }

    return BIOMES.SNOW;
  }

  /**
   * Retrieve the biome at the given coordinates
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {IBiome}
   */
  getBiomeAt(x: number, z: number): IBiome {
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
    const nx = x / (Chunk.WIDTH * 48);
    const nz = z / (Chunk.DEPTH * 48);

    let e = 0;

    let freq = 1;
    for (let i = 0; i < BiomeGenerator.TERRAIN_OCTAVES.length; i++)  {
      e += BiomeGenerator.TERRAIN_OCTAVES[i] * this.elevationNoise(freq * nx, freq * nz);
      freq *= 2;
    }

    e /= BiomeGenerator.TERRAIN_OCTAVES_SUM;
    e **= this.curvePow;

    return Math.round(e * 100) / 100;
  }

  /**
   * Compute moisture
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} moisture value
   */
  computeMoisture(x: number, z: number): number {
    const nx = x / (Chunk.WIDTH * 720);
    const nz = z / (Chunk.DEPTH * 720);

    let m = 0;

    let freq = 1;
    for (let i = 0; i < BiomeGenerator.MOISTURE_OCTAVES.length; i++)  {
      m += BiomeGenerator.MOISTURE_OCTAVES[i] * this.moisturenNoise(freq * nx, freq * nz);
      freq *= 2;
    }

    m /= BiomeGenerator.MOISTURE_OCTAVES_SUM;

    return m;
  }

  // make the range of the simplex noise [-1, 1] => [0, 1]
  private elevationNoise(nx: number, nz: number): number {
    return MathUtils.mapInterval(this.simplexTerrain.noise2D(nx, nz), -1, 1, 0, 1);
  }

  private moisturenNoise(nx: number, nz: number): number {
    return MathUtils.mapInterval(this.simplexMoisture.noise2D(nx, nz), -1, 1, 0, 1);
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
