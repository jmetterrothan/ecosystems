import * as THREE from 'three';

import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Main from '../Main';
import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import Player from '../Player';
import BiomeGenerator from '@world/BiomeGenerator';
import Weather from '@world/Weather';
import MathUtils from '@utils/Math.utils';

import { OBJECTS } from '@shared/constants/object.constants';
import { TEXTURES } from '@shared/constants/texture.constants';
import { MOUSE_TYPES } from '@shared/enums/mouse.enum';
import { ITexture } from '@shared/models/texture.model';

class World {
  static readonly SEED: string | null = null;
  static readonly BIOME: Biome | null = null; // lock a specific biome here, if null a biome is selected randomly

  static readonly OBJ_INITIAL_SCALE: number = 1000;

  static readonly MAX_VISIBLE_CHUNKS: number = 24;
  static readonly MAX_RENDERABLE_CHUNKS: number = 30;
  static readonly VIEW_DISTANCE: number = World.MAX_RENDERABLE_CHUNKS * Chunk.WIDTH;

  static readonly SHOW_FOG: boolean = true;
  static readonly FOG_COLOR: number = 0xb1d8ff;
  static readonly FOG_NEAR: number = World.VIEW_DISTANCE / 2;
  static readonly FOG_FAR: number = World.VIEW_DISTANCE;

  static readonly RAIN_PROBABILITY: number = 1;
  static readonly RAIN_SPEED: number = 320;

  static LOADED_MODELS = new Map<string, THREE.Object3D>();
  static LOADED_TEXTURES = new Map<string, THREE.Texture>();

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private player: Player;

  private terrain: Terrain;
  private weather: Weather;
  private generator: BiomeGenerator;
  private frustum: THREE.Frustum;
  private raycaster: THREE.Raycaster;
  private seed: string;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: THREE.PointerLockControls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.frustum = new THREE.Frustum();
    this.raycaster = new THREE.Raycaster();
  }

  async init() {
    this.initSeed();
    this.initFog();
    this.initLights();
    await this.initObjects();
    await this.initTextures();

    // stuff
    this.generator = new BiomeGenerator();

    this.terrain = new Terrain(this.scene, this, this.generator);

    this.weather = new Weather(this.scene, this.generator);
    this.weather.initClouds();

    this.terrain.init();
    this.terrain.preload();

    this.weather.initRain();

    this.generator.getBiome().init(this.scene, this.terrain);

    const spawn = new THREE.Vector3(-24000, Terrain.SIZE_Y, Terrain.SIZE_Z + 24000);
    const target = new THREE.Vector3(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);

    this.player = new Player(this.controls);
    this.player.init(spawn, target);

    this.scene.add(this.controls.getObject());

    if (Main.DEBUG) {
      this.showAxesHelper();
    }
  }

  private initSeed() {
    this.seed = World.SEED ? World.SEED : MathUtils.randomUint32().toString();
    MathUtils.rng = new Math.seedrandom(this.seed);
    console.info(`SEED : ${this.seed}`);
    /*
    const span = document.createElement('span');
    span.className = 'seed';
    span.textContent = `Seed: ${this.seed}`;
    document.body.appendChild(span);
    */
  }

  private showAxesHelper() {
    const gizmo = new THREE.AxesHelper();
    gizmo.position.set(0, 0, 0);
    gizmo.scale.set(1024, 1024, 1024);
    this.scene.add(gizmo);
  }

  private initFog() {
    if (World.SHOW_FOG) {
      this.scene.fog = new THREE.Fog(World.FOG_COLOR, World.FOG_NEAR, World.FOG_FAR);
    }
  }

  private initLights() {
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.75);
    light.position.set(0, Chunk.SEA_LEVEL, 0);
    light.castShadow = false;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.295);
    ambient.position.set(0, Chunk.HEIGHT, 15000);
    ambient.castShadow = false;
    this.scene.add(ambient);

    const d = 1000000;
    const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
    sunlight.position.set(Terrain.SIZE_X, Chunk.HEIGHT, Terrain.SIZE_Z);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.width = 4096;
    sunlight.shadow.mapSize.height = 4096;
    sunlight.shadow.camera.visible = true;
    sunlight.shadow.camera.castShadow = true;
    sunlight.shadow.bias = 0.0001;
    sunlight.shadow.camera.left = -d;
    sunlight.shadow.camera.right = d;
    sunlight.shadow.camera.top = d;
    sunlight.shadow.camera.bottom = -d;
    sunlight.shadow.camera.near = 150;
    sunlight.shadow.camera.far = 1000000;

    if (Main.DEBUG) {
      this.scene.add(new THREE.DirectionalLightHelper(sunlight, 1024));
    }

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

  private initTextures(): Promise<any> {
    const loader = new THREE.TextureLoader();

    return new Promise(resolve => {
      TEXTURES.forEach((texture: ITexture) => {
        if (!World.LOADED_TEXTURES.has(texture.name)) {
          const img = loader.load(texture.img);
          World.LOADED_TEXTURES.set(texture.name, img);
        }
      });
      resolve();
    });

  }

  /**
   * @param {number} delta
   */
  update(delta: number, tick: number) {
    this.handleMouseInteraction(MOUSE_TYPES.MOVE);
    this.camera.updateMatrixWorld(true);

    this.frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );

    this.terrain.update(this.frustum, this.controls.getObject().position, delta, tick);
    this.player.update(this.terrain, delta);
    this.weather.update(delta);
    this.generator.getBiome().update(delta);
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

  getWeather(): Weather {
    return this.weather;
  }

  getTerrain(): Terrain {
    return this.terrain;
  }

  getGenerator(): BiomeGenerator {
    return this.generator;
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
          object.receiveShadow = false;
          object.frustumCulled = false;

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = false;
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
