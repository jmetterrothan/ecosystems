import * as THREE from 'three';

import World from '@world/World';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import Creature from '@boids/Creature';
import MathUtils from '@shared/utils/Math.utils';

import GraphicsConfigService, { configSvc } from '@services/graphicsConfig.service';
import ProgressionService, { progressionSvc } from '@shared/services/progression.service';
import PlayerService, { playerSvc } from '@shared/services/player.service';

import { IBoidCreatureParameters } from '@shared/models/boidCreatureParameters.model';

import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

class Boids {
  private modelName: string;
  private creaturesCount: number;

  private creatures: Creature[] = [];

  private boudingBox: THREE.Vector3;
  private origin: THREE.Vector3;

  private scene: THREE.Scene;

  private playerSvc: PlayerService;
  private progressionSvc: ProgressionService;
  private configSvc: GraphicsConfigService;

  /**
   * Boids constructor
   * @param {THREE.Scene} scene
   * @param {THREE.Vector3} boudingBox
   * @param {THREE.Vector3} origin
   * @param {string} modelName
   * @param {number} creaturesCount
   */
  constructor(scene: THREE.Scene, boudingBox: THREE.Vector3, origin: THREE.Vector3 = new THREE.Vector3(), modelName: string, creaturesCount: number) {
    this.scene = scene;
    this.boudingBox = boudingBox;
    this.modelName = modelName;
    this.creaturesCount = creaturesCount;
    this.origin = origin;

    this.playerSvc = playerSvc;
    this.progressionSvc = progressionSvc;
    this.configSvc = configSvc;

    if (this.configSvc.config.DEBUG) {
      const mesh = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(
          this.origin.x, this.origin.y, this.origin.z
        ),
        new THREE.Vector3(
          this.boudingBox.x, this.boudingBox.y, this.boudingBox.z
        )
      );
      this.scene.add(<THREE.Object3D>new THREE.Box3Helper(mesh, 0xffff00));
    }
  }

  /**
   * Creates boids creatures and places them in the world
   * @param {IBoidCreatureParameters} parameters
   */
  generate(parameters: IBoidCreatureParameters) {
    for (let i = 0; i < this.creaturesCount; i++) {
      const py = MathUtils.rng() * this.boudingBox.y - this.boudingBox.y / 2;

      const position = new THREE.Vector3(
        MathUtils.rng() * this.boudingBox.x - this.boudingBox.x / 2,
        parameters.underwater ? py : Math.max(py, Chunk.SEA_LEVEL - this.boudingBox.y + 2048),
        MathUtils.rng() * this.boudingBox.z - this.boudingBox.z / 2
      );

      const velocity = new THREE.Vector3(
        MathUtils.rng() * 2 - 1,
        MathUtils.rng() * 2 - 1,
        MathUtils.rng() * 2 - 1,
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

    const someCreaturesRepulsed = this.creatures.some((creature: Creature) => creature.getModelPosition().distanceTo(this.playerSvc.getPosition()) < creature.getMinRepulseDistance());
    if (someCreaturesRepulsed) {
      this.progressionSvc.increment(this.creatures[0].getParameters().underwater
        ? PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_fishes
        : PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_butterflies);
    }
  }
}

export default Boids;
