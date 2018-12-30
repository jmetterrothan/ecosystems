import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/MaskPass';
import 'three/examples/js/postprocessing/ShaderPass';

import 'seedrandom';

import statsJs from 'stats.js';
import World from '@world/World';
import Crosshair from './UI/Crosshair';

import { MOUSE_TYPES } from '@shared/enums/mouse.enum';

class Main {
  public static readonly DEBUG: boolean = true;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private composer: THREE.EffectComposer;
  private renderPass: THREE.RenderPass;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;
  private containerElement: HTMLElement;

  private world: World;

  private lastTime: number;

  private stats: statsJs;

  private crosshair: Crosshair;

  constructor() {
    this.containerElement = document.body;
    this.lastTime = window.performance.now();

    this.stats = new statsJs();
    this.stats.showPanel(1);
    document.body.appendChild(this.stats.dom);

    this.scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, World.VIEW_DISTANCE);

    // this.scene.add(new THREE.CameraHelper(this.camera));
  }

  async init() {
    this.initControls();

    this.world = new World(this.scene, this.camera, this.controls);
    await this.world.init();

    this.initPointerLock();
    this.initRenderer();
    this.initPostProcessing();
  }

  private initControls() {
    this.controls = new THREE.PointerLockControls(this.camera);

    this.crosshair = new Crosshair();
  }

  private initRenderer() {
    // renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true });
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';

    this.renderer.setClearColor(new THREE.Color(World.FOG_COLOR));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      const size = this.renderer.getSize();
      this.composer.setSize(size.width * 2 * window.devicePixelRatio, size.height * 2 * window.devicePixelRatio);
    });

    this.containerElement.append(this.renderer.domElement);

    /*
    const pass = new THREE.RenderPass(this.scene, this.camera);
    // pass.renderToScreen = true;
    this.composer.addPass(pass);

    this.effect = new THREE.ShaderPass(THREE.VergilWaterShader);
    this.effect.uniforms['centerX'].value = 0.8;
    this.effect.uniforms['centerY'].value = 0.8;
    this.composer.addPass(this.effect);

    this.effect2 = new THREE.ShaderPass(THREE.VergilWaterShader);
    this.effect2.uniforms['centerX'].value = 0.2;
    this.effect2.uniforms['centerY'].value = 0.2;
    this.composer.addPass(this.effect2);

    this.effect3 = new THREE.ShaderPass(THREE.VergilWaterShader);
    this.effect3.uniforms['centerX'].value = 0.2;
    this.effect3.uniforms['centerY'].value = 0.8;
    this.composer.addPass(this.effect3);

    this.effect4 = new THREE.ShaderPass(THREE.VergilWaterShader);
    this.effect4.uniforms['centerX'].value = 0.8;
    this.effect4.uniforms['centerY'].value = 0.2;
    this.effect4.renderToScreen = true;
    this.composer.addPass(this.effect4);
    */
  }

  private initPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);
    const size = this.renderer.getSize();
    this.composer.setSize(size.width * 2 * window.devicePixelRatio, size.height * 2 * window.devicePixelRatio);

    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

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
    }
  }

  private render() {
    this.stats.begin();

    const time = window.performance.now();
    const elapsed = time - this.lastTime;
    this.lastTime = time;

    const delta = elapsed / 1000;

    // updated every time
    this.world.update(delta);

    /*
    this.effect.uniforms['time'].value += Math.random();
    this.effect2.uniforms['time'].value += Math.random();
    this.effect3.uniforms['time'].value += Math.random();
    this.effect4.uniforms['time'].value += Math.random();
    */

    this.renderer.render(this.scene, this.getActiveCamera());
    TWEEN.update();
    // this.composer.render(delta);
    this.stats.end();

    window.requestAnimationFrame(this.render.bind(this));
  }

  getActiveCamera() {
    return this.camera;
  }

  public run() {
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default Main;
