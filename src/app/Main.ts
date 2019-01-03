import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import 'three/examples/js/controls/PointerLockControls';

import 'seedrandom';

import statsJs from 'stats.js';
import World from '@world/World';
import Crosshair from './UI/Crosshair';
import PostProcess from './PostProcess';
import CommonUtils from '@shared/utils/Common.utils';

import { underwaterSvc } from '@services/underwater.service';

import { MOUSE_TYPES } from '@shared/enums/mouse.enum';

class Main {
  public static readonly DEBUG: boolean = CommonUtils.isDev();

  private renderer: THREE.WebGLRenderer;
  private postProcess: PostProcess;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private containerElement: HTMLElement;

  private world: World;

  private lastTime: number;
  private focused: boolean;
  private stats: statsJs;

  constructor() {
    this.containerElement = document.body;
    this.lastTime = window.performance.now();

    if (Main.DEBUG) {
      this.stats = new statsJs();
      this.stats.showPanel(1);
      document.body.appendChild(this.stats.dom);
    }

    this.scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, World.VIEW_DISTANCE);

    this.focused = true;
  }

  async init() {
    this.initControls();

    this.world = new World(this.scene, this.camera, this.controls);
    await this.world.init();

    this.initPointerLock();
    this.initRenderer();

    this.postProcess = new PostProcess(this.scene, this.renderer, this.camera);
    this.postProcess.init();
  }

  private initControls() {
    this.controls = new THREE.PointerLockControls(this.camera);

    new Crosshair();
  }

  private initRenderer() {
    // renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true });
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setClearColor(new THREE.Color(World.FOG_COLOR));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.postProcess.resize(w, h);
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

        if (!this.controls.enabled) { return; }

        // mouse position always in the center of the screen
        this.world.handleMouseInteraction(MOUSE_TYPES.CLICK);
      });

      document.body.addEventListener('keydown', e => this.world.handleKeyboard(e.key, true && this.controls.enabled));
      document.body.addEventListener('keyup', e => this.world.handleKeyboard(e.key, false));

      window.addEventListener('blur', () => { this.focused = false; });
      window.addEventListener('focus', () => { this.focused = true; });
    }
  }

  private render() {
    if (Main.DEBUG) this.stats.begin();

    const time = window.performance.now();
    const elapsed = time - this.lastTime;
    const delta = elapsed / 1000;
    const tick = time / 1000;
    this.lastTime = time;

    // update
    if (this.focused) {
      this.world.update(delta, tick);

      if (underwaterSvc.isUnderwater) {
        this.postProcess.update(tick);
      }

      TWEEN.update();
    }

    // switch render func if underwater
    if (underwaterSvc.isUnderwater) {
      this.postProcess.render(delta);
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    if (Main.DEBUG) this.stats.end();

    window.requestAnimationFrame(this.render.bind(this));
  }

  public run() {
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Main;
