import * as THREE from 'three';

import World from '@world/World';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import PlayerService, { playerSvc } from '@shared/services/player.service';

import { IBoidCreatureParameters } from '@shared/models/boidCreatureParameters.model';

import MathUtils from '@utils/Math.utils';

class Creature {
  static SPEED: number = 100;

  private position: THREE.Vector3;
  private velocity: THREE.Vector3;
  private speed: number;

  private minRepulseDistance: number = 30000;

  private model: THREE.Object3D;
  private parameters: IBoidCreatureParameters;

  private boidsBoundingBox: THREE.Vector3;
  private boidsOrigin: THREE.Vector3;

  private playerSvc: PlayerService;

  constructor(position: THREE.Vector3, velocity: THREE.Vector3, model: THREE.Object3D, parameters: IBoidCreatureParameters) {
    this.position = position;
    this.velocity = velocity;
    this.model = model;
    this.parameters = parameters;

    this.playerSvc = playerSvc;

    this.speed = this.parameters.speed + MathUtils.randomInt(-10, 10); // TODO: improve the random factor (put it higher)
  }

  update(creatures: Creature[], generator: BiomeGenerator, delta: number) {
    if (creatures.length > 0) {
      const interaction = this.calculateInteraction(creatures);
      this.velocity.add(interaction);
    }

    const avoidance = this.calculateBoundsAvoidance();
    this.velocity.add(avoidance);

    // player repel
    const repulse = this.calculateRepel(this.playerSvc.getPosition());
    this.velocity.add(repulse);

    // terrain repel
    const wp = this.position.clone().add(this.velocity.clone().normalize().multiplyScalar(this.speed * delta)).add(this.boidsOrigin);
    const y = generator.computeHeightAt(wp.x, wp.z);
    const by = (this.parameters.underwater ? y : Math.max(y, Chunk.SEA_LEVEL)) - this.boidsOrigin.y;
    const d = Math.sqrt((by - this.position.y) * (by - this.position.y)) / Chunk.HEIGHT;
    const td = 8192 / Chunk.HEIGHT;

    if (d <= td) {
      const ground = new THREE.Vector3(this.position.x, by, this.position.z);
      const repulse2 = this.repulse(ground, 1);

      this.velocity.add(repulse2);
    }

    // world edge repel
    if (this.parameters.underwater && !World.pointInWorld(this.position.clone().add(this.boidsOrigin))) {
      this.velocity.x = -this.velocity.x;
      this.velocity.z = -this.velocity.z;
    }

    // apply transformation
    this.velocity.normalize();
    this.position.add(this.velocity.clone().multiplyScalar(this.speed * delta));

    this.updateModel();
  }

  getPosition(): THREE.Vector3 {
    return this.position;
  }

  getModelPosition(): THREE.Vector3 {
    return this.position.clone().add(this.boidsOrigin);
  }

  getMinRepulseDistance(): number {
    return this.minRepulseDistance;
  }

  getParameters(): IBoidCreatureParameters {
    return this.parameters;
  }

  setBoidsBoundingBox(box: THREE.Vector3) {
    this.boidsBoundingBox = box;
  }

  setOriginPoint(origin: THREE.Vector3) {
    this.boidsOrigin = origin;
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
      this.speed += 750;
    } else if (this.speed > this.parameters.speed) {
      this.speed -= 750;
    } else {
      this.speed = this.parameters.speed;
    }

    return v;
  }
}

export default Creature;
