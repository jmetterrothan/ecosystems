import simplexNoise from 'simplex-noise';

import Chunk from './Chunk';

class Terrain
{
  parameters : TerrainParameters;
  simplex: simplexNoise;
  chunks: Map<string, Chunk>;
  visibleChunks: Chunk[] = [];

  constructor(parameters: TerrainParameters) {
    this.parameters = Object.assign({}, Terrain.DEFAULT_PARAMETERS, parameters);

    this.simplex = new simplexNoise(this.parameters.seed);
    this.chunks = new Map<string, Chunk>();
  }

  update(scene: THREE.Scene, frustum: THREE.Frustum, position: THREE.Vector3) {
    const chunkX = Math.trunc(position.x / Chunk.WIDTH);
    const chunkZ = Math.trunc(position.z / Chunk.DEPTH);

    const startX =  chunkX - Terrain.MAX_RENDER_DISTANCE;
    const startZ =  chunkZ - Terrain.MAX_RENDER_DISTANCE;
    const endX =  chunkX + Terrain.MAX_RENDER_DISTANCE;
    const endZ =  chunkZ + Terrain.MAX_RENDER_DISTANCE;

    // reset previously visible chunks
    for (let i = 0, n = this.visibleChunks.length; i < n; i++) {
      this.visibleChunks[i].mesh.visible = false;
    }

    // loop through all chunks in range
    this.visibleChunks = [];

    for (let i = startZ; i < endZ; i++) {
      for (let j = startX; j < endX; j++) {
        const id = `${i}:${j}`;

        // generate chunk if needed
        if (!this.chunks.has(id)) {
          const chunk = new Chunk(this, i, j);
          chunk.mesh.visible = false;
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
}

Terrain.DEFAULT_PARAMETERS = {
  seed: undefined,
  iterations: 16,
  persistence: 0.45,
  scale: 0.005,
  low: -25,
  high: 50
};

Terrain.MAX_RENDER_DISTANCE = 16;

export interface TerrainParameters {
  seed: string|number;
  iterations: number;
  persistence: number;
  scale: number;
  low: number;
  high: number;
}

export default Terrain;
