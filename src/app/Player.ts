import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';

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

  constructor(controls) {
    this.controls = controls;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.speed = new THREE.Vector3(5000, 5000, 5000);
    this.velocity = new THREE.Vector3(0, 0, 0);

    window.player = this.controls.getObject();
  }

  init(x, y, z) {
    this.controls.getObject().position.set(x, y, z);
  }

  public updateMvts(delta) {
    if (this.moveForward) {
      this.velocity.z = -this.speed.z;
    } else {
      if (this.velocity.z < 0) {
        this.velocity.z = 0;
      }
    }

    if (this.moveBackward) {
      this.velocity.z = this.speed.z;
    } else {
      if (this.velocity.z > 0) {
        this.velocity.z = 0;
      }
    }

    if (this.moveRight) {
      this.velocity.x = this.speed.x;
    } else {
      if (this.velocity.x > 0) {
        this.velocity.x = 0;
      }
    }

    if (this.moveLeft) {
      this.velocity.x = -this.speed.x;
    } else {
      if (this.velocity.x < 0) {
        this.velocity.x = 0;
      }
    }

    if (this.moveDown) {
      this.velocity.y = this.speed.y;
    } else {
      if (this.velocity.y > 0) {
        this.velocity.y = 0;
      }
    }

    if (this.moveUp) {
      this.velocity.y = -this.speed.y;
    } else {
      if (this.velocity.y < 0) {
        this.velocity.y = 0;
      }
    }

    this.controls.getObject().translateX(this.velocity.x * delta);
    this.controls.getObject().translateY(this.velocity.y * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);
  }

  updatePosition(terrain) {
    const position = this.controls.getObject().position;
    const y = terrain.getHeightAt(position.x, position.z) + 100;

    if (position.y < y) {
      this.controls.getObject().position.y = y;
    }
  }

  public handleKeyboard(key: string, active: boolean) {
    switch (key) {
      case 'ArrowUp': case 'z': this.moveForward = active; break;
      case 'ArrowDown': case 's': this.moveBackward = active; break;
      case 'ArrowLeft': case 'q': this.moveLeft = active; break;
      case 'ArrowRight': case 'd': this.moveRight = active; break;
      case '+': case 'a': this.moveUp = active; break;
      case '-': case 'e': this.moveDown = active; break;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.controls.getObject().position.clone();
  }
}

export default Player;
