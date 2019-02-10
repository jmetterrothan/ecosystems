import * as THREE from 'three';
import { BehaviorSubject, Observable } from 'rxjs';

import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import SoundManager from '@shared/SoundManager';

import { progressionSvc } from '@achievements/services/progression.service';
import { monitoringSvc } from '@shared/services/monitoring.service';

import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';

class PlayerService {

  private underwater: boolean;
  private sourceUnderwater: BehaviorSubject<boolean>;
  underwater$: Observable<boolean>;

  private position: THREE.Vector3;

  private totalDistance: number = 0;

  constructor() {
    this.underwater = false;
    this.sourceUnderwater = new BehaviorSubject<boolean>(this.underwater);
    this.underwater$ = this.sourceUnderwater.asObservable();
  }

  init() {
    this.timer();
  }

  getPosition(): THREE.Vector3 { return this.position; }

  setPosition(pos: THREE.Vector3) {
    if (!this.position) this.position = new THREE.Vector3(pos.x, pos.y, pos.z);
    else this.totalDistance += Math.round(this.position.distanceTo(pos));
    this.position.copy(pos);

    const isWithinWorldBorders = this.isWithinWorldBorders();

    // go underwater
    if (this.position.y < Chunk.SEA_LEVEL && !this.underwater && isWithinWorldBorders) {
      if (!this.underwater) {
        this.underwater = true;
        SoundManager.play('bubbles');

        progressionSvc.increment(PROGRESSION_COMMON_STORAGE_KEYS.going_underwater);
        monitoringSvc.sendEvent(monitoringSvc.categories.biome, monitoringSvc.actions.visited, PROGRESSION_COMMON_STORAGE_KEYS.going_underwater.value);
      }
    }

    // terrestrial
    if ((this.position.y >= Chunk.SEA_LEVEL || !isWithinWorldBorders) && this.underwater) {
      this.underwater = false;
      SoundManager.play('bubbles');
    }

    if (this.position.y <= -Chunk.HEIGHT / 2 && this.isInsideWorldBoudingBox()) {
      progressionSvc.increment(PROGRESSION_EXTRAS_STORAGE_KEYS.under_map);
    }

  }

  isUnderwater(): boolean { return this.underwater; }

  setUnderwater(underwater: boolean) {
    this.underwater = underwater;
  }

  isWithinWorldBorders(): boolean {
    const position = this.position;
    return this.isInsideWorldBoudingBox() && !(position.y < -Terrain.SIZE_Y / 2);
  }

  isInsideWorldBoudingBox(): boolean {
    const position = this.position;
    return !(position.x < 0 || position.x > Terrain.SIZE_X || position.z < 0 || position.z > Terrain.SIZE_Z);
  }

  private timer() {
    setInterval(() => {
      progressionSvc.increment(PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled, this.totalDistance);
      this.totalDistance = 0;
    }, 10000);
  }
}

export const playerSvc = new PlayerService();
export default PlayerService;
