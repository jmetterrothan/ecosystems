import * as THREE from 'three';

import BiomeGenerator from './BiomeGenerator';

import TerrainMesh from '@mesh/TerrainMesh';
import WaterMesh from '@mesh/WaterMesh';

class Chunk {
  static readonly MAX_CHUNK_HEIGHT: number = 20000;
  static readonly MIN_CHUNK_HEIGHT: number = -10000;
  static readonly NROWS: number = 8;
  static readonly NCOLS: number = 8;
  static readonly CELL_SIZE: number = 160;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE;

  readonly row: number;
  readonly col: number;

  terrain: THREE.Mesh;
  water: THREE.Mesh;

  generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    const terrainMesh = new TerrainMesh(generator, row, col);
    this.terrain = terrainMesh.generate();

    this.water = terrainMesh.needRenderWater() ? new WaterMesh(generator, row, col).generate() : null;
  }

  // populate(scene: THREE.Scene) {
  //   const padding = 300; // object bounding box size / 2
  //   const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 30, MathUtils.rng);
  //   const points = pds.fill();

  //   points.forEach((point: number[]) => {
  //     const x = padding + this.col * Chunk.WIDTH + point.shift();
  //     const z = padding + this.row * Chunk.DEPTH + point.shift();
  //     const y = this.generator.computeHeight(x, z);

  //     // select an organism based on the current biome
  //     const object = this.generator.pick(x, z);

  //     if (object) {
  //       object.position.set(x, y, z);
  //       scene.add(object);
  //     }
  //   });
  // }
}

export default Chunk;
