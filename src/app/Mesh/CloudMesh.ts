import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { CLOUD_MESH_PARAMS } from './constants/cloudMesh.constants';

class CloudMesh extends Mesh {

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.CLOUD_MESH, CLOUD_MESH_PARAMS);
  }

}

export default CloudMesh;
