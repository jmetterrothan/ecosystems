import * as THREE from 'three';

import World from '@world/World';
import Creature from './Creature';

import { configSvc } from '@shared/services/graphicsConfig.service';
import { BoidCreatureParameters } from '@shared/models/boidCreatureParameters.model';

class Boids {
  modelName: string;
  creaturesCount: number;

  creatures: Creature[] = [];

  boudingBox: THREE.Vector3;
  origin: THREE.Vector3;

  scene: THREE.Scene;

  /**
   * Boids constructor
   * @param {THREE.Scene} scene
   * @param {THREE.Vector3} boudingBox
   * @param {THREE.Vector3} origin
   * @param {string} modelName
   * @param {number} creaturesCount
   * @param {BoidCreatureParameters} creaturesParameters
   */
  constructor(scene: THREE.Scene, boudingBox: THREE.Vector3, origin: THREE.Vector3 = new THREE.Vector3(), modelName: string, creaturesCount: number, creaturesParameters: BoidCreatureParameters) {
    this.scene = scene;
    this.boudingBox = boudingBox;
    this.modelName = modelName;
    this.creaturesCount = creaturesCount;
    this.origin = origin;

    const mesh = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        this.origin.x, this.origin.y, this.origin.z
      ),
      new THREE.Vector3(
        this.boudingBox.x, this.boudingBox.y, this.boudingBox.z
      )
    );

    if (configSvc.config.DEBUG) {
      this.scene.add(<THREE.Object3D>new THREE.Box3Helper(mesh, 0xffff00));
    }

    this.generate(creaturesParameters);
  }

  /**
   * Creates boids creatures and places them in the world
   * @param {BoidCreatureParameters} parameters
   */
  generate(parameters: BoidCreatureParameters) {
    for (let i = 0; i < this.creaturesCount; i++) {

      const position = new THREE.Vector3(
        Math.random() * this.boudingBox.x - this.boudingBox.x / 2,
        Math.random() * this.boudingBox.y - this.boudingBox.y / 2,
        Math.random() * this.boudingBox.z - this.boudingBox.z / 2
      );

      const velocity = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );

      const model = World.LOADED_MODELS.get(this.modelName).clone();
      const creature: Creature = new Creature(position, velocity, model, parameters);

      creature.setBoidsBoundingBox(this.boudingBox);
      creature.setOriginPoint(this.origin);

      this.creatures.push(creature);

      this.scene.add(model);
      // add to scene
    }
  }

  update(delta: number) {
    this.creatures.forEach((creature: Creature) => {
      creature.update(this.creatures, delta);
    });
  }
}

export default Boids;
