import simplexNoise from 'simplex-noise';

import Chunk from './Chunk';
import Player from '../Player';

class Terrain {
  public static readonly VIEW_DISTANCE: number = 4000;
  public static readonly CHUNK_RENDER_LIMIT: number = Math.ceil(Terrain.VIEW_DISTANCE / Chunk.WIDTH);
  public static readonly INFINITE_TERRAIN: boolean = false;
  public static readonly MIN_X: number = -6;
  public static readonly MIN_Z: number = -64;
  public static readonly MAX_X: number = 6;
  public static readonly MAX_Z: number = 64;

  public readonly simplex: simplexNoise;
  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];

  private time: number;

  constructor(seed: string) {
    this.simplex = new simplexNoise(seed);
    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];
    this.time = window.performance.now();
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, player: Player) {
    const position = player.getPosition();
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
      this.time = now + 500;
    }

    for (let i = startZ; i < endZ; i++) {
      for (let j = startX; j < endX; j++) {
        const id = `${i}:${j}`;

        // generate chunk if needed
        if (!this.chunks.has(id)) {
          const chunk = new Chunk(this.simplex, i, j);
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

  getHeightAt(x: number, z: number) {
    return Chunk.sumOctaves(this.simplex, x, z);
  }
}

export default Terrain;
