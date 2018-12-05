import * as THREE from 'three';

import Chunk from './Chunk';
import World from './World';
import BiomeGenerator from './BiomeGenerator';

import { TERRAIN_MATERIAL } from '@materials/terrain.material';
import { WATER_MATERIAL } from '@materials/water.material';
import { CLOUD_MATERIAL } from '@materials/cloud.material';

class Coord {
  row: number;
  col: number;
  constructor(row: number = 0, col: number = 0) {
    this.row = row;
    this.col = col;
  }
}

class Terrain {
  static readonly NCHUNKS_X: number = 128;
  static readonly NCHUNKS_Z: number = 128;
  static readonly NCOLS: number = Terrain.NCHUNKS_X * Chunk.NCOLS;
  static readonly NROWS: number = Terrain.NCHUNKS_Z * Chunk.NROWS;

  static readonly SIZE_X: number = Terrain.NCOLS * Chunk.CELL_SIZE_X;
  static readonly SIZE_Y: number = Chunk.HEIGHT;
  static readonly SIZE_Z: number = Terrain.NROWS * Chunk.CELL_SIZE_Z;

  static readonly OFFSET_X: number = Terrain.SIZE_X / 2;
  static readonly OFFSET_Z: number = Terrain.SIZE_Z / 2;

  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];

  private start: Coord;
  private end: Coord;
  private chunk: Coord;

  private time: number;

  private generator: BiomeGenerator;
  private topography: THREE.Geometry;
  private water: THREE.Geometry;
  private clouds: THREE.Geometry;

  constructor() {
    this.generator = new BiomeGenerator();
    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];
    this.time = window.performance.now();

    this.topography = new THREE.Geometry();
    this.water = new THREE.Geometry();
    this.clouds = new THREE.Geometry();

    this.chunk = new Coord();
    this.start = new Coord();
    this.end = new Coord();
  }

  init(scene: THREE.Scene) {
    const terrain = new THREE.Mesh(this.topography, TERRAIN_MATERIAL);
    scene.add(terrain);

    const water = new THREE.Mesh(this.water, WATER_MATERIAL);
    scene.add(water);

    const clouds = new THREE.Mesh(this.clouds, CLOUD_MATERIAL);
    scene.add(clouds);

    scene.add(<THREE.Object3D>Terrain.createRegionBoundingBoxHelper());
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, position: THREE.Vector3) {
    this.getChunkCoordAt(this.chunk, position.x, position.z);

    // console.log(this.chunk);

    const nc = Math.min(Terrain.NCHUNKS_X, World.CHUNK_RENDER_LIMIT / 2);
    const nr = Math.min(Terrain.NCHUNKS_Z, World.CHUNK_RENDER_LIMIT / 2);

    this.start.col = this.chunk.col - nc;
    this.start.row = this.chunk.row - nr;
    this.end.col = this.chunk.col + nc;
    this.end.row = this.chunk.row + nr;

    // limit visible chunk range to region boundaries
    if (this.start.col < 0) { this.start.col = 0; this.end.col = nc; }
    if (this.start.row < 0) { this.start.row = 0; this.end.col = nr; }

    if (this.end.col > Terrain.NCHUNKS_X) { this.end.col = Terrain.NCHUNKS_X; this.start.col = Terrain.NCHUNKS_X - nc; }
    if (this.end.row > Terrain.NCHUNKS_Z) { this.end.row = Terrain.NCHUNKS_Z; this.start.row = Terrain.NCHUNKS_Z - nr; }

    // reset previously visible chunks
    for (let i = 0, n = this.visibleChunks.length; i < n; i++) {
      this.visibleChunks[i].visible = false;
    }

    // loop through all chunks in range
    this.visibleChunks = [];

    // try to clean from memory unused generated chunks
    const now = window.performance.now();

    if (now >= this.time) {
      this.chunks.forEach(chunk => {
        if (chunk && (chunk.col < this.start.col || chunk.col > this.end.col || chunk.row < this.start.row || chunk.row > this.end.row)) {
          chunk.clean(scene);
          chunk.dirty = true;
        }
      });

      this.time = now + 1000;
    }

    for (let i = this.start.row; i < this.end.row; i++) {
      for (let j = this.start.col; j < this.end.col; j++) {
        let chunk = this.chunks.get(`${i}:${j}`);

        // generate chunk if needed
        if (chunk === undefined) {
          chunk = this.loadChunk(scene, i, j);
        }

        // chunk is visible in frustum
        if (frustum.intersectsBox(chunk.bbox)) {
          chunk.visible = true;

          if (!chunk.initialized) {
            chunk.init(scene, this.topography, this.water, this.clouds);
            chunk.initialized = true;
          }

          if (chunk.dirty) {
            chunk.populate(scene);
            chunk.dirty = false;
          }

          // mark this chunk as visible for the next update
          this.visibleChunks.push(chunk);
        }
      }
    }
  }

  loadChunk(scene, chunkRow: number, chunkCol: number): Chunk {
    const chunk = new Chunk(this.generator, chunkRow, chunkCol);

    // const h = Chunk.createBoundingBoxHelper(chunk.bbox);
    // scene.add(h);

    this.chunks.set(`${chunkRow}:${chunkCol}`, chunk);

    return chunk;
  }

  getChunkCoordAt(out: Coord, x: number, z: number): Coord {
    out.row = z / Chunk.DEPTH | 0;
    out.col = x / Chunk.WIDTH | 0;

    return out;
  }

  getChunkAt(x: number, z: number) {
    const p = this.getChunkCoordAt(new Coord(), x, z);

    return this.chunks.get(`${p.row}:${p.col}`);
  }

  getHeightAt(x: number, z: number) {
    return this.generator.computeHeight(x, z);
  }

  static createRegionBoundingBox(): THREE.Box3 {
    return new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        Terrain.SIZE_X / 2,
        Terrain.SIZE_Y / 2,
        Terrain.SIZE_Z / 2
      ),
      new THREE.Vector3(
        Terrain.SIZE_X,
        Terrain.SIZE_Y,
        Terrain.SIZE_Z
      ));
  }

  static createRegionBoundingBoxHelper(bbox: THREE.Box3 = null): THREE.Box3Helper {
    return new THREE.Box3Helper(bbox ? bbox : Terrain.createRegionBoundingBox(), 0xff0000);
  }
}

export default Terrain;
