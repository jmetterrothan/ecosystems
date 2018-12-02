import * as THREE from 'three';

import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';

import { MESH_TYPES } from '@shared/enums/mesh.enum';

class WaterMesh extends Mesh {

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.WATER_MESH);
  }

}

export default WaterMesh;
