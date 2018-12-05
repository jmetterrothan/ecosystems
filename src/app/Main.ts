import * as THREE from 'three';

import 'three/examples/js/controls/PointerLockControls';
import 'seedrandom';

import statsJs from 'stats.js';
import World from '@world/World';

class Main {
  public static readonly MS_PER_UPDATE = 1000 / 25;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;
  private containerElement: HTMLElement;

  private world: World;

  private lag: number;
  private ups: number;
  private lastTime: number;
  private scheduledTime: number;

  private stats: statsJs;

  constructor() {
    this.containerElement = document.body;
    this.lag = 0;
    this.ups = 0;
    this.scheduledTime = window.performance.now();
    this.lastTime = window.performance.now();

    this.stats = new statsJs();
    this.stats.showPanel(1);
    document.body.appendChild(this.stats.dom);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, World.VIEW_DISTANCE);
  }

  async init() {
    this.initControls();
    this.initRenderer();
    this.initPointerLock();

    this.world = new World(this.scene, this.camera, this.controls);
    await this.world.init();
  }

  private initControls() {
    this.controls = new THREE.PointerLockControls(this.camera);
  }

  private initRenderer() {
    // renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';

    this.renderer.setClearColor(new THREE.Color(0xb1d8ff));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });

    this.containerElement.append(this.renderer.domElement);
  }

  private initPointerLock() {
    // handle pointer lock authorization
    if ('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document) {

      const pointerlockchange = (e) => {
        this.controls.enabled = document.pointerLockElement === document.body || document.mozPointerLockElement === document.body || document.webkitPointerLockElement === document.body;
      };

      const pointerlockerror = (e) => { };

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

      document.body.addEventListener('keydown', e => this.world.handleKeyboard(e.key, true && this.controls.enabled));
      document.body.addEventListener('keyup', e => this.world.handleKeyboard(e.key, false));
    }
  }

  private render() {
    this.stats.begin();

    const time = window.performance.now();
    const elapsed = time - this.lastTime;

    if (time >= this.scheduledTime) {
      this.scheduledTime += 1000;

      // console.info(`UPS : ${this.ups}`);
      this.ups = 0;
    }

    this.lastTime = time;
    this.lag += elapsed;

    // updated every time
    this.world.updateMvts(elapsed / 1000);

    // updated every 16ms
    let nbOfSteps = 0;
    while (this.lag >= Main.MS_PER_UPDATE) {
      this.world.update();
      this.ups++;

      this.lag -= Main.MS_PER_UPDATE;

      if (++nbOfSteps >= 240) {
        this.lag = 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    window.requestAnimationFrame(this.render.bind(this));
  }

  public run() {
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Main;
