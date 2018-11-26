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
  private position: THREE.Vector3;

  constructor(controls) {
    this.controls = controls;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.speed = new THREE.Vector3(2000, 1000, 2000);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.controls.getObject().position.set(0, 0, -5);
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

  public handleKeyboard(key: string, active: boolean) {
    switch (key) {
      case 'z': this.moveForward = active; break;
      case 's': this.moveBackward = active; break;
      case 'q': this.moveLeft = active; break;
      case 'd': this.moveRight = active; break;
      case 'a': this.moveUp = active; break;
      case 'e': this.moveDown = active; break;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.controls.getObject().position.clone();
  }
}

export default Player;
