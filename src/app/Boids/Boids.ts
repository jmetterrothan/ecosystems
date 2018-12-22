import * as THREE from 'three';

import World from '@world/World';
import Creature from './Creature';
// import Predator from './Predator';

class Boids {

  creaturesCount: number;

  creatures: Creature[] = [];
  // meshes: THREE.Object3D[] = [];

  // predator: Predator;
  // predatorMesh: THREE.Object3D;

  boudingBox: THREE.Vector3;
  origin: THREE.Vector3;

  scene: THREE.Scene;

  constructor(scene: THREE.Scene, boudingBox: THREE.Vector3, origin: THREE.Vector3 = new THREE.Vector3(), creaturesCount: number = 20) {
    this.scene = scene;
    this.boudingBox = boudingBox;
    this.creaturesCount = creaturesCount;
    this.origin = origin;

    // const geometry = new THREE.BoxGeometry(width, height, depth);
    // const material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
    // const mesh = new THREE.Mesh(geometry, material);

    const mesh = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        0, 0, 0
      ),
      new THREE.Vector3(
        this.boudingBox.x, this.boudingBox.y, this.boudingBox.z
      )
    );

    const box = new THREE.Box3Helper(mesh, 0xffff00);
    this.scene.add(box);

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
