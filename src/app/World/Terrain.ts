import Chunk from './Chunk';
import BiomeGenerator from './BiomeGenerator';

import { CHUNK_PARAMS } from '@shared/constants/chunkParams.constants';

class Terrain {

  static readonly VIEW_DISTANCE: number = 25000;
  static readonly CHUNK_RENDER_LIMIT: number = Math.ceil(Terrain.VIEW_DISTANCE / CHUNK_PARAMS.WIDTH);
  static readonly INFINITE_TERRAIN: boolean = true;

  static readonly MIN_X: number = 0;
  static readonly MIN_Z: number = 0;
  static readonly MAX_X: number = 1;
  static readonly MAX_Z: number = 1;

  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];

  private time: number;

  private generator: BiomeGenerator;

  constructor() {
    this.generator = new BiomeGenerator();
    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];
    this.time = window.performance.now();
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, position: THREE.Vector3) {
    const chunkX = Math.round(position.x / CHUNK_PARAMS.WIDTH);
    const chunkZ = Math.round(position.z / CHUNK_PARAMS.DEPTH);

    let startX = chunkX - Terrain.CHUNK_RENDER_LIMIT;
    let startZ = chunkZ - Terrain.CHUNK_RENDER_LIMIT;
    let endX = chunkX + Terrain.CHUNK_RENDER_LIMIT;
    let endZ = chunkZ + Terrain.CHUNK_RENDER_LIMIT;

    if (!Terrain.INFINITE_TERRAIN) {
      if (startX < Terrain.MIN_X) {
        startX = Terrain.MIN_X;
      }
      if (startZ < Terrain.MIN_Z) {
        startZ = Terrain.MIN_Z;
      }
      if (endX > Terrain.MAX_X) {
        endX = Terrain.MAX_X;
      }
      if (endZ > Terrain.MAX_Z) {
        endZ = Terrain.MAX_Z;
      }
    }

    // reset previously visible chunks
    for (let i = 0, n = this.visibleChunks.length; i < n; i++) {
      this.visibleChunks[i].terrain.visible = true;
      // this.visibleChunks[i].water.visible = true;
    }

    // loop through all chunks in range
    this.visibleChunks = [];

    // try to clean from memory unused generated chunks
    const now = window.performance.now();
    if (this.time >= now) {
      this.chunks.forEach((chunk, key) => {
        if (chunk.col < startX || chunk.col > endX || chunk.row < startZ || chunk.row > endZ) {
          chunk.terrain.geometry.dispose();
          (<THREE.Material>chunk.terrain.material).dispose();
          scene.remove(chunk.terrain);
          chunk.terrain = null;

          // chunk.water.geometry.dispose();
          // (<THREE.Material>chunk.water.material).dispose();
          // scene.remove(chunk.water);
          // chunk.water = null;

          this.chunks.delete(key);
        }
      });
      this.time = now + 1000;
    }

    for (let i = startZ; i < endZ; i++) {
      for (let j = startX; j < endX; j++) {
        const id = `${i}:${j}`;

        // generate chunk if needed
        if (!this.chunks.has(id)) {
          const chunk = new Chunk(this.generator, i, j);
          chunk.populate(scene);

          this.chunks.set(id, chunk);
          scene.add(chunk.terrain);
        }

        const chunk = this.chunks.get(id);
        if (frustum.intersectsObject(chunk.terrain)) {
          chunk.terrain.visible = true;
          // chunk.water.visible = true;
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
