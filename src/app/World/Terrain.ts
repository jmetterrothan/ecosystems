import simplexNoise from 'simplex-noise';

import Chunk from './Chunk';
import ITerrainParameters from '../models/ITerrainParameters';

const DEFAULT_PARAMETERS: ITerrainParameters = {
  seed: undefined,
  octaves: 7,
  persistence: 0.5,
  scale: 0.00075,
  low: -45,
  high: 355,
  lacunarity: 1.87
};

class Terrain
{
  public static readonly VIEW_DISTANCE = 3000;
  public static readonly CHUNK_RENDER_LIMIT = Math.ceil(Terrain.VIEW_DISTANCE / Chunk.WIDTH);
  public static readonly MIN_X = -4;
  public static readonly MIN_Z = -32;
  public static readonly MAX_X = 4;
  public static readonly MAX_Z = 32;

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

    const startX =  chunkX - Terrain.CHUNK_RENDER_LIMIT;
    const startZ =  chunkZ - Terrain.CHUNK_RENDER_LIMIT;
    const endX =  chunkX + Terrain.CHUNK_RENDER_LIMIT;
    const endZ =  chunkZ + Terrain.CHUNK_RENDER_LIMIT;

    /*
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
    */

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
          const chunk = new Chunk(this.simplex, this.parameters, i, j);
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
