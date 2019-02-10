class PointerLock {
  static request() {
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
  }

  static exit() {
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    document.exitPointerLock();
  }

  static get enabled(): boolean {
    return PointerLock.element === document.body;
  }

  static get element(): HTMLElement {
    return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
  }

  static get available(): boolean {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  }

  static addEventListener(name: string, callback: EventListenerOrEventListenerObject, b: boolean = false) {
    if (name === 'pointerlockchange') {
      document.addEventListener('pointerlockchange', callback, b);
      document.addEventListener('mozpointerlockchange', callback, b);
      document.addEventListener('webkitpointerlockchange', callback, b);
    } else if (name === 'pointerlockerror') {
      document.addEventListener('pointerlockerror', callback, b);
      document.addEventListener('mozpointerlockerror', callback, b);
      document.addEventListener('webkitpointerlockerror', callback, b);
    }
  }
}

export default PointerLock;
