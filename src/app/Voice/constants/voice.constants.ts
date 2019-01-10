import { ISample } from '../models/sample.model';

export const test: ISample = {
  vals: [],
  label: ''
};

const NUM_FRAMES = 5;

export const SAMPLES_CONFIG = {
  NUM_FRAMES,
  INPUT_SHAPE: [NUM_FRAMES, 232, 1]
};
