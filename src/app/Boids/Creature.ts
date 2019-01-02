import * as THREE from 'three';
import { playerSvc } from '@shared/services/player.service';

class Creature {

  static SPEED: number = 100;

  position: THREE.Vector3;
  velocity: THREE.Vector3;

  neighbourRadius: number = 6000;
  alignmentWeighting: number = 0.0065;
  cohesionWeighting: number = 0.01;
  separationWeighting: number = 0.05;
  viewAngle: number = 4;
  speed: number = Creature.SPEED;

  minRepulseDistance: number = 20000;

  model: THREE.Object3D;

  avoidTarget: THREE.Vector3 = null;

  protected boidsBoundingBox: THREE.Vector3;
  protected boidsOrigin: THREE.Vector3;

  constructor(position: THREE.Vector3, velocity: THREE.Vector3, model: THREE.Object3D) {
    this.position = position;
    this.velocity = velocity;
    this.model = model;
  }

  update(creatures: Creature[], delta: number) {

    const interaction = this.calculateInteraction(creatures);
    this.velocity.add(interaction);

    const avoidance = this.calculateBoundsAvoidance();
    this.velocity.add(avoidance);

    const repulse = this.calculateRepel(playerSvc.getPosition());
    this.velocity.add(repulse);

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

  steer(target: THREE.Vector3, wieghting: number = 1) {
    const v = new THREE.Vector3();

    v.subVectors(target, this.position);
    v.multiplyScalar(wieghting);

    this.velocity.add(v);
  }

  repulse(target: THREE.Vector3, weighting: number = 1) {
    const v = new THREE.Vector3();

    v.subVectors(this.position, target);
    v.multiplyScalar(weighting);

    this.velocity.add(v);
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

      if ((distance > 0 && distance < this.neighbourRadius) && angleBetween < this.viewAngle) {
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

    v.add(aligment.multiplyScalar(this.alignmentWeighting));
    v.add(cohesion.multiplyScalar(this.cohesionWeighting));
    v.add(separation.multiplyScalar(this.separationWeighting));

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
      v.subVectors(this.position, target);
      v.multiplyScalar(forceWeighting);
      this.speed += 40;
    } else if (this.speed > Creature.SPEED) {
      this.speed -= 40;
    } else {
      this.speed = Creature.SPEED;
    }

    return v;
  }

}

export default Creature;
