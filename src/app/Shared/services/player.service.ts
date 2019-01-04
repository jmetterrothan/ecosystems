import * as THREE from 'three';

import ProgressionService, { progressionSvc } from '@shared/services/progression.service';

import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';

class PlayerService {

  private progressionSvc: ProgressionService;

  private position: THREE.Vector3;

  private totalDistance: number = 0;

  constructor() {
    this.progressionSvc = progressionSvc;

    this.timer();
  }

  getPosition(): THREE.Vector3 { return this.position; }

  setPosition(pos: THREE.Vector3) {
    if (!this.position) this.position = new THREE.Vector3(pos.x, pos.y, pos.z);
    else this.totalDistance += Math.round(this.position.distanceTo(pos));
    this.position.copy(pos);
  }

  private timer() {
    setInterval(() => {
      this.progressionSvc.increment(PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled, this.totalDistance);
      this.totalDistance = 0;
    }, 10000);
  }

}

export const playerSvc = new PlayerService();
