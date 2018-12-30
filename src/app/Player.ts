import * as THREE from 'three';
import { BehaviorSubject } from 'rxjs';

import 'three/examples/js/controls/PointerLockControls';

import Chunk from '@world/Chunk';
import Terrain from '@world/Terrain';

class Player {
  private controls: THREE.PointerLockControls;
  private moveForward: boolean;
  private moveBackward: boolean;
  private moveLeft: boolean;
  private moveRight: boolean;
  private moveUp: boolean;
  private moveDown: boolean;

  private speed: THREE.Vector3;
  private velocity: THREE.Vector3;

  private underwater: boolean = false;
  underwaterObservable$: BehaviorSubject<boolean>;

  constructor(controls) {
    this.controls = controls;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.speed = new THREE.Vector3(40000, 40000, 40000);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.underwaterObservable$ = new BehaviorSubject(this.underwater);
  }

  get isUnderwater(): boolean {
    return this.underwater;
  }

  init(spawn: THREE.Vector3, target: THREE.Vector3 = new THREE.Vector3()) {
    const angle = -Math.cos(target.dot(spawn) / (target.length() * spawn.length()));

    this.controls.getObject().rotateY(-Math.PI / 4);
    this.controls.getObject().children[0].rotateX(angle);
    this.controls.getObject().position.set(spawn.x, spawn.y, spawn.z);
  }

  /**
   * @param {number} delta
   */
  move(delta: number) {
    // movement
    if (this.moveForward) {
      this.velocity.z = -this.speed.z;
    } else {
      if (this.velocity.z < 0) { this.velocity.z = 0; }
    }

    if (this.moveBackward) {
      this.velocity.z = this.speed.z;
    } else {
      if (this.velocity.z > 0) { this.velocity.z = 0; }
    }

    if (this.moveRight) {
      this.velocity.x = this.speed.x;
    } else {
      if (this.velocity.x > 0) { this.velocity.x = 0; }
    }

    if (this.moveLeft) {
      this.velocity.x = -this.speed.x;
    } else {
      if (this.velocity.x < 0) { this.velocity.x = 0; }
    }

    if (this.moveDown) {
      this.velocity.y = this.speed.y;
    } else {
      if (this.velocity.y > 0) { this.velocity.y = 0; }
    }

    if (this.moveUp) {
      this.velocity.y = -this.speed.y;
    } else {
      if (this.velocity.y < 0) { this.velocity.y = 0; }
    }

    this.controls.getObject().translateX(this.velocity.x * delta);
    this.controls.getObject().translateY(this.velocity.y * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);
  }

  update(terrain: Terrain, delta: number) {
    this.move(delta);

    // collision
    const position = this.controls.getObject().position;
    let y = -(Chunk.HEIGHT / 2) | 0;

    if (position.x >= 0 && position.x <= Terrain.SIZE_X && position.z >= 0 && position.z <= Terrain.SIZE_Z) {
      y = terrain.getHeightAt(position.x, position.z) + 5000;
    }

    if (position.y < y) {
      this.controls.getObject().position.y = y;
    }

    if (!this.underwater && position.y <= Chunk.SEA_LEVEL) {
      this.underwater = true;
      this.underwaterObservable$.next(true);
    }

    if (this.underwater && position.y > Chunk.SEA_LEVEL) {
      this.underwater = false;
      this.underwaterObservable$.next(false);
    }
  }

  /**
   * Handle keyboard input
   * @param {string} key
   * @param {boolean} active
   */
  handleKeyboard(key: string, active: boolean) {
    switch (key) {
      case 'ArrowUp': case 'z': this.moveForward = active; break;
      case 'ArrowDown': case 's': this.moveBackward = active; break;
      case 'ArrowLeft': case 'q': this.moveLeft = active; break;
      case 'ArrowRight': case 'd': this.moveRight = active; break;
      case '+': case 'a': this.moveUp = active; break;
      case '-': case 'e': this.moveDown = active; break;
    }
  }
}

export default Player;
