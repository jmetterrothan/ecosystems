import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { IChunkParameters } from '@shared/models/chunkParams.model';

class WaterMesh extends Mesh {
  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.WATER_MESH, <IChunkParameters>{
      nRows: 4,
      nCols: 4,
      cellSizeX: Chunk.WIDTH / 4,
      cellSizeZ: Chunk.WIDTH / 4,
      width: Chunk.WIDTH,
      height: Chunk.HEIGHT,
      depth: Chunk.DEPTH
    });
  }
}

export default WaterMesh;
