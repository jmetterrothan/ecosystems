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

interface Window {
  player: THREE.Object3D;
}

interface Math {
  seedrandom(seed?: string): void;
}


interface Math {
  seedrandom(): void;
}

