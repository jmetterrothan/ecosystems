import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { WATER_MESH_PARAMS } from './constants/waterMesh.constants';

class WaterMesh extends Mesh {

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.WATER_MESH, WATER_MESH_PARAMS);
  }

}

export default WaterMesh;
