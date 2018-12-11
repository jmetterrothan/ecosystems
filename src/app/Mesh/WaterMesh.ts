import * as THREE from 'three';
import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { WATER_MATERIAL } from '@materials/water.material';
import { IChunkParameters } from '@shared/models/chunkParameters.model';

class WaterMesh extends Mesh {
  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.WATER_MESH, <IChunkParameters>{
      nRows: 1,
      nCols: 1,
      cellSizeX: Chunk.WIDTH / 1,
      cellSizeZ: Chunk.WIDTH / 1,
      width: Chunk.WIDTH,
      height: Chunk.HEIGHT,
      depth: Chunk.DEPTH
    });
  }

  getY(x, z) {
    return this.generator.computeWaterHeightAt(x, z);
  }

  getMaterial(): THREE.Material {
    return WATER_MATERIAL;
  }
}

export default WaterMesh;
