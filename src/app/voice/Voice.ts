import * as tf from '@tensorflow/tfjs';
import * as sc from '@tensorflow-models/speech-commands';

import { voiceSvc } from '@voice/services/voice.service';
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
    console.log('Voice system is ready to be use');
  }

  async ensureModelLoaded() {
    await this.recognizer.ensureModelLoaded();
  }

  stopListening() {
    this.recognizer.stopListening();
    this.predictState = false;
    console.log('Voice system is not listening anymore');
  }

  togglePredictState() {
    if (!this.predictState) {
      this.listen();
    } else {
      this.stopListening();
    }
  }

  listen() {
    console.log('Voice system is currently listening');
    this.predictState = true;

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
  }

  async getPredictionLabel(predLabel: any) {
    const label = (await predLabel.data())[0];
    if (label === 1) {
      return;
    }
    if (label === 0) {
      voiceSvc.placeObject();
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
