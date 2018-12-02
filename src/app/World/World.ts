import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Terrain from './Terrain';
import Player from '../Player';

import { OBJECTS } from '@shared/constants/object.constants';
import MathUtils from '@utils/Math.utils';

class World {
  static SEED = '1577115274';
  static WATER_LEVEL = 290;
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

    // WATER START
    // {
    //   const geometry = new THREE.PlaneGeometry(Chunk.WIDTH * 48, Chunk.DEPTH * 48, 128, 128);
    //   const material = new THREE.MeshPhongMaterial({
    //     wireframe: false,
    //     emissive: 0x0068b3,
    //     emissiveIntensity: 0.25,
    //     specular: 0x252525,
    //     shininess: 60,
    //     reflectivity: 0.75,
    //     flatShading: true,
    //     color: 0x0095ff,
    //     opacity: 0.5,
    //     transparent: true,
    //     side: THREE.DoubleSide
    //   });

    // const plane = new THREE.Mesh(geometry, material);
    // plane.rotateX(Utils.degToRad(90));
    // plane.position.set(-(Chunk.WIDTH * 16), World.WATER_LEVEL, -(Chunk.DEPTH * 16));

    //   this.water = plane;
    //   this.scene.add(plane);
    // }
    // WATER END (+ plane mvt bellow)

    const spawn = new THREE.Vector3(14804.494529840922, 3388.0000000062864, 66881.41188408446);

    // stuff
    this.terrain = new Terrain();
    // preload terrain
    this.terrain.update(this.scene, this.frustum, spawn);

    this.player = new Player(this.controls);
    this.player.init(spawn.x, spawn.y, spawn.z);

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
    gizmo.scale.set(100, 100, 100);
    this.scene.add(gizmo);
  }

  private initFog() {
    this.scene.fog = new THREE.Fog(0xb1d8ff, Terrain.VIEW_DISTANCE - Terrain.VIEW_DISTANCE / 4, Terrain.VIEW_DISTANCE - 500);
  }

  private initLights() {
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.25);
    light.position.set(0, 190, 0);
    light.castShadow = true;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    ambient.position.set(0, 20000, 1500);
    ambient.castShadow = true;
    this.scene.add(ambient);

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunlight.position.set(0, 20000, 1500);
    sunlight.castShadow = true;
    sunlight.target.position.set(0, 0, 0);
    this.scene.add(sunlight);

    {
      const helper = new THREE.DirectionalLightHelper(sunlight, 100);
      this.scene.add(helper);
    }
  }

  private async initObjects(): Promise<any> {
    // load all models
    const stack = OBJECTS.map(element => {
      const p = World.loadObjModel(element);

      return p.then((object) => {
        object.scale.set(200, 200, 200); // scale from maya size to a decent world size
      });
    });

    await Promise.all(stack);
  }

  public update() {
    const position = this.player.getPosition();

    this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse)
    );
    // this.water.position.set(position.x, this.water.position.y, position.z);
    this.terrain.update(this.scene, this.frustum, position);
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

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              (<THREE.Material>child.material).flatShading = true;
              if (element.doubleSide === true) {
                (<THREE.Material>child.material).side = THREE.DoubleSide;
              }
            }
          });

          World.LOADED_MODELS.set(element.name, object);
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3(0, 0, 0));

          resolve(object);
        }, null, () => reject());
      }, null, () => reject());
    });
  }
}

export default World;
