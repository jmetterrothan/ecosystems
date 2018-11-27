import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Terrain from './Terrain';
import Player from '../Player';
import Utils from '@shared/Utils';

import { OBJECTS } from '@shared/constants/object.constants';

class World {
  static LOADED_MODELS = new Map<string, THREE.Object3D>();

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private player: Player;

  private terrain: Terrain;
  private frustum: THREE.Frustum;
  private seed: string;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: THREE.PointerLockControls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.frustum = new THREE.Frustum();
  }

  async init() {
    this.initSeed();
    this.initFog();
    this.initLights();
    await this.initObjects();

    // stuff
    this.terrain = new Terrain(this.seed);

    // player spawn point
    const x = 0;
    const z = 0;
    const y = this.terrain.getHeightAt(x, z) + 1000;
    console.log(x, y, z);

    this.player = new Player(this.controls);
    this.player.init(x, y, z);

    this.scene.add(this.controls.getObject());

    // const object = World.LOADED_MODELS.get('spruce').clone();
    // object.position.y = this.terrain.getHeightAt(0, 0);
    // this.scene.add(object);
  }

  private initSeed() {
    this.seed = Utils.randomUint32().toString();
    Math.seedrandom(this.seed);
    console.info(`SEED : ${this.seed}`);
  }

  private showAxesHelper() {
    const gizmo = new THREE.AxesHelper();
    gizmo.position.set(0, 0, 0);
    gizmo.scale.set(100, 100, 100);
    this.scene.add(gizmo);
  }

  private initFog() {
    this.scene.fog = new THREE.Fog(0xb1d8ff, Terrain.VIEW_DISTANCE / 5, Terrain.VIEW_DISTANCE - 500);
  }

  private initLights() {
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.5);
    light.position.set(0, 1000, 0).normalize();
    this.scene.add(light);

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.40);
    sunlight.position.set(0, 10000, 10).normalize();
    sunlight.castShadow = true;
    this.scene.add(sunlight);
  }

  private async initObjects(): Promise<any> {

    // load all models
    const stack = OBJECTS.map(element => {
      const p = World.loadObjModel(element.name, element.obj, element.mtl);

      return p.then((object) => {
        object.scale.set(150, 150, 150); // scale from maya size to a decent world size
      });
    });

    await Promise.all(stack);
  }

  public update() {
    this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse)
    );

    this.terrain.update(this.scene, this.frustum, this.player);
  }

  public updateMvts(delta) {
    this.player.updateMvts(delta);
    this.player.updatePosition(this.terrain);
  }

  public handleKeyboard(key: string, active: boolean) {
    this.player.handleKeyboard(key, active);
  }

  /**
   * Load an obj file
   * @param name Name of the object
   * @param objSrc obj source file path
   * @param mtlSrc mtl source file path
   * @return THREE.Object3D
   */
  static async loadObjModel(name: string, objSrc: string, mtlSrc: string): Promise<THREE.Object3D> {
    return new Promise<THREE.Object3D>((resolve, reject) => {
      if (World.LOADED_MODELS.has(name)) {
        resolve(World.LOADED_MODELS.get(name));
      }

      const objLoader = new THREE.OBJLoader();
      const mtlLoader = new THREE.MTLLoader();

      mtlLoader.load(mtlSrc, (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);

        objLoader.load(objSrc, (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              (<THREE.Material>child.material).flatShading = true;
            }
          });

          World.LOADED_MODELS.set(name, object);
          resolve(object);
        }, null, () => reject());
      }, null, () => reject());
    });
  }
}

export default World;
