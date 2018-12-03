import { TERRAIN_MESH_PARAMS } from '@mesh/constants/terrainMesh.constants';
import { IChunkParams } from '@shared/models/chunkParams.model';

export const CLOUD_MESH_PARAMS: IChunkParams = {
  MAX_CHUNK_HEIGHT: 20000,
  MIN_CHUNK_HEIGHT: -10000,
  NROWS: 1,
  NCOLS: 1,
  CELL_SIZE: TERRAIN_MESH_PARAMS.WIDTH,
  WIDTH: 8 * 168,
  DEPTH: 8 * 168,
};
