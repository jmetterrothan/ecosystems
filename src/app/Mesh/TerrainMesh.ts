import Mesh from './Mesh';
import World from '../World/World';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { TERRAIN_MESH_PARAMS } from './constants/terrainMesh.constants';

import BiomeGenerator from '@world/BiomeGenerator';
import { CLOUD_CONSTANTS } from '@shared/constants/cloud.constants';

import MathUtils from '@shared/utils/Math.utils';

class TerrainMesh extends Mesh {

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.TERRAIN_MESH, TERRAIN_MESH_PARAMS);
  }

  getLow(): number {
    return this.low;
  }

  needGenerateWater(): boolean {
    return this.low <= World.SEA_LEVEL;
  }

  needGenerateCloud(): boolean {
    return this.moistureAverage > CLOUD_CONSTANTS.MIN_MOISTURE_AVERAGE && MathUtils.rng() > 0.925;
  }
}

export default TerrainMesh;
