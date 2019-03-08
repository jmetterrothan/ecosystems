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
  private toggle: boolean;

  constructor(model: Model) {
    this.model = model;
  }

  async init() {
    this.toggle = true;
    this.recognizer = sc.create('BROWSER_FFT');
    await this.recognizer.ensureModelLoaded();

    if (CommonUtils.isDev()) console.log('Voice system is ready to be use');

    this.listen();
  }

  togglePredictState(active: boolean) {
    if (active === this.toggle) {
      this.toggle = !this.toggle;
      configSvc.voiceEnabled = !configSvc.voiceEnabled;
    }
  }

  listen() {
    this.recognizer.listen(async ({ spectrogram: { frameSize, data } }) => {
      if (configSvc.voiceEnabled) {

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
      }
    }, {
      overlapFactor: 0.999,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true
    });
  }

  async getPredictionLabel(predLabel: any) {
    const label = (await predLabel.data())[0];

    if (CommonUtils.isDev()) console.log(label);

    if (label === 6 || label === 5 || label === 4) {
      return;
    }

    voiceSvc.detectWord(label);
  }
}

export default Voice;
