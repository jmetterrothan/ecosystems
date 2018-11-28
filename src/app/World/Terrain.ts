import Chunk from './Chunk';
import Player from '../Player';
import World from './World';
import Utils from '@shared/Utils';
import Biome from './Biome/Biome';

class Terrain {
  static readonly VIEW_DISTANCE: number = 6000;
  static readonly CHUNK_RENDER_LIMIT: number = Math.ceil(Terrain.VIEW_DISTANCE / Chunk.WIDTH);
  static readonly INFINITE_TERRAIN: boolean = true;

  static readonly MIN_X: number = -4;
  static readonly MIN_Z: number = -4;
  static readonly MAX_X: number = 4;
  static readonly MAX_Z: number = 4;

  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];

  private time: number;

  constructor() {
    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];
    this.time = window.performance.now();
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, position: THREE.Vector3) {
    const chunkX = Math.round(position.x / Chunk.WIDTH);
    const chunkZ = Math.round(position.z / Chunk.DEPTH);

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
      this.visibleChunks[i].mesh.visible = false;
    }

    // loop through all chunks in range
    this.visibleChunks = [];

    // try to clean from memory unused generated chunks
    const now = window.performance.now();
    if (this.time >= now) {
      this.chunks.forEach((chunk, key) => {
        if (chunk.col < startX || chunk.col > endX || chunk.row < startZ || chunk.row > endZ) {
          chunk.mesh.geometry.dispose();
          (<THREE.Material>chunk.mesh.material).dispose();
          scene.remove(chunk.mesh);
          chunk.mesh = null;
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
          const biome = World.getBiome('flatlands');
          const chunk = new Chunk(biome, i, j);

          chunk.populate(scene, this);

          this.chunks.set(id, chunk);
          scene.add(chunk.mesh);
        }

        const chunk = this.chunks.get(id);
        if (frustum.intersectsObject(chunk.mesh)) {
          chunk.mesh.visible = true;

          // mark this chunk as visible
          this.visibleChunks.push(chunk);
        }
      }
    }
  }

  getChunkAt(x: number, z: number) {
    const chunkX = Math.trunc(x / Chunk.WIDTH);
    const chunkZ = Math.trunc(z / Chunk.DEPTH);

    return this.chunks.get(`${chunkZ}:${chunkX}`);
  }

  getHeightAt(x: number, z: number, c?: Chunk) {
    const chunk = (c instanceof Chunk) ? c : this.getChunkAt(x, z);
    if (chunk) {
      return chunk.biome.sumOctaves(x, z);
    }
    return 0;
  }
}

export default Terrain;
