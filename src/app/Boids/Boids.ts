import * as THREE from 'three';

import World from '@world/World';
import Creature from './Creature';
import BiomeGenerator from '@world/BiomeGenerator';

import { configSvc } from '@shared/services/graphicsConfig.service';
import { BoidCreatureParameters } from '@shared/models/boidCreatureParameters.model';
import ProgressionService, { progressionSvc } from '@shared/services/progression.service';
import PlayerService, { playerSvc } from '@shared/services/player.service';

import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

class Boids {
  modelName: string;
  creaturesCount: number;

  creatures: Creature[] = [];

  boudingBox: THREE.Vector3;
  origin: THREE.Vector3;

  scene: THREE.Scene;

  private playerSvc: PlayerService;
  private progressionSvc: ProgressionService;

  /**
   * Boids constructor
   * @param {THREE.Scene} scene
   * @param {THREE.Vector3} boudingBox
   * @param {THREE.Vector3} origin
   * @param {string} modelName
   * @param {number} creaturesCount
   * @param {BoidCreatureParameters} creaturesParameters
   */
  constructor(scene: THREE.Scene, boudingBox: THREE.Vector3, origin: THREE.Vector3 = new THREE.Vector3(), modelName: string, creaturesCount: number, creaturesParameters: BoidCreatureParameters) {

    this.scene = scene;
    this.boudingBox = boudingBox;
    this.modelName = modelName;
    this.creaturesCount = creaturesCount;
    this.origin = origin;

    this.playerSvc = playerSvc;
    this.progressionSvc = progressionSvc;

    const mesh = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        this.origin.x, this.origin.y, this.origin.z
      ),
      new THREE.Vector3(
        this.boudingBox.x, this.boudingBox.y, this.boudingBox.z
      )
    );

    if (configSvc.config.DEBUG) {
      this.scene.add(<THREE.Object3D>new THREE.Box3Helper(mesh, 0xffff00));
    }

    this.generate(creaturesParameters);
  }

  /**
   * Creates boids creatures and places them in the world
   * @param {BoidCreatureParameters} parameters
   */
  generate(parameters: BoidCreatureParameters) {
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

      const model = World.LOADED_MODELS.get(this.modelName).clone();
      const creature: Creature = new Creature(position, velocity, model, parameters);

      creature.setBoidsBoundingBox(this.boudingBox);
      creature.setOriginPoint(this.origin);

      this.creatures.push(creature);

      this.scene.add(model);
      // add to scene
    }
  }

  update(generator: BiomeGenerator, delta: number) {
    this.creatures.forEach((creature: Creature) => {
      creature.update(this.creatures, generator, delta);
    });
    const someFishesRepulsed = this.creatures.some((creature: Creature) => creature.position.clone().add(this.origin).distanceTo(this.playerSvc.getPosition()) < creature.getMinRepulseDistance());
    if (someFishesRepulsed) {
      this.progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_fishes);
    }
  }
}

export default Boids;
