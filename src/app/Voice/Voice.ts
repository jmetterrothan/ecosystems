import * as tf from '@tensorflow/tfjs';
import * as sc from '@tensorflow-models/speech-commands';

import MathUtils from '@shared/utils/Math.utils';

// import CONFIG from 'voice.constants';
const NUM_FRAMES = 5;
const INPUT_SHAPE = [NUM_FRAMES, 232, 1];

class Voice {
  private recognizer: sc.SpeechCommandRecognizer;
  private predictState: Boolean;
  private model: Model;

  constructor(model: Model) {
    this.model = model;
    this.init();
  }

  init() {
    this.predictState = false;
    this.recognizer = sc.create('BROWSER_FFT');
  }

  async ensureModelLoaded() {
    await this.recognizer.ensureModelLoaded();
  }

  togglePredictState() {
    this.predictState = this.recognizer.isListening();
  }

  stopListening() {
    if (this.predictState) {
      this.predicState = false;
    }

    this.recognizer.stopListening();
  }

  listen() {
    if (!this.predictState) {
      this.predictState = true;
    }

    this.recognizer.listen(async ({ spectrogram: { frameSize, data } }) => {
      const vals = MathUtils.normalize(
        data.subarray(-frameSize * NUM_FRAMES),
        -100,
        10
      );
      const input = tf.tensor(vals, [1, ...INPUT_SHAPE]);
      const probs = this.model.model.predict(input);
      const predLabel = probs.argMax(1);
      await this.getPredictionLabel(predLabel);
      tf.dispose([input, probs, predLabel]);
    }, {
      overlapFactor: 0.999,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true
    });
  }

  async getPredictionLabel(predLabel: any) {
    const label = (await predLabel.data())[0];
    if (label === 2) {
      return;
    }
    if (label === 0) {
      console.log('listening');
    }
  }

  get predictState() {
    return this.predictState;
  }
}

export default Voice;
