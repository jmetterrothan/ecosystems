import * as tf from '@tensorflow/tfjs';
import * as sc from '@tensorflow-models/speech-commands';

import MathUtils from '@shared/utils/Math.utils';
import CommonUtils from '@app/shared/utils/Common.utils';

import { voiceSvc } from '@voice/services/voice.service';
import { configSvc } from '@app/shared/services/config.service';

import { SAMPLES_CONFIG } from './constants/voice.constants';

class Voice {
  private recognizer: sc.SpeeSpeechCommandRecognizer;
  private model: Model;

  constructor(model: Model) {
    this.model = model;
    this.init();
  }

  init() {
    this.recognizer = sc.create('BROWSER_FFT');
    if (CommonUtils.isDev()) console.log('Voice system is ready to be use');
  }

  async ensureModelLoaded() {
    await this.recognizer.ensureModelLoaded();
  }

  stopListening() {
    configSvc.voiceEnabled = false;
    this.recognizer.stopListening();
    if (CommonUtils.isDev()) console.log('Voice system is not listening anymore');
  }

  togglePredictState() {
    if (!configSvc.voiceEnabled) {
      this.listen();
    } else {
      this.stopListening();
    }
  }

  listen() {
    configSvc.voiceEnabled = true;
    if (CommonUtils.isDev()) console.log('Voice system is currently listening');

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
      voiceSvc.detectPlacementWord();
    }
  }

}

export default Voice;
