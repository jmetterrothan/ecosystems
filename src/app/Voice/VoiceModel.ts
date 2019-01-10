import * as tf from '@tensorflow/tfjs';

import { SAMPLES_CONFIG } from './constants/voice.constants';
import samplesData from './sample.json';

class VoiceModel {
  private samples: Sample;
  private model: tf.Model;

  constructor() {
    this.samples = samplesData;
    this.build();
  }

  build() {
    this.model = tf.sequential();
    this.model.add(tf.layers.depthwiseConv2d({
      depthMultiplier: 8,
      kernelSize: [SAMPLES_CONFIG.NUM_FRAMES, 3],
      activation: 'relu',
      inputShape: SAMPLES_CONFIG.INPUT_SHAPE
    }));
    this.model.add(tf.layers.maxPooling2d({ poolSize: [1, 2], strides: [2, 2] }));
    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async train() {
    const samples = this.samples;

    const ys = tf.oneHot(samples.map(e => e.label), 3);
    const xsShape = [samples.length, ...SAMPLES_CONFIG.INPUT_SHAPE];
    const xs = tf.tensor(this.flatten(samples.map(e => e.vals)), xsShape);

    await this.model.fit(xs, ys, {
      batchSize: 16,
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch === 0) {
            console.log('Training model');
          }
          if (epoch === 9) {
            console.log(`Model trained with an accuracy of ${(logs.acc * 100).toFixed(1)}%`);
          }
        }
      }
    });

    tf.dispose([xs, ys]);
  }

  flatten(tensors): Float32Array {
    const size = Object.keys(tensors[0]).length;
    const result = new Float32Array(tensors.length * size);
    tensors.forEach((arr, i) => result.set(arr, i * size));
    return result;
  }
}

export default VoiceModel;
