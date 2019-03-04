import * as THREE from 'three';
import simplexNoise from 'simplex-noise';

import FjordBiome from '@world/biomes/FjordBiome';
import SnowBiome from '@world/biomes/SnowBiome';
import DesertBiome from '@world/biomes/DesertBiome';
import SwampBiome from '@world/biomes/SwampBiome';
import OceanBiome from '@world/biomes/OceanBiome';
import HighlandBiome from '@world/biomes/HighlandBiome';
import RainForestBiome from '@world/biomes/RainForestBiome';
import DesertIslandBiome from '@world/biomes/DesertIslandBiome';
import TaigaBiome from '@world/biomes/TaigaBiome';
import TestBiome from '@world/biomes/TestBiome';

import World from '@world/World';
import Chunk from '@world/Chunk';
import Biome from '@world/Biome';
import Terrain from '@world/Terrain';
import MathUtils from '@utils/Math.utils';

import { IBiome } from '@world/models/biome.model';
import { ILowHigh, IBiomeWeightedObject } from '@world/models/biomeWeightedObject.model';
import { IPick } from '@world/models/pick.model';
import { IPickObject } from '@world/models/objectParameters.model';

import { Biomes } from '@world/constants/biomes.constants';

class BiomeGenerator {
  private simplex: simplexNoise;
  private simplex2: simplexNoise;
  private simplex3: simplexNoise;
  private biome: Biome;

  constructor() {
    this.simplex = new simplexNoise(MathUtils.rng);
    this.simplex2 = new simplexNoise(MathUtils.rng);
    this.simplex3 = new simplexNoise(MathUtils.rng);
  }

  /**
   * Biome generator init
   * @param {Terrain} terrain
   */
  init(terrain: Terrain): Biome {
    switch (terrain.getWorld().getSeed().toLowerCase()) {
      case 'taiga':
      case 'taiga2':
      case 'taiga3':
      case 'taiga4':
        this.biome = new TaigaBiome(terrain);
        break;
      case 'rainforest':
      case 'rainforest2':
      case 'rainforest3':
      case 'rainforest4':
        this.biome = new RainForestBiome(terrain);
        break;
      case 'highland':
      case 'highlands':
        this.biome = new HighlandBiome(terrain);
        break;
      case 'ocean':
      case 'ocean2':
      case 'ocean3':
      case 'ocean4':
        this.biome = new OceanBiome(terrain);
        break;
      case 'swamp':
      case 'swamps':
      case 'swamps2':
      case 'swamps3':
      case 'swamps4':
        this.biome = new SwampBiome(terrain);
        break;
      case 'desert':
      case 'desert2':
      case 'desert3':
      case 'desert4':
        this.biome = new DesertBiome(terrain);
        break;
      case 'snowy_hills':
      case 'snowy hills':
      case 'snow':
      case 'snow2':
      case 'snow3':
      case 'snow4':
        this.biome = new SnowBiome(terrain);
        break;
      case 'fjord':
      case 'fjords':
      case 'fjords2':
      case 'fjords3':
        this.biome = new FjordBiome(terrain);
        break;
      case 'desert island':
      case 'desert_island':
      case 'desert_island2':
      case 'desert_island3':
        this.biome = new DesertIslandBiome(terrain);
        break;
      default:
        // weighted random pic of the biome (some biomes appear less frequently)
        let biomeClass = TestBiome;

        const sum = Biomes.reduce((acc, val) => acc + val.weight, 0);
        const rand = MathUtils.rng();

        let temp = 0;
        for (let i = 0; i < Biomes.length; i++) {
          temp += Biomes[i].weight / sum;
          if (rand <= temp) {
            biomeClass = Biomes[i].class;
            break;
          }
        }

        this.biome = new biomeClass(terrain);
        break;
    }
    return this.biome;
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

    const isOnWater = (<IPickObject>parameters).hasOwnProperty('isOnWater') && parameters.isOnWater;
    const organisms = biome.organisms.filter(object => isOnWater === object.float);

    // use sum of selected organisms weights to calculate a random value
    const sumOfWeights = organisms.reduce((acc, item: IBiomeWeightedObject) => acc + item.weight, 0);
    // random float bewteen 0 - 1 included (sum of weights must be = 1)
    const rand = MathUtils.randomFloat(0, sumOfWeights);

    let temp = 0;

    for (let i = 0, n = organisms.length; i < n; i++) {
      temp += organisms[i].weight;

      if (rand <= temp) {
        const organism = organisms[i];

        if (organism.float && !this.biome.hasWater()) { return null; } // prevent placing objects on water if it's disabled

        // test for scarcity and ground elevation criteria
        if (this.checkCanPick(organism, e, m, parameters.force)) {
          let y = e * Chunk.MAX_TERRAIN_HEIGHT;

          // get a random variant name
          const scale = (organism.scale ? MathUtils.randomFloat(organism.scale.min, organism.scale.max) : 1) * World.OBJ_INITIAL_SCALE;

          // if the object floats on water
          if (organism.float === true) {
            // sample 4 points and take the highest one to prevent (as much as possible) clipping into the water
            const p1 = this.computeWaterHeightAt(x - 1024, z);
            const p2 = this.computeWaterHeightAt(x + 1024, z);
            const p3 = this.computeWaterHeightAt(x, z + 1024);
            const p4 = this.computeWaterHeightAt(x, z + 1024);

            const p = Math.max(p1, p2, p3, p4);
            y = Math.max(y, p);
          }

          const r = new THREE.Vector3(0, MathUtils.randomFloat(0, Math.PI * 2), 0);
          const modelVariantName = organism.name[MathUtils.randomInt(0, organism.name.length - 1)];

          return (<IPick>{
            r: new THREE.Euler().setFromVector3(r),
            p: new THREE.Vector3(x, y, z),
            n: modelVariantName,
            f: organism.float,
            s: new THREE.Vector3(scale, scale, scale),
          });
        }
      }
    }

    return null;
  }

  /**
   * Check if an organism can be picked @ the given location
   * @param {IBiomeWeightedObject} organism
   * @param {number} e
   * @param {number} m
   * @param {boolean} force Force scarcity test
   */
  checkCanPick(organism: IBiomeWeightedObject, e: number, m: number, force: boolean = false): boolean {
    const lowM = organism.m !== null && organism.m !== undefined ? (<ILowHigh>organism.m).low : null;
    const highM = organism.m !== null && organism.m !== undefined ? (<ILowHigh>organism.m).high : null;

    const lowE = organism.e !== null && organism.e !== undefined ? (<ILowHigh>organism.e).low : null;
    const highE = organism.e !== null && organism.e !== undefined ? (<ILowHigh>organism.e).high : null;

    const rand = MathUtils.rng();

    return ((force || rand >= organism.scarcity) &&
      (lowE === null || e >= lowE) &&
      (highE === null || e <= highE) &&
      (lowM === null || m >= lowM) &&
      (highM === null || m <= highM));
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

    if (e < minElevation) {
      // default ground fallback
      const nx = x / (1024 * 128);
      const nz = z / (1024 * 128);

      e = minElevation;

      e += 0.025 * this.noise(2 * nx, 2 * nz);
      e += 0.01 * this.noise2(4 * nx, 4 * nz);
      e += 0.005 * this.ridgeNoise(16 * nx, 16 * nz);
      e += 0.00275 * this.ridgeNoise(32 * nx, 32 * nz);
      e += 0.008 * this.noise2(64 * nx, 64 * nz);
    }

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
   * Compute water moisture
   * @param {number} x coord component
   * @param {number} z coord component
   * @return {number} moisture value
   */
  computeWaterMoistureAt(x: number, z: number): number {
    return this.biome.computeWaterMoistureAt(x, z);
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
