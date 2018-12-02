import { IChunkParams } from '../models/chunkParams.model';

export const CHUNK_PARAMS: IChunkParams = {
  MAX_CHUNK_HEIGHT: 20000,
  MIN_CHUNK_HEIGHT: -10000,
  NROWS: 8,
  NCOLS: 8,
  CELL_SIZE: 160,
  WIDTH: 8 * 160,
  DEPTH: 8 * 160
};