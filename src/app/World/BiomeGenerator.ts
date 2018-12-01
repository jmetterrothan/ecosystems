import simplexNoise from 'simplex-noise';

import { BIOMES } from '@shared/constants/biome.constants';

import { IColor } from '@shared/models/color.model';
import { IBiome } from '@shared/models/biome';
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
  static readonly MOISTURE_OCTAVES: number[] = [0.59, 0.21, 0.32, 0.13];
  static readonly MOISTURE_OCTAVES_SUM: number = BiomeGenerator.MOISTURE_OCTAVES.reduce((a, b) => a + b, 0);

  static readonly TERRAIN_OCTAVES: number[] = [0.95, 0.35, 0.25, 0.125, 0.0625, 0.0005];
  static readonly TERRAIN_OCTAVES_SUM: number = BiomeGenerator.TERRAIN_OCTAVES.reduce((a, b) => a + b, 0);

  protected simplexTerrain: simplexNoise;
  protected simplexMoisture: simplexNoise;

  constructor() {
    this.simplexTerrain = new simplexNoise(Utils.rng);
    this.simplexMoisture = new simplexNoise(Utils.rng);

    // auto load biomes models
    for (const b in BIOMES) {
      for (const o in BIOMES[b].organisms) {
        const name = BIOMES[b].organisms[o].name;

        BIOMES[b].organisms[o].object = World.LOADED_MODELS.get(name);
      }
    }
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
    if (e < 0.0026) { return BIOMES.OCEAN; }
    if (e < 0.0175) { return BIOMES.BEACH; }

    // level 1
    if (e < 0.05) {
      if (m > 0.65) { return BIOMES.RAINFOREST; }
      if (m > 0.24) { return BIOMES.GRASSLAND; }

      return BIOMES.DESERT;
    }
    // level 2
    if (e < 0.10) {
      if (m > 0.80) { return BIOMES.RAINFOREST; }
      if (m > 0.38) { return BIOMES.FOREST; }
      if (m > 0.24) { return BIOMES.GRASSLAND; }

      return BIOMES.DESERT;
    }

    // level 3
    if (e < 0.25) {
      if (m > 0.5) { return BIOMES.MOUNTAIN; }
      if (m > 0.24) { return BIOMES.TAIGA; }
      return BIOMES.DESERT;
    }

    // level 4
    if (e < 0.4) {
      if (m > 0.65) { return BIOMES.SNOW; }
      if (m > 0.35) { return BIOMES.TUNDRA; }
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
