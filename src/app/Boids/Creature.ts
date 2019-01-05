import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';

import { playerSvc } from '@shared/services/player.service';
import { BoidCreatureParameters } from '@shared/models/boidCreatureParameters.model';
import Chunk from '@world/Chunk';

class Creature {
  static SPEED: number = 100;

  position: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;

  minRepulseDistance: number = 20000;

  model: THREE.Object3D;
  parameters: BoidCreatureParameters;

  avoidTarget: THREE.Vector3 = null;

  protected boidsBoundingBox: THREE.Vector3;
  protected boidsOrigin: THREE.Vector3;

  constructor(position: THREE.Vector3, velocity: THREE.Vector3, model: THREE.Object3D, parameters: BoidCreatureParameters) {
    this.position = position;
    this.velocity = velocity;
    this.model = model;
    this.parameters = parameters;

    this.speed = this.parameters.speed; // 100
  }

  update(creatures: Creature[], generator: BiomeGenerator, delta: number) {
    const interaction = this.calculateInteraction(creatures);
    this.velocity.add(interaction);

    const avoidance = this.calculateBoundsAvoidance();
    this.velocity.add(avoidance);

    const repulse = this.calculateRepel(playerSvc.getPosition());
    this.velocity.add(repulse);

    const wp = this.position.clone().add(this.velocity).add(this.boidsOrigin);
    const y = generator.computeHeightAt(wp.x, wp.z);
    const by = y - this.boidsOrigin.y;
    const d = Math.sqrt((by - this.position.y) * (by - this.position.y)) / Chunk.HEIGHT;
    const td = 4096 / Chunk.HEIGHT;

    if (d < td) {
      const ground = new THREE.Vector3(this.position.x, by, this.position.z);
      const repulse2 = this.repulse(ground, 1);

      this.velocity.add(repulse2);
    }

    this.velocity.normalize();
    this.position.add(this.velocity.clone().multiplyScalar(this.speed));

    this.updateModel();
  }

  setBoidsBoundingBox(box: THREE.Vector3) {
    this.boidsBoundingBox = box;
  }

  setOriginPoint(origin: THREE.Vector3) {
    this.boidsOrigin = origin;
  }

  setAvoidTarget(target: THREE.Vector3) {
    this.avoidTarget = target;
  }

  steer(target: THREE.Vector3, wieghting: number = 1): THREE.Vector3 {
    const v = new THREE.Vector3();

    v.subVectors(target, this.position);
    v.multiplyScalar(wieghting);

    return v;
  }

  repulse(target: THREE.Vector3, weighting: number = 1): THREE.Vector3 {
    const v = new THREE.Vector3();

    v.subVectors(this.position, target);
    v.multiplyScalar(weighting);

    return v;
  }

  private updateModel() {
    const v = this.position.clone().add(this.boidsOrigin);
    // console.log(this.position.add(this.boidsOrigin));
    this.model.position.copy(v);
    this.model.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x);
    this.model.rotation.z = Math.asin(this.velocity.y / this.velocity.length());
  }

  private calculateInteraction(creatures: Creature[]): THREE.Vector3 {

    const v = new THREE.Vector3();

    const aligment = new THREE.Vector3();
    const separation = new THREE.Vector3();
    const cohesion = new THREE.Vector3();
    const repulse = new THREE.Vector3();

    let contributedCount: number = 1; // number of neighbours that contributed to the new velocity

    for (let i = 0; i < creatures.length; i++) {
      const neighbour = creatures[i];
      const distance = this.position.distanceTo(neighbour.position);
      const product = neighbour.velocity.clone().dot(this.velocity);
      const angleBetween = Math.acos(product);

      if ((distance > 0 && distance < this.parameters.neighbourRadius) && angleBetween < this.parameters.viewAngle) {
        // calc difference between position and neighbours to get a vector pointing

        repulse.subVectors(neighbour.position, this.position);
        repulse.normalize();
        repulse.divideScalar(distance);

        aligment.add(neighbour.velocity);

        cohesion.add(neighbour.position);

        separation.add(repulse);

        contributedCount++;
      }

    }

    aligment.divideScalar(contributedCount);
    aligment.normalize();

    cohesion.divideScalar(contributedCount);
    cohesion.sub(this.position);
    cohesion.normalize();

    separation.divideScalar(contributedCount);
    separation.negate();
    separation.normalize();

    v.add(aligment.multiplyScalar(this.parameters.alignmentWeighting));
    v.add(cohesion.multiplyScalar(this.parameters.cohesionWeighting));
    v.add(separation.multiplyScalar(this.parameters.separationWeighting));

    return v;
  }

  protected calculateBoundsAvoidance(): THREE.Vector3 {
    const v = new THREE.Vector3();

    if (this.position.x < -this.boidsBoundingBox.x) v.x = 1;
    if (this.position.x > this.boidsBoundingBox.x) v.x = -1;

    if (this.position.y < -this.boidsBoundingBox.y) v.y = 1;
    if (this.position.y > this.boidsBoundingBox.y) v.y = -1;

    if (this.position.z < -this.boidsBoundingBox.z) v.z = 1;
    if (this.position.z > this.boidsBoundingBox.z) v.z = -1;

    return v;
  }

  private calculateRepel(target: THREE.Vector3): THREE.Vector3 {
    const v = new THREE.Vector3();

    const distance = this.position.clone().add(this.boidsOrigin).distanceTo(target);

    if (distance < this.minRepulseDistance) {
      const forceWeighting = 5 / distance;
      v.subVectors(this.position.clone().add(this.boidsOrigin), target);
      v.multiplyScalar(forceWeighting);
      this.speed += 40;
    } else if (this.speed > this.parameters.speed) {
      this.speed -= 40;
    } else {
      this.speed = this.parameters.speed;
    }

    return v;
  }
}

export default Creature;
