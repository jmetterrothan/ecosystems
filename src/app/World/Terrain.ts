import Chunk from './Chunk';
import BiomeGenerator from './BiomeGenerator';
import Mesh from '../Mesh/Mesh';
import { CHUNK_PARAMS } from '@shared/constants/chunkParams.constants';

class Terrain {
  static readonly VIEW_DISTANCE: number = 22000;
  static readonly CHUNK_RENDER_LIMIT: number = Math.ceil(Terrain.VIEW_DISTANCE / CHUNK_PARAMS.WIDTH);
  static readonly INFINITE_TERRAIN: boolean = true;

  static readonly MIN_X: number = 0;
  static readonly MIN_Z: number = 0;
  static readonly MAX_X: number = 1;
  static readonly MAX_Z: number = 1;

  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];
  private startX: number;
  private startZ: number;
  private endX: number;
  private endZ: number;
  private chunkX: number;
  private chunkZ: number;

  private time: number;

  private generator: BiomeGenerator;

  constructor() {
    this.generator = new BiomeGenerator();
    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];
    this.time = window.performance.now();
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, position: THREE.Vector3) {
    this.chunkX = Math.round(position.x / CHUNK_PARAMS.WIDTH);
    this.chunkZ = Math.round(position.z / CHUNK_PARAMS.DEPTH);

    this.startX = this.chunkX - Terrain.CHUNK_RENDER_LIMIT;
    this.startZ = this.chunkZ - Terrain.CHUNK_RENDER_LIMIT;
    this.endX = this.chunkX + Terrain.CHUNK_RENDER_LIMIT;
    this.endZ = this.chunkZ + Terrain.CHUNK_RENDER_LIMIT;

    if (!Terrain.INFINITE_TERRAIN) {
      if (this.startX < Terrain.MIN_X) {
        this.startX = Terrain.MIN_X;
      }
      if (this.startZ < Terrain.MIN_Z) {
        this.startZ = Terrain.MIN_Z;
      }
      if (this.endX > Terrain.MAX_X) {
        this.endX = Terrain.MAX_X;
      }
      if (this.endZ > Terrain.MAX_Z) {
        this.endZ = Terrain.MAX_Z;
      }
    }

    // reset previously visible chunks
    for (let i = 0, n = this.visibleChunks.length; i < n; i++) {
      const chunk = this.visibleChunks[i];

      chunk.terrain.visible = true;
      if (chunk.water) chunk.water.visible = true;
    }

    // loop through all chunks in range
    this.visibleChunks = [];

    // try to clean from memory unused generated chunks
    const now = window.performance.now();

    if (now >= this.time) {
      this.chunks.forEach(chunk => {
        if (chunk && (chunk.col < this.startX || chunk.col > this.endX || chunk.row < this.startZ || chunk.row > this.endZ)) {
          chunk.clean(scene);
          this.chunks.delete(chunk.key);
        }
      });

      this.time = now + 1000;
    }

    for (let i = this.startZ; i < this.endZ; i++) {
      for (let j = this.startX; j < this.endX; j++) {
        const id = `${i}:${j}`;

        let chunk = null;

        // generate chunk if needed
        if (!this.chunks.has(id)) {
          chunk = new Chunk(this.generator, i, j);
          chunk.populate(scene);

          this.chunks.set(id, chunk);

          scene.add(chunk.terrain);
          if (chunk.water) scene.add(chunk.water);
        } else {
          chunk = this.chunks.get(id);
        }

        if (frustum.intersectsObject(chunk.terrain)) {
          chunk.visible = true;
        }

        // mark this chunk as visible
        this.visibleChunks.push(chunk);
      }
    }
  }

  getChunkAt(x: number, z: number) {
    const chunkX = Math.trunc(x / CHUNK_PARAMS.WIDTH);
    const chunkZ = Math.trunc(z / CHUNK_PARAMS.DEPTH);

    return this.chunks.get(`${chunkZ}:${chunkX}`);
  }

  getHeightAt(x: number, z: number) {
    return this.generator.computeHeight(x, z);
  }

}

export default Terrain;
