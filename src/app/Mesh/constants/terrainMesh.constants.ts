import { IChunkParams } from '@shared/models/chunkParams.model';

export const TERRAIN_MESH_PARAMS: IChunkParams = {
  MAX_CHUNK_HEIGHT: 20000,
  MIN_CHUNK_HEIGHT: -10000,
  NROWS: 8,
  NCOLS: 8,
  CELL_SIZE: 168,
  WIDTH: 8 * 168,
  DEPTH: 8 * 168
};
