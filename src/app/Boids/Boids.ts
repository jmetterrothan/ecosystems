import * as THREE from 'three';
import Creature from './Creature';

class Boids {

  creaturesCount: number;

  creatures: Creature[] = [];
  meshes: THREE.Mesh[] = [];

  boudingBox: THREE.Vector3;

  scene: THREE.Scene;

  constructor(scene: THREE.Scene, width: number, height: number, depth: number, creaturesCount: number = 20) {
    this.scene = scene;
    this.boudingBox = new THREE.Vector3(width, height, depth);
    this.creaturesCount = creaturesCount;
  }

  generate() {
    for (let i = 0; i < this.creaturesCount; i++) {

      const position = new THREE.Vector3(
        Math.random() * this.boudingBox.x - 1000,
        Math.random() * this.boudingBox.y - 1000,
        Math.random() * this.boudingBox.z - 1000
      );

      const velocity = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );

      const creature: Creature = new Creature(position, velocity);
      creature.setBoidsBoundingBox(this.boudingBox);

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), new THREE.MeshLambertMaterial({ color: 'red' }));

      this.creatures.push(creature);
      this.meshes.push(mesh);

      this.scene.add(mesh);
      // add to scene
    }
  }

  update() {
    for (let i = 0; i < this.creaturesCount; i++) {
      const creature = this.creatures[i];
      const mesh = this.meshes[i];

      creature.update(this.creatures);
      mesh.position.copy(creature.position);

      mesh.rotation.y = Math.atan2(-creature.velocity.z, creature.velocity.x);
      mesh.rotation.z = Math.asin(creature.velocity.y / creature.velocity.length());

    }
  }

}

export default Boids;
