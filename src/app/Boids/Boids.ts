import * as THREE from 'three';

import World from '@world/World';
import Creature from './Creature';

class Boids {

  creaturesCount: number;

  creatures: Creature[] = [];
  meshes: THREE.Mesh[] = [];

  boudingBox: THREE.Vector3;

  scene: THREE.Scene;

  constructor(scene: THREE.Scene, width: number, height: number, depth: number, creaturesCount: number = 1) {
    this.scene = scene;
    this.boudingBox = new THREE.Vector3(width, height, depth);
    this.creaturesCount = creaturesCount;

    // const geometry = new THREE.BoxGeometry(width, height, depth);
    // const material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
    // const mesh = new THREE.Mesh(geometry, material);

    const mesh = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        width / 2,
        height / 2,
        depth / 2,
      ),
      new THREE.Vector3(
        width, height, depth
      )
    );

    const box = new THREE.Box3Helper(mesh, 0xffff00);
    this.scene.add(box);

  }

  generate() {
    for (let i = 0; i < this.creaturesCount; i++) {

      const position = new THREE.Vector3(
        Math.random() * this.boudingBox.x,
        Math.random() * this.boudingBox.y,
        Math.random() * this.boudingBox.z
      );

      const velocity = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );

      const creature: Creature = new Creature(position, velocity);
      creature.setBoidsBoundingBox(this.boudingBox);

      const mesh = World.LOADED_MODELS.get('fish1').clone(); // new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), new THREE.MeshLambertMaterial({ color: 'red' }));

      this.creatures.push(creature);
      this.meshes.push(mesh);

      this.scene.add(mesh);
      // add to scene
    }
  }

  update(delta: number) {
    for (let i = 0; i < this.creaturesCount; i++) {
      const creature = this.creatures[i];
      const mesh = this.meshes[i];

      creature.update(this.creatures, delta);
      mesh.position.copy(creature.position);

      mesh.rotation.y = Math.atan2(-creature.velocity.z, creature.velocity.x);
      mesh.rotation.z = Math.asin(creature.velocity.y / creature.velocity.length());
    }
  }
}

export default Boids;
