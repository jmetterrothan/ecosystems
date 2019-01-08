import * as tf from '@tensorflow/tfjs';
import * as sc from '@tensorflow-models/speech-comands';

import MathUtils from '@shared/utils/Math.utils';

import CONFIG from 'voice.constants';

class Voice {
  private recognizer: sc.SpeechCommandRecognizer;
  private predictState: Boolean;

  constructor() {
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
    this.predictState = recognizer.isListening();
  }

  stopListening() {
    if (this.predictState) this.recognizer.stopListening();
  }

  listen() {
    this.recognizer.listen(async ({spectrogram: {frameSize, data}}) => {
      const vals = MathUtils.normalize(
        data.subarray(-frameSize * CONFIG.NUM_FRAMES),
        -100,
        10
      );
      const input = tf.tensor(vals, [1, ...CONGIF.INPUT_SHAPE]);
      const probs = model.predict(input);
      const predLabel = probs.argMax(1);
      // await showGeometry(predLabel);
      tf.dispose([input, probs, predLabel]);
    }, {
      overlapFactor: 0.999,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true
    });
  }

  get recognizer(): sc.SpeechCommandRecognizer {
    return this.recognizer;
  }
}

export default Voice;
