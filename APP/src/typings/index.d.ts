interface Document {
  pointerLockElement?: any;
  mozPointerLockElement?: any;
  webkitPointerLockElement?: any;
}

interface HTMLElement {
  requestPointerLock?: any;
  mozRequestPointerLock?: any;
  webkitRequestPointerLock?: any;
}

interface Math {
  seedrandom(seed?: string): void;
}
