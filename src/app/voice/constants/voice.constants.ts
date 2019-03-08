import { ISample } from '@voice/models/sample.model';

export const test: ISample = {
  vals: [],
  label: ''
};

const NUM_FRAMES = 3;

export const SAMPLES_CONFIG = {
  NUM_FRAMES,
  INPUT_SHAPE: [NUM_FRAMES, 232, 1]
};
