import simplexNoise from 'simplex-noise';

import Chunk from './Chunk';
import ITerrainParameters from '../models/ITerrainParameters';

const DEFAULT_PARAMETERS: ITerrainParameters = {
  seed: undefined,
  iterations: 8,
  persistence: 0.45,
  scale: 0.0008,
  low: 0,
  high: 255,
  lacunarity: 1.8
};

class Terrain
{
  public static readonly MAX_RENDER_DISTANCE = 16;

  public readonly parameters : ITerrainParameters;
  public readonly simplex: simplexNoise;
  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[] = [];

  constructor(parameters: ITerrainParameters) {
    this.parameters = { ...DEFAULT_PARAMETERS, ...parameters };

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

export default Terrain;
