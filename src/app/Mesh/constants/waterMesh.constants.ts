import { TERRAIN_MESH_PARAMS } from '@mesh/constants/terrainMesh.constants';
import { IChunkParams } from '@shared/models/chunkParams.model';

export const WATER_MESH_PARAMS: IChunkParams = {
  MAX_CHUNK_HEIGHT: 20000,
  MIN_CHUNK_HEIGHT: -10000,
  NROWS: 4,
  NCOLS: 4,
  CELL_SIZE: 2 * 168,
  WIDTH: 8 * 168,
  DEPTH: 8 * 168,
};
