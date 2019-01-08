import * as tf from '@tensorflow/tfjs';

import CONFIG from 'voice.constants';

class Model {
  private samples: Sample;
  private model: tf.Model;

  constructor(samples: Sample) {
    this.samples = samples;
    this.build();
  }

  build() {
    this.model = tf.sequential();
    this.model.add(tf.layers.depthwiseConv2d({
      depthMultiplier: 8,
      kernelSize: [CONFIG.NUM_FRAMES, 3],
      activation: 'relu',
      inputShape: CONFIG.INPUT_SHAPE
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
    const xsShape = [samples.length, ...CONFIG.INPUT_SHAPE];
    const xs = tf.tensor(flatten(samples.map(e => e.vals)), xsShape);

    await this.model.fit(xs, ys, {
      batchSize: 16,
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Accuracy: ${(logs.acc * 100).toFixed(1)}% Epoch: ${epoch + 1}`);
        }
      }
    });

    tf.dispose([xs, ys]);
  }
}

export default Model;
