import * as THREE from 'three';
import { Howl } from 'howler';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

import { configSvc } from '@shared/services/config.service';
import { voiceSvc } from '@voice/services/voice.service';
import { playerSvc } from '@app/shared/services/player.service';

import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import Weather from '@world/weather/Weather';
import Player from '@app/Player';
import MathUtils from '@utils/Math.utils';
import SoundManager from '@app/shared/SoundManager';

import { INTERACTION_TYPE } from '@app/shared/enums/interaction.enum';
import { GraphicsQuality } from '@shared/enums/graphicsQuality.enum';

class World {
  static readonly SHOW_SUN: boolean = true;
  static readonly SHOW_MOON: boolean = true;

  static readonly GENERATE_STARS: boolean = true;
  static readonly GENERATE_CLOUDS: boolean = true;
  static readonly GENERATE_WATER: boolean = true;
  static readonly GENERATE_TERRAIN_SIDES: boolean = true;

  static readonly POPULATE: boolean = true;

  static readonly SEED: string | null = null;

  static readonly OBJ_INITIAL_SCALE: number = 850;

  static readonly SHOW_FOG: boolean = true;
  static readonly FOG_COLOR: number = 0xb1d8ff;

  static readonly AMBIANT_SOUND_VOLUME: number = 0.35;

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

  private underwaterAmbient: Howl;

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
    this.audioLoader = new THREE.AudioLoader();
  }

  init(seed: string = MathUtils.randomUint32().toString()): string {
    this.initSeed(seed);

    // entities
    const spawn = new THREE.Vector3(-configSvc.config.SPAWN.x, Terrain.SIZE_Y + configSvc.config.SPAWN.y, Terrain.SIZE_Z + configSvc.config.SPAWN.z);
    const target = new THREE.Vector3(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);

    this.player = new Player(this.controls);
    this.player.init(spawn, target);

    // terrain
    this.generator = new BiomeGenerator();
    this.terrain = new Terrain(this);

    const biome = this.generator.init(this.terrain);

    this.weather = new Weather(this.scene, this.generator);
    this.weather.init();

    this.initFog();

    this.terrain.init();
    this.terrain.preload();

    this.weather.initAfter();

    biome.init();

    // this.watchVoiceInteraction();
    this.scene.add(this.controls.getObject());

    if (configSvc.debug) {
      this.showAxesHelper();

      console.info(`SEED : ${this.seed}`);
      console.info(`QUALITY : ${GraphicsQuality[configSvc.quality]}`);
    }

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

  private async initAudio() {
    // ambient
    const ambientSoundPath = this.generator.getBiome().getSound();

    this.audioLoader.load(ambientSoundPath, (buffer) => {
      this.zSound.setBuffer(buffer);
      this.zSound.setRefDistance(10000);
      this.zSound.setLoop(true);
      this.zSound.setVolume(configSvc.soundEnabled ? World.AMBIANT_SOUND_VOLUME : 0);
      this.zSound.play();
    }, () => { }, () => { });
    configSvc.soundEnabled$.subscribe(enabled => this.zSound.setVolume(enabled ? World.AMBIANT_SOUND_VOLUME : 0));

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

    this.underwaterAmbient = SoundManager.get('underwater');
    this.underwaterAmbient.volume(0);
    this.underwaterAmbient.play();
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

    this.player.update(this.terrain, delta);
    this.terrain.update(this.frustum, this.player.position, delta);

    // freeze
    if (window.isFreezed !== true) {
      this.weather.update(delta);
      this.generator.getBiome().update(delta);
    }

    this.underwaterAmbient.volume(playerSvc.isUnderwater() ? 0.5 : 0);
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

  /*
  private watchVoiceInteraction() {
    voiceSvc.wordDetection$.subscribe((label: number) => {
      switch (label) {
        case 0:
          this.handlePlayerInteraction(INTERACTION_TYPE.VOICE_PLACE);
          break;
        case 1:
          this.handlePlayerInteraction(INTERACTION_TYPE.VOICE_VOID);
          break;
        case 2:
          this.handlePlayerInteraction(INTERACTION_TYPE.VOICE_NEXT);
          break;
        default:
          break;
      }
    });
  }
  */

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
