import * as THREE from 'three';

import World from '@world/World';
import Creature from './Creature';

import { CONFIG } from '@shared/constants/config.constants';

class Boids {

  creaturesCount: number;

  creatures: Creature[] = [];

  boudingBox: THREE.Vector3;
  origin: THREE.Vector3;

  scene: THREE.Scene;

  constructor(scene: THREE.Scene, boudingBox: THREE.Vector3, origin: THREE.Vector3 = new THREE.Vector3(), creaturesCount: number = 100) {
    this.scene = scene;
    this.boudingBox = boudingBox;
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

    if (CONFIG.DEBUG) {
      this.scene.add(<THREE.Object3D>new THREE.Box3Helper(mesh, 0xffff00));
    }
  }

  generate() {
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

      const model = World.LOADED_MODELS.get('fish1').clone();
      const creature: Creature = new Creature(position, velocity, model);

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
