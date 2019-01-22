import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';
import World from '@world/World';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import MathUtils from '@utils/Math.utils';

import PlayerService, { playerSvc } from '@shared/services/player.service';

import { IBoidCreatureParameters } from '@boids/models/boidCreatureParameters.model';

class Creature {
  private position: THREE.Vector3;
  private velocity: THREE.Vector3;
  private speed: number;

  private model: THREE.Object3D;
  private parameters: IBoidCreatureParameters;

  private boidsBoundingBox: THREE.Vector3;
  private boidsOrigin: THREE.Vector3;

  private playerSvc: PlayerService;

  constructor(models: string[], parameters: IBoidCreatureParameters) {
    const model = models[MathUtils.randomInt(0, models.length - 1)];
    this.model = World.LOADED_MODELS.get(model).clone();
    this.parameters = parameters;

    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();

    this.speed = parameters.speed;
    this.model.scale.multiplyScalar(parameters.scale);

    this.playerSvc = playerSvc;
  }

  update(creatures: Creature[], generator: BiomeGenerator, delta: number) {
    if (creatures.length > 0) {
      const interaction = this.calculateInteraction(creatures);
      this.velocity.add(interaction);
    }

    const avoidance = this.calculateBoundsAvoidance();
    this.velocity.add(avoidance);

    // terrain repel
    const wp = this.position.clone().add(this.velocity.clone().normalize().multiplyScalar(this.speed * delta)).add(this.boidsOrigin);
    const y = generator.computeHeightAt(wp.x, wp.z);
    const by = (this.parameters.underwater ? y : Math.max(y, Chunk.SEA_LEVEL)) - this.boidsOrigin.y;
    const d = Math.sqrt((by - this.position.y) * (by - this.position.y)) / Chunk.HEIGHT;
    const td = 4096 / Chunk.HEIGHT;

    if (d <= td) {
      const ground = new THREE.Vector3(this.position.x, by, this.position.z);
      const repulse2 = this.repulse(ground, 1 / d);

      this.velocity.add(repulse2);
    } else {
      // only apply if creature is not repelled by the ground
      if (
        this.position.x > -this.boidsBoundingBox.x &&
        this.position.z > -this.boidsBoundingBox.x &&
        this.position.x < this.boidsBoundingBox.x &&
        this.position.z < this.boidsBoundingBox.z) {
        // player repel
        const repulse = this.calculateRepel(this.playerSvc.getPosition());
        this.velocity.add(repulse);
      }
    }

    // apply transformation
    this.velocity.normalize();
    this.position.add(this.velocity.clone().multiplyScalar(this.speed * delta));

    if (this.parameters.underwater) {
      if (this.position.y + this.boidsOrigin.y > 0) { this.position.y = -this.boidsOrigin.y; }
      if (this.position.x + this.boidsOrigin.x < 0) { this.position.x = -this.boidsOrigin.x; }
      if (this.position.z + this.boidsOrigin.z < 0) { this.position.z = -this.boidsOrigin.z; }
      if (this.position.x + this.boidsOrigin.x > Terrain.SIZE_X) { this.position.x = Terrain.SIZE_X - this.boidsOrigin.x; }
      if (this.position.z + this.boidsOrigin.z > Terrain.SIZE_Z) { this.position.z = Terrain.SIZE_Z - this.boidsOrigin.z; }
    }

    this.updateModel(delta);
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.model);
  }

  setPosition(v: THREE.Vector3) {
    this.position.copy(v);
  }

  getPosition(): THREE.Vector3 {
    return this.position;
  }

  getModelPosition(): THREE.Vector3 {
    return this.position.clone().add(this.boidsOrigin);
  }

  getMinRepulseDistance(): number {
    return this.parameters.minRepulseDistance;
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

  private updateModel(delta: number) {
    const v1 = this.position.clone().add(this.boidsOrigin);

    this.model.position.copy(v1);

    const v2 = this.velocity.clone().multiplyScalar(delta);
    this.model.rotation.y = Math.atan2(-v2.z, v2.x);
    this.model.rotation.z = Math.asin(v2.y / v2.length());
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

    if (distance < this.parameters.minRepulseDistance) {
      const forceWeighting = 1 / distance;
      v.subVectors(this.position.clone().add(this.boidsOrigin), target);
      v.multiplyScalar(forceWeighting);
      this.speed += 350;
    } else if (this.speed > this.parameters.speed) {
      this.speed -= 350;
    } else {
      this.speed = this.parameters.speed;
    }

    return v;
  }
}

export default Creature;
