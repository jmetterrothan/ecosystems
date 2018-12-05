import * as THREE from 'three';

declare module 'THREE' {

  // PointerLockControls
  export class PointerLockControls {
    isLocked: boolean;
    enabled: boolean;

    constructor(camera: THREE.Camera, domElemenTHREE?: HTMLElement);
    getObject(): THREE.Object3D;
  }

}
