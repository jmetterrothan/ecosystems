import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';

import Utils from './Shared/Utils';
import World from './World/World';
import Terrain from './World/Terrain';

class Main {
  public readonly renderer: THREE.WebGLRenderer;
  public readonly scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;
  private containerElement: HTMLElement;

  private world: World;

  private lastTime: number;

  async bootstrap() {
    this.containerElement = document.body;
    this.lastTime = window.performance.now();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, Terrain.VIEW_DISTANCE + 250);

    this.initRenderer();
    this.initPointerLock();

    this.world = new World(this.scene, this.camera, this.controls);
  }

  private initRenderer() {
    // renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';

    this.renderer.setClearColor(0xb1d8ff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resive', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });

    this.containerElement.append(this.renderer.domElement);
  }

  private initPointerLock() {
    // view and mouvements
    this.controls = new THREE.PointerLockControls(this.camera);

    // handle pointer lock authorization
    if ('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document) {

      const pointerlockchange = (e) => {
        this.controls.enabled = document.pointerLockElement === document.body || document.mozPointerLockElement === document.body || document.webkitPointerLockElement === document.body;
      };

      const pointerlockerror = (e) => {};

      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

      document.body.addEventListener('click', () => {
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
        document.body.requestPointerLock();
      });

      window.addEventListener('keydown', e => this.world.handleKeyboard(e.key, true && this.controls.enabled));
      window.addEventListener('keyup', e => this.world.handleKeyboard(e.key, false));
    }
  }

  private render() {
    const time = window.performance.now();
    const delta = (time - this.lastTime) / 1000;

    this.lastTime = time;
    this.world.update(delta);

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }

  public run() {
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Main;
