import { TERRAIN_MESH_PARAMS } from '@mesh/constants/terrainMesh.constants';
import { IChunkParams } from '@shared/models/chunkParams.model';

export const WATER_MESH_PARAMS: IChunkParams = {
  MAX_CHUNK_HEIGHT: 20000,
  MIN_CHUNK_HEIGHT: -10000,
  NROWS: 3,
  NCOLS: 3,
  CELL_SIZE: 8 * 168 / 3,
  WIDTH: 8 * 168,
  DEPTH: 8 * 168,
};
