import * as THREE from 'three';

class Creature {

  position: THREE.Vector3;
  velocity: THREE.Vector3;

  neighbourRadius: number = 6000;
  alignmentWeighting: number = 0.1;
  cohesionWeighting: number = 2;
  separationWeighting: number = 0.1;
  viewAngle: number = 4;
  speed: number = 1;

  avoidTarget: THREE.Vector3 = null;

  protected boidsBoundingBox: THREE.Vector3;

  constructor(position: THREE.Vector3, velocity: THREE.Vector3) {
    this.position = position;
    this.velocity = velocity;
  }

  update(creatures: Creature[]) {

    const interaction = this.calculateInteraction(creatures);
    this.velocity.add(interaction);

    const avoidance = this.calculateBoundsAvoidance();
    this.velocity.add(avoidance);

    if (this.avoidTarget !== null) {
      const repulse = this.calculateRepel(this.avoidTarget);
      this.velocity.add(repulse);
    }

    this.velocity.normalize();
    this.velocity.multiplyScalar(this.speed);
    this.position.add(this.velocity);
  }

  setBoidsBoundingBox(box: THREE.Vector3) {
    this.boidsBoundingBox = box;
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

  private calculateBoundsAvoidance(): THREE.Vector3 {
    const v = new THREE.Vector3();

    if (this.position.x < -this.boidsBoundingBox.x) v.x = 1;
    if (this.position.x > this.boidsBoundingBox.x) v.x = -1;

    if (this.position.y < -this.boidsBoundingBox.y) v.y = 1;
    if (this.position.y > this.boidsBoundingBox.y) v.y = -1;

    if (this.position.z < -this.boidsBoundingBox.z) v.z = 1;
    if (this.position.z > this.boidsBoundingBox.z) v.z = -1;

    return v;
  }

  private calculateRepel(target: THREE.Vector3, maxDistance: number = 100): THREE.Vector3 {
    const v = new THREE.Vector3();

    const distance = this.position.distanceTo(target);

    if (distance < maxDistance) {
      const forceWeighting = 5 / distance;
      v.subVectors(this.position, target);
      v.multiplyScalar(forceWeighting);
    }

    return v;
  }

}

export default Creature;
