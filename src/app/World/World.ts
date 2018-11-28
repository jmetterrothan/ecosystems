import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Terrain from './Terrain';

import Biome from './Biome/Biome';
import HillsBiome from './Biome/HillsBiome';
import FlatLandsBiome from './Biome/FlatLandsBiome';
import DesertBiome from './Biome/DesertBiome';

import Player from '../Player';
import Utils from '@shared/Utils';

import { OBJECTS } from '@shared/constants/object.constants';

class World {
  static LOADED_MODELS = new Map<string, THREE.Object3D>();
  static BIOME_LIST = new Map<string, Biome>();

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

    const spawn = new THREE.Vector3(0, 0, 0);

    // stuff
    this.terrain = new Terrain();
    // preload terrain
    this.terrain.update(this.scene, this.frustum, spawn);

    this.player = new Player(this.controls);
    const y = this.terrain.getHeightAt(spawn.x, spawn.z) + 1000;
    this.player.init(spawn.x, y, spawn.z);

    this.scene.add(this.controls.getObject());

    // const object = World.LOADED_MODELS.get('spruce').clone();
    // object.position.y = this.terrain.getHeightAt(0, 0);
    // this.scene.add(object);
  }

  private initSeed() {
    // 1603676994 | 2927331962
    this.seed = Utils.randomUint32().toString();
    Utils.rng = new Math.seedrandom(this.seed);
    console.info(`SEED : ${this.seed}`);
  }

  private showAxesHelper() {
    const gizmo = new THREE.AxesHelper();
    gizmo.position.set(0, 0, 0);
    gizmo.scale.set(100, 100, 100);
    this.scene.add(gizmo);
  }

  private initFog() {
    this.scene.fog = new THREE.Fog(0xb1d8ff, Terrain.VIEW_DISTANCE / 2, Terrain.VIEW_DISTANCE - 500);
  }

  private initLights() {
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.25);
    light.position.set(0, 10000, 0).normalize();
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    ambient.position.set(0, 10000, 500).normalize();
    this.scene.add(ambient);

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunlight.position.set(0, 10000, 500).normalize();
    sunlight.castShadow = true;
    sunlight.target.position.set(0, 0, 0);

    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 5000;
    sunlight.shadow.camera.left = -500;
    sunlight.shadow.camera.bottom = -500;
    sunlight.shadow.camera.right = 500;
    sunlight.shadow.camera.top = 500;
    this.scene.add(sunlight);
  }

  private async initObjects(): Promise<any> {
    // load all models
    const stack = OBJECTS.map(element => {
      const p = World.loadObjModel(element.name, element.obj, element.mtl);

      return p.then((object) => {
        object.scale.set(100, 100, 100); // scale from maya size to a decent world size
      });
    });

    await Promise.all(stack);
  }

  public update() {
    this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse)
    );

    this.terrain.update(this.scene, this.frustum, this.player.getPosition());
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
          object.castShadow = true;
          object.receiveShadow = true;

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              (<THREE.Material>child.material).flatShading = true;
            }
          });

          World.LOADED_MODELS.set(name, object);
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3(0, 0, 0));

          resolve(object);
        }, null, () => reject());
      }, null, () => reject());
    });
  }

  static getBiome(name: string): Biome {
    if (World.BIOME_LIST.has(name)) {
      return World.BIOME_LIST.get(name);
    }

    let biome = null;
    switch (name) {
      case 'hills':
        biome = new HillsBiome();
        break;

      case 'desert':
        biome = new DesertBiome();
        break;

      default:
        biome = new FlatLandsBiome();
    }

    World.BIOME_LIST.set(name, biome);
    return biome;
  }
}

export default World;
