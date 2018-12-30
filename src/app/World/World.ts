import * as THREE from 'three';

import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Main from '../Main';
import Terrain from './Terrain';
import Chunk from './Chunk';
import Player from '../Player';

import { OBJECTS } from '@shared/constants/object.constants';

import MathUtils from '@utils/Math.utils';
import { MOUSE_TYPES } from '@shared/enums/mouse.enum';

class World {
  static SEED: string | null = '2915501844';

  static readonly OBJ_INITIAL_SCALE: number = 1000;

  static readonly MAX_VISIBLE_CHUNKS: number = 24;
  static readonly MAX_RENDERABLE_CHUNKS: number = 32;
  static readonly VIEW_DISTANCE: number = World.MAX_RENDERABLE_CHUNKS * Chunk.WIDTH;

  static readonly SHOW_FOG: boolean = true;
  static readonly FOG_COLOR: number = 0xb1d8ff;
  static readonly FOG_NEAR: number = World.VIEW_DISTANCE / 2;
  static readonly FOG_FAR: number = World.VIEW_DISTANCE;

  static LOADED_MODELS = new Map<string, THREE.Object3D>();

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private player: Player;

  private terrain: Terrain;
  private frustum: THREE.Frustum;
  private raycaster: THREE.Raycaster;
  private seed: string;

  private wind: THREE.Vector3;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: THREE.PointerLockControls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.frustum = new THREE.Frustum();
    this.raycaster = new THREE.Raycaster();

    this.wind = new THREE.Vector3(0, 0, -4096);

    // wind direction helper
    if (Main.DEBUG) {
      const arrowHelper = new THREE.ArrowHelper(this.wind, new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.CLOUD_LEVEL, Terrain.SIZE_Z / 2), 10000, 0xff0000);
      this.scene.add(arrowHelper);
    }
  }

  async init() {
    this.initSeed();
    this.initFog();
    this.initLights();
    await this.initObjects();

    // stuff
    this.terrain = new Terrain(this.scene);
    this.terrain.init();
    this.terrain.preload();

    const spawn = new THREE.Vector3(-24000, Terrain.SIZE_Y, Terrain.SIZE_Z + 24000);
    const target = new THREE.Vector3(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);

    this.player = new Player(this.controls);
    this.player.init(spawn, target);

    this.player.underwaterObservable$.subscribe(
      underwater => console.log(underwater)
    );

    this.scene.add(this.controls.getObject());
  }

  private initSeed() {
    this.seed = World.SEED ? World.SEED : MathUtils.randomUint32().toString();
    MathUtils.rng = new Math.seedrandom(this.seed);
    console.info(`SEED : ${this.seed}`);
  }

  private showAxesHelper() {
    const gizmo = new THREE.AxesHelper();
    gizmo.position.set(0, 0, 0);
    gizmo.scale.set(250, 250, 250);
    this.scene.add(gizmo);
  }

  private initFog() {
    if (World.SHOW_FOG) {
      this.scene.fog = new THREE.Fog(World.FOG_COLOR, World.FOG_NEAR, World.FOG_FAR);
    }
  }

  private initLights() {
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.70);
    light.position.set(0, Chunk.SEA_LEVEL, 0);
    light.castShadow = false;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.275);
    ambient.position.set(0, Chunk.HEIGHT, 15000);
    ambient.castShadow = false;
    this.scene.add(ambient);

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.275);
    sunlight.position.set(0, Chunk.HEIGHT, 15000);
    sunlight.castShadow = true;
    this.scene.add(sunlight);
  }

  /**
   * Loads all objects
   * @return {Promise<any>}
   */
  private async initObjects(): Promise<any> {
    // load all models
    const stack = OBJECTS.map(element => {
      const p = World.loadObjModel(element);

      return p.then((object) => {
        object.scale.set(World.OBJ_INITIAL_SCALE, World.OBJ_INITIAL_SCALE, World.OBJ_INITIAL_SCALE); // scale from maya size to a decent world size
      });
    });

    await Promise.all(stack);
  }

  getTerrain(): Terrain {
    return this.terrain;
  }

  /**
   * @param {number} delta
   */
  update(delta) {
    this.camera.updateMatrixWorld(true);

    this.frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );

    this.terrain.update(this.frustum, this.controls.getObject().position, delta);
    this.player.update(this.terrain, delta);
    this.handleMouseInteraction(MOUSE_TYPES.MOVE);

    /*
    if (position.y < Chunk.SEA_LEVEL) {
      // console.log('underwater');
    }
    */

    this.terrain.updateClouds(delta, this.wind);
  }

  handleMouseInteraction(interactionType: MOUSE_TYPES) {
    const pos = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const mouse = new THREE.Vector2(
      (pos.x / window.innerWidth) * 2 - 1,
      (pos.y / window.innerHeight) * -2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    this.terrain.handleMouseInteraction(this.raycaster, interactionType);
  }

  /**
   * Handle keyboard input
   * @param {string} key
   * @param {boolean} active
   */
  public handleKeyboard(key: string, active: boolean) {
    this.player.handleKeyboard(key, active);
  }

  /**
   * Load an obj file
   * @param name Name of the object
   * @param objSrc obj source file path
   * @param mtlSrc mtl source file path
   * @return Promise<any>
   */
  static async loadObjModel(element): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (World.LOADED_MODELS.has(element.name)) {
        resolve(World.LOADED_MODELS.get(element.name));
      }

      const objLoader = new THREE.OBJLoader();
      const mtlLoader = new THREE.MTLLoader();

      mtlLoader.load(element.mtl, (materials) => {
        materials.preload();

        objLoader.setMaterials(materials);

        objLoader.load(element.obj, (object) => {
          object.castShadow = true;
          object.receiveShadow = true;
          object.frustumCulled = false;

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = false;

              if (!(child.material instanceof THREE.Material)) {
                child.material.forEach(material => {
                  material.flatShading = true;
                  if (element.doubleSide === true) material.side = THREE.DoubleSide;
                });
              } else {
                child.material.flatShading = true;
                if (element.doubleSide === true) child.material.side = THREE.DoubleSide;
              }
            }
          });

          World.LOADED_MODELS.set(element.name, object);
          // const box = new THREE.Box3().setFromObject(object);
          // const size = box.getSize(new THREE.Vector3(0, 0, 0));

          resolve(object);
        }, null, () => reject());
      }, null, () => reject());
    });
  }
}

export default World;
