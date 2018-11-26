import * as t from 'three';

declare module 'THREE' {

  // PointerLockControls
  export class PointerLockControls {
    constructor(camera: t.Camera);
    enabled: boolean;
  }

}
