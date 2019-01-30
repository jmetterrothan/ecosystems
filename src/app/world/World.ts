import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import ConfigService, { configSvc } from '@shared/services/config.service';
import { voiceSvc } from '@voice/services/voice.service';

import Terrain from '@world/Terrain';
import Biome from '@world/Biome';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import Weather from '@world/Weather';
import Player from '@app/Player';
import MathUtils from '@utils/Math.utils';

import { INTERACTION_TYPE } from '@app/shared/enums/interaction.enum';
import { GraphicsQuality } from '@shared/enums/graphicsQuality.enum';

class World {
  static readonly SEED: string | null = null;
  static readonly BIOME: Biome | null = null; // lock a specific biome here, if null a biome is selected randomly
  static readonly EMPTY: boolean = false;

  static readonly OBJ_INITIAL_SCALE: number = 1000;

  static readonly SHOW_FOG: boolean = true;
  static readonly FOG_COLOR: number = 0xb1d8ff;

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

  private initialized: boolean;

  private listener: THREE.AudioListener;
  private zSound: THREE.PositionalAudio;
  private audioLoader: THREE.AudioLoader;
  private volume: number;

  /**
   * World constructor
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   * @param {THREE.PointerLockControls}  controls
   */
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: THREE.PointerLockControls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.frustum = new THREE.Frustum();
    this.raycaster = new THREE.Raycaster();

    this.initialized = false;
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.zSound = new THREE.PositionalAudio(this.listener);
    this.volume = 1;
    this.audioLoader = new THREE.AudioLoader();
  }

  init(seed: string = MathUtils.randomUint32().toString()): string {
    this.initSeed(seed);

    // entities
    const spawn = new THREE.Vector3(-24000, Terrain.SIZE_Y, Terrain.SIZE_Z + 24000);
    const target = new THREE.Vector3(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);

    this.player = new Player(this.controls);
    this.player.init(spawn, target);

    // terrain
    this.generator = new BiomeGenerator();
    this.terrain = new Terrain(this);

    const biome = this.generator.init(this.terrain);

    this.weather = new Weather(this.scene, this.generator);
    this.initFog();
    this.weather.initClouds();
    this.weather.initLights();
    this.weather.initStars();

    this.terrain.init();
    this.terrain.preload();

    this.weather.initRain();

    biome.init();

    this.watchObjectPlacedWithVoice();
    this.scene.add(this.controls.getObject());

    if (configSvc.debug) {
      this.showAxesHelper();

      console.info(`SEED : ${this.seed}`);
      console.info(`QUALITY : ${GraphicsQuality[configSvc.quality]}`);
    }

    // configSvc.soundEnabled$.subscribe(() => { });
    this.initAudio();

    this.initialized = true;

    return seed;
  }

  private initSeed(seed: string) {
    this.seed = seed;
    MathUtils.rng = new Math.seedrandom(this.seed);
  }

  private showAxesHelper() {
    const gizmo = new THREE.AxesHelper();
    gizmo.position.set(0, 0, 0);
    gizmo.scale.set(2048, 2048, 2048);
    this.scene.add(gizmo);
  }

  private initFog() {
    if (World.SHOW_FOG) {
      const far = configSvc.config.MAX_RENDERABLE_CHUNKS * ((Chunk.WIDTH + Chunk.DEPTH) / 2);
      const near = far / 2;

      this.scene.fog = new THREE.Fog(0x000000, near, far);
    }
  }

  private initAudio() {
    let volume = this.volume;

    if (!configSvc.soundEnabled) {
      volume = 0;
    }
    const mySound = this.generator.getBiome().getSound();
    this.audioLoader.load(mySound, (buffer) => {
      this.zSound.setBuffer(buffer);
      this.zSound.setRefDistance(5000);
      this.zSound.setLoop(true);
      this.zSound.setVolume(volume);
      this.zSound.play();
    }, () => { }, () => { });

    // create an object for the sound to play from
    let object: THREE.Object3D;

    if (configSvc.debug) {
      const sphere = new THREE.SphereGeometry(500, 8, 8);
      const material = new THREE.MeshPhongMaterial({ color: 0xff2200 });

      object = new THREE.Mesh(sphere, material);
    } else {
      object = new THREE.Object3D();
    }

    this.scene.add(object);

    // finally add the sound to the mesh
    object.add(this.zSound);
    object.position.set(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);
  }

  /**
   * @param {number} delta
   */
  update(delta: number) {
    if (!this.initialized) return;

    this.handlePlayerInteraction(INTERACTION_TYPE.MOUSE_MOVE);
    this.camera.updateMatrixWorld(true);

    this.frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );

    this.terrain.update(this.frustum, this.player.position, delta);
    this.player.update(this.terrain, delta);
    this.weather.update(delta);
    this.generator.getBiome().update(delta);
  }

  /**
   * Called each time the user has an interaction with his mouse
   * @param {MouseTypes} interactionType
   */
  handlePlayerInteraction(interactionType: INTERACTION_TYPE) {
    const pos = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const mouse = new THREE.Vector2(
      (pos.x / window.innerWidth) * 2 - 1,
      (pos.y / window.innerHeight) * -2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    this.terrain.handlePlayerInteraction(this.raycaster, interactionType);
  }

  /**
   * Handle keyboard input
   * @param {string} key
   * @param {boolean} active
   */
  handleKeyboard(key: string, active: boolean) {
    this.player.handleKeyboard(key, active);
  }

  private watchObjectPlacedWithVoice() {
    voiceSvc.wordDetection$.subscribe(() => this.handlePlayerInteraction(INTERACTION_TYPE.VOICE));
  }

  isInitialized(): boolean { return this.initialized; }

  getWeather(): Weather { return this.weather; }

  getTerrain(): Terrain { return this.terrain; }

  getBiomeGenerator(): BiomeGenerator { return this.generator; }

  getScene(): THREE.Scene { return this.scene; }

  getSeed(): string { return this.seed; }

  static pointInWorld(point: THREE.Vector3): boolean {
    const margin: number = 1000;
    return MathUtils.between(point.x, 0 + margin, Terrain.SIZE_X - margin) && MathUtils.between(point.z, 0 + margin, Terrain.SIZE_Z - margin);
  }
}

export default World;
