import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Terrain from './Terrain';
import Chunk from './Chunk';
import Player from '../Player';

import { OBJECTS } from '@shared/constants/object.constants';

import MathUtils from '@utils/Math.utils';

class World {
  static SEED: string | null = null; // '789005037'

  static readonly OBJ_INITIAL_SCALE: number = 360;

  static readonly VIEW_DISTANCE: number = 32 * Chunk.WIDTH;

  static readonly SHOW_FOG: boolean = true;
  static readonly FOG_COLOR: number = 0xb1d8ff;
  static readonly FOG_NEAR: number = World.VIEW_DISTANCE / 4;
  static readonly FOG_FAR: number = World.VIEW_DISTANCE;

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
    this.initSkybox();
    this.initLights();
    await this.initObjects();

    const spawn = new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.HEIGHT / 2, Terrain.SIZE_Z / 2);

    // stuff
    this.terrain = new Terrain(this.scene);
    this.terrain.init();
    this.terrain.preload();

    this.player = new Player(this.controls);
    this.player.init(spawn.x, spawn.y, spawn.z);

    this.scene.add(this.controls.getObject());

    this.showAxesHelper();
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

  private initSkybox() {

  }

  private initLights() {
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.75);
    light.position.set(0, Chunk.SEA_LEVEL, 0);
    light.castShadow = false;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.275);
    ambient.position.set(0, Chunk.HEIGHT, 1500);
    ambient.castShadow = false;
    this.scene.add(ambient);

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.325);
    sunlight.position.set(0, Chunk.HEIGHT, 1500);
    sunlight.castShadow = true;
    this.scene.add(sunlight);

  }

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

  public update(delta) {
    this.frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );
    const position = this.player.getPosition();
    this.terrain.update(this.frustum, position);

    if (position.y < Chunk.SEA_LEVEL) {
      // console.log('underwater');
    }
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
  static async loadObjModel(element): Promise<THREE.Object3D> {
    return new Promise<THREE.Object3D>((resolve, reject) => {
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
              (<THREE.Geometry>child.geometry).computeFaceNormals();
              child.geometry.computeVertexNormals();
              child.geometry.computeBoundingBox();
              child.geometry.computeBoundingSphere();
              (<THREE.Geometry>child.geometry).normalsNeedUpdate = true;
              (<THREE.Material>child.material).flatShading = true;
              if (element.doubleSide === true) {
                (<THREE.Material>child.material).side = THREE.DoubleSide;
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
