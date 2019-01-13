import * as THREE from 'three';

import World from '@world/World';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import Creature from '@boids/Creatures/Creature';
import MathUtils from '@shared/utils/Math.utils';

import GraphicsConfigService, { configSvc } from '@services/graphicsConfig.service';
import ProgressionService, { progressionSvc } from '@shared/services/progression.service';
import PlayerService, { playerSvc } from '@shared/services/player.service';

import { IBoidCreatureParameters } from '@shared/models/boidCreatureParameters.model';

import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

class Boids {
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
   */
  constructor(scene: THREE.Scene, boudingBox: THREE.Vector3, origin: THREE.Vector3 = new THREE.Vector3()) {
    this.scene = scene;
    this.boudingBox = boudingBox;
    this.origin = origin;

    this.playerSvc = playerSvc;
    this.progressionSvc = progressionSvc;
    this.configSvc = configSvc;

    if (this.configSvc.config.DEBUG) {
      const mesh = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(this.origin.x, this.origin.y, this.origin.z),
        new THREE.Vector3(this.boudingBox.x, this.boudingBox.y, this.boudingBox.z)
      );
      this.scene.add(<THREE.Object3D>new THREE.Box3Helper(mesh, 0xffff00));
    }
  }

  /**
   * Creates a creature and places it in the world
   * @param {Creature} creature
   */
  addCreature(creature) {
    const parameters: IBoidCreatureParameters = creature.getParameters();

    const py = MathUtils.rng() * this.boudingBox.y - this.boudingBox.y / 2;
    const position = new THREE.Vector3(
      MathUtils.rng() * this.boudingBox.x - this.boudingBox.x / 2,
      parameters.underwater ? py : Math.max(py, Chunk.SEA_LEVEL - this.boudingBox.y + 2048),
      MathUtils.rng() * this.boudingBox.z - this.boudingBox.z / 2
    );

    creature.setPosition(position);
    creature.setBoidsBoundingBox(this.boudingBox);
    creature.setOriginPoint(this.origin);
    creature.addToScene(this.scene);

    this.creatures.push(creature);
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
