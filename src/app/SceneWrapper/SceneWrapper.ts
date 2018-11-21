import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';

class SceneWrapper {

  private static alreadyInitialized: boolean = false;

  private width: number;
  private height: number;

  // HTMLElements
  private containerElement: HTMLElement = document.body;

  // render
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true
  });
  private chronoId: number;

  private scene: THREE.Scene = new THREE.Scene();

  // camera
  private fov: number = 45;
  private aspect: number;
  camera: THREE.PerspectiveCamera;
  orbitControls: THREE.OrbitControls;

  // lights
  lights: THREE.Light[] = [];

  constructor() {
    if (SceneWrapper.alreadyInitialized) {
      throw 'Scene wrapper already exists. You can have only one scene.';
    }
    SceneWrapper.alreadyInitialized = true;
  }

  init(): Promise<THREE.Scene> {
    return new Promise((resolve: Function) => {
      this.initScene();
      this.initCamera();
      this.initLights();
      this.renderLights();
      this.animate();
      this.bindEvents();

      resolve(this.scene);
    });
  }

  animate() {
    this.chronoId = window.requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  stop() {
    window.cancelAnimationFrame(this.chronoId);
  }

  private initScene() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.containerElement.append(this.renderer.domElement);
  }

  private initCamera() {
    this.aspect = this.width / this.height;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, 0.01, 1000);

    this.camera.position.set(0, 96, 48);

    this.orbitControls = new THREE.OrbitControls(this.camera);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.update();
  }

  private initLights() {
    this.lights.push(new THREE.DirectionalLight(0xffffff, 0.85));
  }

  private renderLights() {
    this.lights.forEach((light: THREE.Light) => this.scene.add(light));
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.orbitControls.update();

    this.renderer.setSize(this.width, this.height);
  }

  private bindEvents() {
    window.addEventListener('resize', () => this.resize(), false);
  }

}

export default SceneWrapper;
