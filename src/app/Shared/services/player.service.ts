import * as THREE from 'three';

class PlayerService {

  position: THREE.Vector3;

  getPosition(): THREE.Vector3 { return this.position; }

  setPosition(position: THREE.Vector3) { this.position = position; }

}

export const playerSvc = new PlayerService();
