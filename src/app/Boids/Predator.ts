import * as THREE from 'three';

import Creature from './Creature';

class Predator extends Creature {

  minRepulseDistance: number = 20000;

  constructor(position: THREE.Vector3 = new THREE.Vector3(), velocity: THREE.Vector3 = new THREE.Vector3, model: THREE.Object3D) {
    super(position, velocity, model);
  }

  calculateCreatureInteraction(creature: Creature) {

    const distance = this.position.distanceTo(creature.position);

    if (distance <= this.minRepulseDistance) {
      const repulseWeighting = (1 / distance) * 15;
      creature.repulse(this.position, repulseWeighting);

      this.steer(creature.position, 0.0005);
      this.speed = 300;

      if (distance <= 1000) {
        // this.speed = 1;

        // creature dead / reborn
        creature.position = new THREE.Vector3(
          Math.random() * this.boidsBoundingBox.x - this.boidsBoundingBox.x / 2,
          Math.random() * this.boidsBoundingBox.y - this.boidsBoundingBox.y / 2,
          Math.random() * this.boidsBoundingBox.z - this.boidsBoundingBox.z / 2
        );
      }
    }

  }

  update() {
    const avoidance = this.calculateBoundsAvoidance();
    this.velocity.add(avoidance.multiplyScalar(0.1));

    this.velocity.normalize();
    this.position.add(this.velocity.clone().multiplyScalar(this.speed));

  }

}

export default Predator;
