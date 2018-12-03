import Chunk from './Chunk';
import World from './World';
import BiomeGenerator from './BiomeGenerator';

import { TERRAIN_MESH_PARAMS } from '@mesh/constants/terrainMesh.constants';

class Terrain {
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
    this.chunkX = Math.round(position.x / TERRAIN_MESH_PARAMS.WIDTH);
    this.chunkZ = Math.round(position.z / TERRAIN_MESH_PARAMS.DEPTH);

    this.startX = this.chunkX - World.CHUNK_RENDER_LIMIT;
    this.startZ = this.chunkZ - World.CHUNK_RENDER_LIMIT;
    this.endX = this.chunkX + World.CHUNK_RENDER_LIMIT;
    this.endZ = this.chunkZ + World.CHUNK_RENDER_LIMIT;

    if (!World.INFINITE_TERRAIN) {
      if (this.startX < World.MIN_X) {
        this.startX = World.MIN_X;
      }
      if (this.startZ < World.MIN_Z) {
        this.startZ = World.MIN_Z;
      }
      if (this.endX > World.MAX_X) {
        this.endX = World.MAX_X;
      }
      if (this.endZ > World.MAX_Z) {
        this.endZ = World.MAX_Z;
      }
    }

    // reset previously visible chunks
    for (let i = 0, n = this.visibleChunks.length; i < n; i++) {
      const chunk = this.visibleChunks[i];

      chunk.terrainMesh.visible = true;
      if (chunk.waterMesh) chunk.waterMesh.visible = true;
      if (chunk.cloudMesh) chunk.cloudMesh.visible = true;
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

          scene.add(chunk.terrainMesh);
          if (chunk.waterMesh) scene.add(chunk.waterMesh);
          if (chunk.cloudMesh) scene.add(chunk.cloudMesh);
        } else {
          chunk = this.chunks.get(id);
        }

        if (frustum.intersectsObject(chunk.terrainMesh)) {
          chunk.visible = true;
        }

        // mark this chunk as visible
        this.visibleChunks.push(chunk);
      }
    }
  }

  getChunkAt(x: number, z: number) {
    const chunkX = Math.trunc(x / TERRAIN_MESH_PARAMS.WIDTH);
    const chunkZ = Math.trunc(z / TERRAIN_MESH_PARAMS.DEPTH);

    return this.chunks.get(`${chunkZ}:${chunkX}`);
  }

  getHeightAt(x: number, z: number) {
    return this.generator.computeHeight(x, z);
  }

}

export default Terrain;
