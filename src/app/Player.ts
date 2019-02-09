import * as THREE from 'three';
import * as tf from '@tensorflow/tfjs';

import 'three/examples/js/controls/PointerLockControls';

import Chunk from '@world/Chunk';
import PointerLock from '@app/PointerLock';
import Terrain from '@world/Terrain';
import Voice from '@voice/Voice';

import { multiplayerSvc } from '@online/services/multiplayer.service';
import { playerSvc } from '@shared/services/player.service';
import { configSvc } from '@shared/services/config.service';

import { KeyAction, Keys } from '@shared/constants/keys.constants';

class Player {
  private controls: THREE.PointerLockControls;
  private moveForward: boolean;
  private moveBackward: boolean;
  private moveLeft: boolean;
  private moveRight: boolean;
  private moveUp: boolean;
  private moveDown: boolean;

  private voice: Voice;

  private speed: THREE.Vector3;
  private velocity: THREE.Vector3;

  private voiceModel: Model;

  private voice: any;

  /**
   * Player constructor
   * @param {THREE.PointerLockControls} controls
   */
  constructor(controls: THREE.PointerLockControls) {
    this.controls = controls;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.speed = new THREE.Vector3(40000, 40000, 40000);
    this.velocity = new THREE.Vector3(0, 0, 0);

    PointerLock.addEventListener('pointerlockchange', () => {
      if (!PointerLock.enabled) {
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
      }
    });
  }

  /**
   * Player init
   * @param {THREE.Vector3} spawn Spawn location
   * @param {THREE.Vector3} target Target used to calculate player orientation
   */
  async init(spawn: THREE.Vector3, target: THREE.Vector3 = new THREE.Vector3()) {
    const angle = -Math.cos(target.dot(spawn) / (target.length() * spawn.length()));

    this.controls.getObject().rotateY(-Math.PI / 4);
    this.controls.getObject().children[0].rotateX(angle);
    this.position = spawn;

    playerSvc.setPosition(spawn);

    await this.initVoice();
  }

  private async initVoice() {
    const voiceModel = await tf.loadModel('https://ecosystem-server.herokuapp.com/voicemodel.json');

    this.voice = new Voice(voiceModel);
  }

  /**
   * @param {number} delta
   */
  move(delta: number): THREE.Vector3 {
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

    if (this.moveUp) {
      this.velocity.y = this.speed.y;
    } else {
      if (this.velocity.y > 0) { this.velocity.y = 0; }
    }

    if (this.moveDown) {
      this.velocity.y = -this.speed.y;
    } else {
      if (this.velocity.y < 0) { this.velocity.y = 0; }
    }

    this.translateX(this.velocity.x * delta);
    this.translateY(this.velocity.y * delta);
    this.translateZ(this.velocity.z * delta);

    return this.position;
  }

  /**
   * Update player movements
   * @param {Terrain} terrain
   * @param {number} delta
   */
  update(terrain: Terrain, delta: number) {
    const position = this.move(delta);
    playerSvc.setPosition(position);

    if (multiplayerSvc.isUsed()) {
      multiplayerSvc.sendPosition(position);
      multiplayerSvc.checkStatus();
    }

    const yMin = terrain.getHeightAt(position.x, position.z) + 5000;

    if (playerSvc.isWithinWorldBorders() && position.y < yMin) {
      // collision with min ground dist
      this.positionY = yMin;
    }
  }

  /**
   * Handle keyboard input
   * @param {string} key
   * @param {boolean} active
   */
  handleKeyboard(key: string, active: boolean) {
    switch (key.toUpperCase()) {
      case Keys[KeyAction.MOVE_FRONT]:
        this.moveForward = active; break;

      case Keys[KeyAction.MOVE_BACK]:
        this.moveBackward = active; break;

      case Keys[KeyAction.MOVE_LEFT]:
        this.moveLeft = active; break;

      case Keys[KeyAction.MOVE_RIGHT]:
        this.moveRight = active; break;

      case Keys[KeyAction.MOVE_UP]:
        this.moveUp = active; break;

      case Keys[KeyAction.MOVE_DOWN]:
        this.moveDown = active; break;

      case Keys[KeyAction.VOCAL]: if (active) this.voice.togglePredictState(); break;
      case Keys[KeyAction.MUTE]: if (active) configSvc.soundEnabled = !configSvc.soundEnabled; break;
    }
  }

  get position(): THREE.Vector3 {
    return this.controls.getObject().position;
  }

  set position(v: THREE.Vector3) {
    this.controls.getObject().position.x = v.x;
    this.controls.getObject().position.y = v.y;
    this.controls.getObject().position.z = v.z;
  }

  set positionX(x) {
    this.controls.getObject().position.x = x;
  }

  set positionY(y) {
    this.controls.getObject().position.y = y;
  }

  set positionZ(z) {
    this.controls.getObject().position.z = z;
  }

  translateX(tx) {
    this.controls.getObject().translateX(tx);
  }
  translateY(ty) {
    this.controls.getObject().translateY(ty);
  }
  translateZ(tz) {
    this.controls.getObject().translateZ(tz);
  }
}

export default Player;
