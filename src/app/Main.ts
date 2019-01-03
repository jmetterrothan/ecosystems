import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/MaskPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/shaders/VignetteShader';
import 'three/examples/js/shaders/ColorCorrectionShader';

import 'seedrandom';

import statsJs from 'stats.js';
import World from '@world/World';
import Crosshair from './UI/Crosshair';

import { underwaterSvc } from '@services/underwater.service';

import { MOUSE_TYPES } from '@shared/enums/mouse.enum';
import CommonUtils from '@shared/utils/Common.utils';

import waterVertexGlsl from '@shaders/water.vertex.glsl';
import waterFragmentGlsl from '@shaders/water.fragment.glsl';

class Main {
  public static readonly DEBUG: boolean = CommonUtils.isDev();

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private composer: THREE.EffectComposer;
  private renderPass: THREE.RenderPass;
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

    this.stats = new statsJs();
    this.stats.showPanel(1);
    document.body.appendChild(this.stats.dom);

    this.scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, World.VIEW_DISTANCE);

    this.focused = true;

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
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.composer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    });

    this.containerElement.append(this.renderer.domElement);
  }

  private initPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    THREE.VergilWaterShader = {
      uniforms: {
        tDiffuse: { type: 't', value: null },
        time:     { type: 'f', value: 0.0 },
        distort_speed: { type: 'f', value: 0.0004 },
        distortion:   { type: 'f', value: 0.075 },
        centerX: { type: 'f', value: 0.5 },
        centerY: { type: 'f', value: 0.5 },
      },
      vertexShader: waterVertexGlsl,
      fragmentShader: waterFragmentGlsl
    };

    const pass = new THREE.RenderPass(this.scene, this.camera);
    // pass.renderToScreen = true;
    this.composer.addPass(pass);

    this.effect = new THREE.ShaderPass(THREE.VignetteShader);
    this.effect.uniforms.darkness.value = 2.25;
    this.composer.addPass(this.effect);

    this.effect5 = new THREE.ShaderPass(THREE.ColorCorrectionShader);
    this.effect5.uniforms.addRGB.value.y = 0.025;
    this.effect5.uniforms.addRGB.value.z = 0.10;
    this.effect5.uniforms.powRGB.value.y = 1.5;
    this.effect5.uniforms.powRGB.value.z = 0.80;
    this.composer.addPass(this.effect5);

    this.effect1 = new THREE.ShaderPass(THREE.VergilWaterShader);
    this.effect1.uniforms['centerX'].value = 0.8;
    this.effect1.uniforms['centerY'].value = 0.8;
    this.composer.addPass(this.effect1);

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
    this.stats.begin();

    const time = window.performance.now();
    const elapsed = time - this.lastTime;
    this.lastTime = time;

    const delta = elapsed / 1000;

    if (this.focused) {
      // updated every time
      this.world.update(delta, time / 1000);

      /*
      this.effect.enabled = underwaterSvc.isUnderwater;

      this.effect1.uniforms['enabled'].value = underwaterSvc.isUnderwater;
      this.effect2.uniforms['enabled'].value = underwaterSvc.isUnderwater;
      this.effect3.uniforms['enabled'].value = underwaterSvc.isUnderwater;
      this.effect4.uniforms['enabled'].value = underwaterSvc.isUnderwater;
      */

      if (underwaterSvc.isUnderwater) {
        this.effect1.uniforms['time'].value += Math.random();
        this.effect2.uniforms['time'].value += Math.random();
        this.effect3.uniforms['time'].value += Math.random();
        this.effect4.uniforms['time'].value += Math.random();

        this.composer.render(delta);
      } else {
        this.renderer.render(this.scene, this.getActiveCamera());
      }

      TWEEN.update();
    }

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
