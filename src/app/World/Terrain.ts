import Chunk from './Chunk';
import World from './World';
import BiomeGenerator from './BiomeGenerator';
import PlaneGeometry from '@mesh/PlaneGeometry';

import { TERRAIN_MATERIAL } from '@materials/terrain.material';
import { WATER_MATERIAL } from '@materials/water.material';
import { CLOUD_MATERIAL } from '@materials/cloud.material';

class Coord {
  constructor(row: number = 0, col: number = 0) {
    this.row = row;
    this.col = col;
  }
}

class Terrain {
  static readonly NCHUNKS_X: number = 2;
  static readonly NCHUNKS_Z: number = 2;
  static readonly NCOLS: number = Terrain.NCHUNKS_X * Chunk.NCOLS;
  static readonly NROWS: number = Terrain.NCHUNKS_Z * Chunk.NROWS;

  static readonly SIZE_X: number = Terrain.NCOLS * Chunk.CELL_SIZE_X;
  static readonly SIZE_Y: number = Chunk.HEIGHT;
  static readonly SIZE_Z: number = Terrain.NROWS * Chunk.CELL_SIZE_Z;

  static readonly OFFSET_X: number = Terrain.SIZE_X / 2;
  static readonly OFFSET_Z: number = Terrain.SIZE_Z / 2;

  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];
  private startX: number;
  private startZ: number;
  private endX: number;
  private endZ: number;
  private chunk : Coord;

  private time: number;

  private generator: BiomeGenerator;
  private topography: THREE.Geometry;
  private water: THREE.Geometry;
  private clouds: THREE.Geometry;

  constructor() {
    this.generator = new BiomeGenerator();
    this.chunks = new Map<string, bool>();
    this.visibleChunks = [];
    this.time = window.performance.now();

    this.topography = new THREE.Geometry();
    this.water = new THREE.Geometry();
    this.clouds = new THREE.Geometry();

    this.chunk = new Coord();
  }

  init(scene: THREE.Scene) {
    const terrain = new THREE.Mesh(this.topography, TERRAIN_MATERIAL);
    scene.add(terrain);

    const water = new THREE.Mesh(this.water, WATER_MATERIAL);
    scene.add(water);

    const clouds = new THREE.Mesh(this.clouds, CLOUD_MATERIAL);
    scene.add(clouds);

    scene.add(Terrain.createBoundingBoxHelper());
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, position: THREE.Vector3) {
    this.getChunkCoordAt(this.chunk, position.x, position.z);

    const nc = Math.min(Terrain.NCHUNKS_X, World.CHUNK_RENDER_LIMIT / 2);
    const nr = Math.min(Terrain.NCHUNKS_Z, World.CHUNK_RENDER_LIMIT / 2);

    this.startX = this.chunk.col - nc;
    this.startZ = this.chunk.row - nr;
    this.endX = this.chunk.col + nc;
    this.endZ = this.chunk.row + nr;

    if (this.startX < 0) { this.startX = 0; }
    if (this.startZ < 0) { this.startZ = 0; }
    if (this.endX > Terrain.NCHUNKS_X) { this.endX = Terrain.NCHUNKS_X; }
    if (this.endZ > Terrain.NCHUNKS_Z) { this.endZ = Terrain.NCHUNKS_Z; }

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
        if (chunk && (chunk.col < this.startX || chunk.col > this.endX || chunk.row < this.startZ || chunk.row > this.endZ)) {
          chunk.clean(scene);
          chunk.dirty = true;
        }
      });

      this.time = now + 1000;
    }
    console.log(this.startZ, this.startZ, this.endX, this.endZ);
    for (let i = this.startZ; i < this.endZ; i++) {
      for (let j = this.startX; j < this.endX; j++) {
        const key = `${i}:${j}`;
        let chunk = this.chunks.get(key);

        // generate chunk if needed
        if (chunk === undefined) {
          chunk = new Chunk(this.generator, i, j);
          chunk.init(this.topography, this.water, this.clouds);
          // chunk.populate(scene);

          const h = Chunk.createBoundingBoxHelper(chunk.bbox);
          scene.add(h);

          this.chunks.set(key, chunk);
        }

        if (frustum.intersectsBox(chunk.bbox)) {
          chunk.visible = true;
          // mark this chunk as visible
          this.visibleChunks.push(chunk);
        }
      }
    }
  }

  getChunkCoordAt(out: Coord, x: number, z: number): Coord {
    out.row = parseInt(z / Chunk.DEPTH, 10);
    out.col = parseInt(x / Chunk.WIDTH, 10);

    return out;
  }

  getChunkAt(x: number, z: number) {
    const p = this.getChunkCoordAt(new Coord(), x, z);

    return this.chunks.get(`${p.row}:${p.col}`);
  }

  getHeightAt(x: number, z: number) {
    return this.generator.computeHeight(x, z);
  }

  static createBoundingBox(): THREE.Box3 {
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

  static createBoundingBoxHelper(bbox: THREE.Box3 = null): THREE.Box3Helper {
    return new THREE.Box3Helper(bbox ? bbox : Terrain.createBoundingBox(), 0xff0000);
  }
}

export default Terrain;
