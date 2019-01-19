import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import statsJs from 'stats.js';
import 'three/examples/js/controls/PointerLockControls';
import 'seedrandom';

import World from '@world/World';
import Crosshair from '@ui/Crosshair';
import PostProcess from '@app/PostProcess';

import { configSvc } from '@app/shared/services/config.service';
import PlayerService, { playerSvc } from '@shared/services/player.service';
import MultiplayerService, { multiplayerSvc } from '@online/services/multiplayer.service';
import StorageService, { storageSvc } from '@shared/services/storage.service';
import CoreService, { coreSvc } from '@shared/services/core.service';
import UIService, { uiSvc } from '@ui/services/ui.service';

import { MOUSE_TYPES } from '@shared/enums/mouse.enum';
import { UI_STATES } from '@ui/enums/UIStates.enum';
import UIManager from '@ui/UIManager';

class Main {
  private renderer: THREE.WebGLRenderer;
  private postProcess: PostProcess;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private world: World;

  private containerElement: HTMLElement;

  private lastTime: number;
  private focused: boolean;
  private stats: statsJs;

  private coreSvc: CoreService;
  private playerSvc: PlayerService;
  private multiplayerSvc: MultiplayerService;
  private storageSvc: StorageService;
  private uiSvc: UIService;

  private uiManager: UIManager;

  constructor() {
    this.containerElement = document.body;
    this.lastTime = window.performance.now();

    this.coreSvc = coreSvc;
    this.playerSvc = playerSvc;
    this.multiplayerSvc = multiplayerSvc;
    this.storageSvc = storageSvc;
    this.uiSvc = uiSvc;

    if (configSvc.debug) {
      this.stats = new statsJs();
      this.stats.showPanel(1);
      // document.body.appendChild(this.stats.dom);

      /*
      // reset
      const resetStrorage = document.createElement('button');
      resetStrorage.textContent = 'reset';
      resetStrorage.classList.add('button', 'reset');
      resetStrorage.addEventListener('click', () => {
        this.storageSvc.clearAll();
      }, false);
      document.body.appendChild(resetStrorage);
      */
    }

    // if (!UIManager.ENABLED) {
    // this.uiSvc.switchState(UI_STATES.GAME);
    // document.body.requestPointerLock();
    // }

    this.scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 32 * 8 * 2048;

    this.camera = new THREE.PerspectiveCamera(50, aspect, near, far);

    this.focused = true;
  }

  async init(uiManager: UIManager) {
    this.uiManager = uiManager;
    this.initControls();

    this.world = new World(this.scene, this.camera, this.controls);

    await this.coreSvc.init();

    this.initPointerLock();
    this.initRenderer();

    this.postProcess = new PostProcess(this.scene, this.renderer, this.camera);
    this.postProcess.init();

    if (configSvc.debug) {
      /*
      // socket
      // create room
      const createRoom = document.createElement('button');
      createRoom.textContent = 'create room';
      createRoom.classList.add('button', 'create');
      createRoom.addEventListener('click', (ev) => {
        (<HTMLElement>ev.target).style.display = 'none';
        const seed = this.world.getSeed();
        this.multiplayerSvc.init(this.scene, 'seed');
      }, false);
      document.body.appendChild(createRoom);

      // join room
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'inputSeed';
      input.placeholder = 'room';
      input.classList.add('input', 'join');
      document.body.appendChild(input);

      const join = document.createElement('button');
      join.textContent = 'Join room';
      join.classList.add('button', 'join');
      join.addEventListener('click', ev => {
        (<HTMLElement>ev.target).style.display = 'none';
        const seed = input.value;
        this.multiplayerSvc.init(this.scene, seed);
      }, false);
      document.body.appendChild(join);
      */
    }
  }

  async load(seed: string): Promise<string> {
    return await this.world.init(seed);
  }

  private initControls() {
    this.controls = new THREE.PointerLockControls(this.camera);

    new Crosshair();
  }

  private initRenderer() {
    // renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: configSvc.config.ENABLE_AA, logarithmicDepthBuffer: true, alpha: true });
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';
    this.renderer.domElement.style.zIndex = '-1';

    this.renderer.shadowMap.enabled = configSvc.config.ENABLE_SHADOWS;
    this.renderer.shadowMap.type = configSvc.config.SHADOW_MAP_TYPE;

    this.renderer.setClearColor(new THREE.Color(0x000000));
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

        if (!this.uiSvc.isState(UI_STATES.GAME)) return;

        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
        document.body.requestPointerLock();

        if (!this.controls.enabled || !this.world.isInitialized()) { return; }

        // mouse position always in the center of the screen
        this.world.handleMouseInteraction(MOUSE_TYPES.CLICK);
      });

      document.body.addEventListener('keydown', e => {
        if (this.world.isInitialized()) {
          this.world.handleKeyboard(e.key, true && this.controls.enabled);
          this.uiManager.handleKeyboard(e.key);
        }
      });
      document.body.addEventListener('keyup', e => {
        if (this.world.isInitialized()) {
          this.world.handleKeyboard(e.key, false);
        }
      });

      window.addEventListener('blur', () => { this.focused = false; });
      window.addEventListener('focus', () => { this.focused = true; });
    }
  }

  private render() {
    if (configSvc.debug) this.stats.begin();

    const time = window.performance.now();
    const elapsed = time - this.lastTime;
    const delta = elapsed / 1000;
    this.lastTime = time;

    // update
    if (this.world.isInitialized()) {
      this.world.update(delta);

      if (this.playerSvc.isUnderwater()) {
        this.postProcess.update();
      }

      const color: THREE.Color = this.world.getWeather().getFogColor();
      this.renderer.setClearColor(color);
      this.scene.fog.color.set(color);
      TWEEN.update();

      // switch render func if underwater
      if (this.playerSvc.isUnderwater()) {
        this.postProcess.render(delta);
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    }

    if (configSvc.debug) this.stats.end();

    window.requestAnimationFrame(this.render.bind(this));
  }

  public run() {
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Main;
