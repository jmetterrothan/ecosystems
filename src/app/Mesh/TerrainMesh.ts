import Mesh from '@mesh/Mesh';
import World from '@world/World';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import MathUtils from '@shared/utils/Math.utils';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { TERRAIN_MATERIAL } from '@materials/terrain.material';

import { IChunkParameters } from '@shared/models/chunkParameters.model';

class TerrainMesh extends Mesh {

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.TERRAIN_MESH, <IChunkParameters>{
      maxChunkHeight: Chunk.MAX_CHUNK_HEIGHT,
      minChunkHeight: Chunk.MIN_CHUNK_HEIGHT,
      nRows: Chunk.NROWS,
      nCols: Chunk.NCOLS,
      cellSizeX: Chunk.CELL_SIZE_X,
      cellSizeZ: Chunk.CELL_SIZE_Z,
      width: Chunk.WIDTH,
      height: Chunk.HEIGHT,
      depth: Chunk.DEPTH
    });
  }

  getY(x: number, z: number): number {
    return this.generator.computeHeight(x, z);
  }

  getMaterial(): THREE.Material {
    return TERRAIN_MATERIAL;
  }

  getLow(): number {
    return this.low;
  }

  needGenerateWater(): boolean {
    return this.low <= World.SEA_LEVEL;
  }

  needGenerateCloud(): boolean {
    const t = (this.moistureAverage > 0.66) ? (1 - this.moistureAverage) + 0.5 : 0.975;
    return this.moistureAverage > 0.34 && MathUtils.rng() > t;
  }
}

export default TerrainMesh;
