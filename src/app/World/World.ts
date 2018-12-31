import * as THREE from 'three';

import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import Main from '../Main';
import Terrain from './Terrain';
import Chunk from './Chunk';
import Player from '../Player';

import { OBJECTS } from '@shared/constants/object.constants';
import { TEXTURES } from '@shared/constants/texture.constants';

import MathUtils from '@utils/Math.utils';
import { MOUSE_TYPES } from '@shared/enums/mouse.enum';
import { ITexture } from '@shared/models/texture.model';
import { ICloudData } from '@shared/models/cloudData.model';
import BiomeGenerator from './BiomeGenerator';

class World {
  static SEED: string | null = null;

  static readonly OBJ_INITIAL_SCALE: number = 1000;

  static readonly MAX_VISIBLE_CHUNKS: number = 24;
  static readonly MAX_RENDERABLE_CHUNKS: number = 30;
  static readonly VIEW_DISTANCE: number = World.MAX_RENDERABLE_CHUNKS * Chunk.WIDTH;

  static readonly SHOW_FOG: boolean = true;
  static readonly FOG_COLOR: number = 0xb1d8ff;
  static readonly FOG_NEAR: number = World.VIEW_DISTANCE / 2;
  static readonly FOG_FAR: number = World.VIEW_DISTANCE;

  static readonly RAIN_PROBABILITY: number = 1;
  static readonly RAIN_VELOCITY: number = 150;

  static LOADED_MODELS = new Map<string, THREE.Object3D>();
  static LOADED_TEXTURES = new Map<string, THREE.Texture>();

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private player: Player;

  private terrain: Terrain;
  private generator: BiomeGenerator;
  private frustum: THREE.Frustum;
  private raycaster: THREE.Raycaster;
  private seed: string;

  private clouds: THREE.Group;
  private wind: THREE.Vector3;

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
    this.initClouds();

    // stuff
    this.terrain = new Terrain(this.scene, this.clouds);
    this.terrain.init();
    this.terrain.preload();

    this.initRain();

    const spawn = new THREE.Vector3(-24000, Terrain.SIZE_Y, Terrain.SIZE_Z + 24000);
    const target = new THREE.Vector3(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);

    this.player = new Player(this.controls);
    this.player.init(spawn, target);

    this.generator = this.terrain.getGenerator();

    this.scene.add(this.controls.getObject());
  }

  private initSeed() {
    this.seed = World.SEED ? World.SEED : MathUtils.randomUint32().toString();
    MathUtils.rng = new Math.seedrandom(this.seed);
    console.info(`SEED : ${this.seed}`);

    const span = document.createElement('span');
    span.className = 'seed';
    span.textContent = `Seed: ${this.seed}`;
    document.body.appendChild(span);
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
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.75);
    light.position.set(0, Chunk.SEA_LEVEL, 0);
    light.castShadow = false;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.275);
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
    sunlight.shadow.camera.near = 100;
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

  private initClouds() {
    // clouds
    this.clouds = new THREE.Group(); // new THREE.Mesh(new THREE.Geometry(), CLOUD_MATERIAL);
    this.clouds.frustumCulled = true;
    this.clouds.castShadow = true;
    this.clouds.receiveShadow = true;
    this.scene.add(this.clouds);

    this.wind = new THREE.Vector3(0, 0, 1024 * Math.sign(Math.random() - 0.5));

    // wind direction helper
    if (Main.DEBUG) {
      const arrowHelper = new THREE.ArrowHelper(this.wind, new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.CLOUD_LEVEL, Terrain.SIZE_Z / 2), 10000, 0xff0000);
      this.scene.add(arrowHelper);
    }
  }

  private initRain() {
    this.clouds.children.forEach((cloud: THREE.Mesh) => {
      // particles
      const size = new THREE.Box3().setFromObject(cloud).getSize(new THREE.Vector3());
      const particles = new THREE.Geometry();
      const particleCount = (size.x * size.y * size.z) / 20000000000;

      for (let i = 0; i < particleCount; i++) {
        particles.vertices.push(new THREE.Vector3(
          MathUtils.randomInt(-size.x / 3, size.x / 3),
          MathUtils.randomInt(Chunk.SEA_LEVEL, Chunk.CLOUD_LEVEL),
          MathUtils.randomInt(-size.z / 3, size.z / 3)
        ));
      }

      // material
      const material = new THREE.PointsMaterial({
        size: 200,
        map: World.LOADED_TEXTURES.get('raindrop'),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
      });

      const data: ICloudData = {
        particles,
        particleMaterial: material,
        particleSystem: new THREE.Points(particles, material),
        isRaininig: false,
        allParticlesDropped: false
      };

      this.scene.add(data.particleSystem);

      cloud.userData = data;

    });
  }

  getTerrain(): Terrain {
    return this.terrain;
  }

  /**
   * @param {number} delta
   */
  update(delta, tick) {
    this.camera.updateMatrixWorld(true);

    this.frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );

    this.terrain.update(this.frustum, this.controls.getObject().position, delta, tick);
    this.player.update(this.terrain, delta);
    this.handleMouseInteraction(MOUSE_TYPES.MOVE);

    /*
    if (position.y < Chunk.SEA_LEVEL) {
      // console.log('underwater');
    }
    */

    this.updateClouds(delta);
  }

  updateClouds(delta: number) {
    for (const cloud of this.clouds.children) {
      // move cloud
      cloud.position.add(this.wind.clone().multiplyScalar(delta));

      cloud.updateMatrixWorld(true);

     // reset position if the cloud goes off the edges of the world
      const bbox: THREE.Box3 = new THREE.Box3().setFromObject(cloud);
      const size: THREE.Vector3 = bbox.getSize(new THREE.Vector3());

      if (bbox.max.x < 0) {
        cloud.position.x = Terrain.SIZE_X - size.z / 2;
      }
      if (bbox.max.z < 0) {
        cloud.position.z = Terrain.SIZE_Z - size.z / 2;
      }
      if (bbox.min.x > Terrain.SIZE_X) {
        cloud.position.x = size.x / 2;
      }
      if (bbox.min.z > Terrain.SIZE_Z) {
        cloud.position.z = size.z / 2;
      }

      // rain
      const rainData = cloud.userData as ICloudData;

      rainData.isRaininig = this.generator.computeMoistureAt(cloud.position.x, cloud.position.z) >= 0.65;
      if (!rainData.isRaininig) rainData.allParticlesDropped = rainData.particles.vertices.every(position => position.y === Chunk.CLOUD_LEVEL);
      if (rainData.allParticlesDropped) {
        rainData.particleMaterial.visible = false;
        rainData.particles.vertices.forEach(position => position.set(
          MathUtils.randomInt(-size.x / 3, size.x / 3),
          MathUtils.randomInt(Chunk.SEA_LEVEL, Chunk.CLOUD_LEVEL),
          MathUtils.randomInt(-size.z / 3, size.z / 3)
        ));
      }

      // set particle system position
      rainData.particleSystem.position.setX(cloud.position.x);
      rainData.particleSystem.position.setZ(cloud.position.z);

      rainData.particles.vertices.forEach(position => {
        if (position.y <= Chunk.SEA_ELEVATION) position.y = Chunk.CLOUD_LEVEL;
        if (rainData.isRaininig) {
          rainData.particleMaterial.visible = true;
          position.y -= World.RAIN_VELOCITY;
        } else {
          // rain stop
          if (position.y < Chunk.CLOUD_LEVEL - 1000) {
            position.y -= World.RAIN_VELOCITY;
          } else {
            position.set(cloud.position.x, Chunk.CLOUD_LEVEL, cloud.position.z);
          }

        }
      });

      rainData.particles.verticesNeedUpdate = true;

    }
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
