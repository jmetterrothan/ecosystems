import * as THREE from 'three';

import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';

import Creature from '@boids/Creatures/Creature';
import TropicalFish from '@app/boids/creatures/TropicalFish';
import BandedButterflyFish from '@app/boids/creatures/BandedButterflyFish';
import ClownFish from '@app/boids/creatures/ClownFish';
import Butterfly from '@boids/creatures/Butterfly';
import DiscusFish from './creatures/DiscusFish';

import MathUtils from '@shared/utils/Math.utils';

import { configSvc } from '@app/shared/services/config.service';
import { progressionSvc } from '@achievements/services/progression.service';
import { playerSvc } from '@shared/services/player.service';

import { IBoidCreatureParameters } from '@boids/models/boidCreatureParameters.model';

import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

class Boids {
  private creatures: Creature[] = [];

  private boudingBox: THREE.Vector3;
  private origin: THREE.Vector3;

  private scene: THREE.Scene;

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

    if (configSvc.debug) {
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

    // repulse trophies
    const someCreaturesRepulsed = this.creatures.some((creature: Creature) => creature.getModelPosition().distanceTo(playerSvc.getPosition()) < creature.getMinRepulseDistance());
    if (someCreaturesRepulsed) {
      if (this.creatures[0] instanceof Butterfly) {
        progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_butterflies);
      } else if (
        this.creatures[0] instanceof ClownFish ||
        this.creatures[0] instanceof DiscusFish ||
        this.creatures[0] instanceof BandedButterflyFish ||
        this.creatures[0] instanceof TropicalFish
      ) {
        progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_fishes);
      }
    }
  }
}

export default Boids;
