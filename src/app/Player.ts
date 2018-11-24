import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';

class Player
{
  private controls: THREE.PointerLockControls;
  private moveForward: bool;
  private moveBackward: bool;
  private moveLeft: bool;
  private moveRight: bool;
  private moveUp: bool;
  private moveDown: bool;

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

    this.speed = new THREE.Vector3(10000, 5000, 10000);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.controls.getObject().position.set(0, 0, -5);
  }

  public update(delta) {
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.y -= this.velocity.y * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    if (this.moveForward) this.velocity.z -= this.speed.x * delta;
    if (this.moveBackward) this.velocity.z += this.speed.x * delta;
    if (this.moveUp) this.velocity.y -= this.speed.y * delta;
    if (this.moveDown) this.velocity.y += this.speed.y * delta;
    if (this.moveLeft) this.velocity.x -= this.speed.x * delta;
    if (this.moveRight) this.velocity.x += this.speed.x * delta;

    this.controls.getObject().translateX(this.velocity.x * delta);
    this.controls.getObject().translateY(this.velocity.y * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);
  }

  public handleKeyboard(key : string, active : bool) {
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
