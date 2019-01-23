import * as tf from '@tensorflow/tfjs';
import * as sc from '@tensorflow-models/speech-commands';

import MathUtils from '@shared/utils/Math.utils';

import { SAMPLES_CONFIG } from './constants/voice.constants';

class Voice {
  private recognizer: sc.SpeechCommandRecognizer;
  private predictState: Boolean;
  private clickedButton: Boolean;
  private model: Model;

  constructor(model: Model) {
    this.model = model;
    this.init();
  }

  init() {
    this.predictState = false;
    this.clickedButton = false;
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
    console.log(this.predicState);
  }

  listen() {
    if (!this.predictState) {
      this.predictState = true;
    }

    this.recognizer.listen(async ({ spectrogram: { frameSize, data } }) => {
      const vals = MathUtils.normalize(
        data.subarray(-frameSize * SAMPLES_CONFIG.NUM_FRAMES),
        -100,
        10
      );
      const input = tf.tensor(vals, [1, ...SAMPLES_CONFIG.INPUT_SHAPE]);
      const probs = this.model.predict(input);
      const predLabel = probs.argMax(1);
      await this.getPredictionLabel(predLabel);
      tf.dispose([input, probs, predLabel]);
    }, {
      overlapFactor: 0.999,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true
    });

    console.log(this.predicState);
  }

  async getPredictionLabel(predLabel: any) {
    const label = (await predLabel.data())[0];
    if (label === 1) {
      this.clickedButton = false;
      return;
    }
    if (label === 0) {
      this.clickedButton = true;
    }
  }

  get predictState() {
    return this.predictState;
  }

  get clickedButton() {
    return this.clickedButton;
  }
}

export default Voice;
