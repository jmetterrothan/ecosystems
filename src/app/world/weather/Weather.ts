import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import MathUtils from '@utils/Math.utils';
import CommonUtils from '@utils/Common.utils';
import Stars from '@world/weather/Stars';
import Clouds from '@world/weather/Clouds';
import QueryString, { QueryStringType } from '@app/shared/QueryString';

import { configSvc } from '@app/shared/services/config.service';
import { playerSvc } from '@shared/services/player.service';
import { progressionSvc } from '@achievements/services/progression.service';
import { multiplayerSvc } from '@online/services/multiplayer.service';

import { PROGRESSION_WEATHER_STORAGE_KEYS } from '@achievements/constants/progressionWeatherStorageKeys.constants';
import { GraphicsQuality } from '@app/shared/enums/graphicsQuality.enum';

interface IPhase {
  name: string;
  value: number;
  daylight: number;
  boundLightIntensity: number;
  fogColor: string;
  skyColor: string;
  groundColor: string;
}

interface IPhaseInfo {
  value: number;
  size: number;
  t: number;
  phase: IPhase;
  nextPhase: IPhase;
}

class Weather {
  private static FOG_COLORS: Map<number, THREE.Color> = new Map<number, THREE.Color>();
  private static GROUND_COLORS: Map<number, THREE.Color> = new Map<number, THREE.Color>();
  private static SKY_COLORS: Map<number, THREE.Color> = new Map<number, THREE.Color>();

  private static PHASES: IPhase[] = [
    { name: 'dawn', value: 0, daylight: 0.5, boundLightIntensity: 0.65, fogColor: '#475d73', skyColor: '#3a6aa0', groundColor: '#ec70c5' }, // dawn
    { name: 'day', value: 22, daylight: 1.0, boundLightIntensity: 0.0, fogColor: '#93c9ff', skyColor: '#3a6aa0', groundColor: '#ffffff' },
    { name: 'day', value: 157, daylight: 1.0, boundLightIntensity: 0.0, fogColor: '#93c9ff', skyColor: '#3a6aa0', groundColor: '#ffffff' },
    { name: 'dusk', value: 180, daylight: 0.5, boundLightIntensity: 0.65, fogColor: '#475d73', skyColor: '#3a6aa0', groundColor: '#e86b4a' }, // dusk
    { name: 'night', value: 202, daylight: 0.0, boundLightIntensity: 0.0, fogColor: '#212C37', skyColor: '#3a6aa0', groundColor: '#ffffff' },
    { name: 'night', value: 337, daylight: 0.0, boundLightIntensity: 0.0, fogColor: '#212C37', skyColor: '#3a6aa0', groundColor: '#ffffff' },
  ];

  private scene: THREE.Scene;

  private stars: Stars;
  private clouds: Clouds;

  // lights
  private hemisphereLight: THREE.HemisphereLight;
  private ambientLight: THREE.AmbientLight;
  private sunlight: THREE.DirectionalLight;
  private moonlight: THREE.DirectionalLight;
  private lightHelper: THREE.ArrowHelper;

  private moonBoundLight: THREE.SpotLight;
  private sunBoundLight: THREE.SpotLight;

  // sun objects
  private sun: THREE.Object3D;
  private moon: THREE.Object3D;

  private startSunAngle: number;
  private sunAngle: number; // in radians
  private sunRadius: number;
  private sunRevolutionTime: number; // in seconds
  private sunCanRotate: boolean;

  private fogColor: THREE.Color = new THREE.Color();

  /**
  * Weather constructor
  * @param {THREE.Scene} scene
  * @param {BiomeGenerator} generator
  */
  constructor(scene: THREE.Scene, generator: BiomeGenerator) {
    this.scene = scene;

    const queryString = QueryString.create();

    this.sunRadius = Math.floor((Terrain.SIZE_X + Terrain.SIZE_Z) / 2 * 1.2);
    this.sunRevolutionTime = 120;

    let startAngle = MathUtils.randomInt(0, 360);

    // Photo mode specifics
    if (configSvc.quality === GraphicsQuality.PHOTO) {
      // allow changing time in photo mode
      let customAngle = queryString.get('sunAngle', QueryStringType.INTEGER);

      if (customAngle !== undefined) {
        if (customAngle < 0) { customAngle = 0; }
        if (customAngle > 360) { customAngle = 360; }

        startAngle = customAngle;
      }

      // allow changing revolution time
      let customRevolutionTime = queryString.get('sunRevolutionTime', QueryStringType.INTEGER);

      if (customRevolutionTime !== undefined) {
        if (customRevolutionTime < 0) { customRevolutionTime = 0; }

        this.sunRevolutionTime = customRevolutionTime;
      }
    }

    this.sunAngle = THREE.Math.degToRad(startAngle);
    this.startSunAngle = this.sunAngle;

    this.stars = new Stars();
    this.clouds = new Clouds(generator);
  }

  init() {
    if (multiplayerSvc.isUsed()) this.watchStartTime();

    this.initLights();

    this.clouds.init(this.scene);
    this.stars.init(this.scene);
  }

  initAfter() {
    this.clouds.initRain(this.scene);
  }

  /**
  * @param {number} delta
  */
  update(delta: number) {
    this.updateSun(delta);
    this.updateMoon();
    this.updateLights();

    if (window.isFocused) {
      this.clouds.update(delta);
      this.stars.update();
    }
  }

  initLights() {
    const target = new THREE.Object3D();
    target.position.set(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);
    this.scene.add(target);

    this.hemisphereLight = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.5);
    this.hemisphereLight.position.set(0, Chunk.SEA_LEVEL, 0);
    this.hemisphereLight.castShadow = false;
    this.scene.add(this.hemisphereLight);

    this.ambientLight = new THREE.AmbientLight(0xd0e7fe, 0.5);
    this.ambientLight.position.set(0, Chunk.HEIGHT, 15000);
    this.ambientLight.castShadow = false;
    this.scene.add(this.ambientLight);

    this.initSunlight();
    this.initMoonlight();

    this.moonBoundLight = new THREE.SpotLight(0xc5dadd, 0.2, 0, Math.PI / 2, 1.0);
    this.moonBoundLight.castShadow = false;
    this.moonBoundLight.target = target;
    this.scene.add(this.moonBoundLight);

    this.sunBoundLight = new THREE.SpotLight(0xe86b4a, 0.8, 0, Math.PI / 2, 1.0); // 0xfd5e53
    this.sunBoundLight.castShadow = false;
    this.sunBoundLight.target = target;
    this.scene.add(this.sunBoundLight);

    const materialCallback = (mesh) => {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.material.transparent = true;
      mesh.material.side = THREE.FrontSide;
    };

    this.sun = World.LOADED_MODELS.get('sun').clone();
    (<THREE.Mesh>this.sun.children[0]).material = new THREE.MeshLambertMaterial({ color: 0xffec83, emissive: 0x505050, emissiveIntensity: 1.0, reflectivity: 0.75 });
    this.sun.children.forEach(materialCallback);
    this.sun.position.copy(this.sunlight.position);
    // this.sun.visible = configSvc.debug;

    this.moon = World.LOADED_MODELS.get('moon').clone();
    (<THREE.Mesh>this.moon.children[0]).material = new THREE.MeshLambertMaterial({ color: 0x83d8ff, emissive: 0x505050, emissiveIntensity: 1.0, reflectivity: 0.75 });
    this.moon.children.forEach(materialCallback);
    this.moon.position.copy(this.sunlight.position);
    // this.moon.visible = configSvc.debug;

    this.scene.add(this.sun, this.moon);

    if (configSvc.debug) {
      const dirHelper = new THREE.Vector3().subVectors(this.sunlight.target.position.clone(), this.sunlight.position.clone()).normalize();
      this.lightHelper = new THREE.ArrowHelper(dirHelper, this.sunlight.position.clone(), this.sunRadius, 0xff0000, 10000);
      this.scene.add(this.lightHelper);
    }
  }

  private initSunlight() {
    const d = 500000;
    this.sunlight = new THREE.DirectionalLight(0xffffff, 0.275);
    this.sunlight.userData.minIntensity = 0.0;
    this.sunlight.userData.maxIntensity = 0.275;

    this.sunlight.target.position.set(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);
    this.sunlight.target.updateMatrixWorld(true);

    this.sunlight.position.set(Terrain.SIZE_X / 2, this.sunRadius, Terrain.SIZE_Z / 2);

    this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.width = configSvc.config.SHADOW_MAP_SIZE;
    this.sunlight.shadow.mapSize.height = configSvc.config.SHADOW_MAP_SIZE;
    this.sunlight.shadow.camera.visible = false;
    this.sunlight.shadow.camera.castShadow = false;
    this.sunlight.shadow.bias = 0.0001;
    this.sunlight.shadow.camera.left = -d;
    this.sunlight.shadow.camera.right = d;
    this.sunlight.shadow.camera.top = d;
    this.sunlight.shadow.camera.bottom = -d;
    this.sunlight.shadow.camera.near = 150;
    this.sunlight.shadow.camera.far = 400000;

    this.scene.add(this.sunlight);
  }

  private initMoonlight() {
    // const d = 500000;
    this.moonlight = new THREE.DirectionalLight(0x5fc2eb, 0.125);

    this.moonlight.target.position.set(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);
    this.moonlight.target.updateMatrixWorld(true);

    this.moonlight.position.set(Terrain.SIZE_X / 2, this.sunRadius, Terrain.SIZE_Z / 2);

    this.moonlight.castShadow = false;
    /*
    this.moonlight.shadow.mapSize.width = configSvc.config.SHADOW_MAP_SIZE; // 25000
    this.moonlight.shadow.mapSize.height = configSvc.config.SHADOW_MAP_SIZE;
    this.moonlight.shadow.camera.visible = true;
    this.moonlight.shadow.camera.castShadow = false;
    this.moonlight.shadow.bias = 0.0001;
    this.moonlight.shadow.camera.left = -d;
    this.moonlight.shadow.camera.right = d;
    this.moonlight.shadow.camera.top = d;
    this.moonlight.shadow.camera.bottom = -d;
    this.moonlight.shadow.camera.near = 150;
    this.moonlight.shadow.camera.far = 350000;
    */

    this.scene.add(this.moonlight);
  }

  private updateSun(delta: number) {
    if (this.sunRevolutionTime !== 0) {
      this.sunAngle += THREE.Math.degToRad(360 / this.sunRevolutionTime) * delta;
    }

    // calculate sun position from angle
    const x: number = Terrain.SIZE_X / 2 + this.sunRadius * Math.cos(this.sunAngle);
    const y: number = this.sunRadius * Math.sin(this.sunAngle);

    this.sunlight.position.setX(x);
    this.sunlight.position.setY(y);

    this.sun.position.copy(this.sunlight.position);
    this.sunBoundLight.position.copy(this.sunlight.position);

    if (configSvc.debug) {
      this.lightHelper.position.copy(this.sunlight.position);
      this.lightHelper.setDirection(new THREE.Vector3().subVectors(this.sunlight.target.position.clone(), this.sunlight.position.clone()).normalize());
    }

    // check sun trophy
    const sunBbox = new THREE.Box3().setFromObject(this.sun);

    if (sunBbox.containsPoint(playerSvc.getPosition())) {
      progressionSvc.increment(PROGRESSION_WEATHER_STORAGE_KEYS.in_sun);
    }
  }

  private updateMoon() {
    this.moonlight.position.set(Terrain.SIZE_X - this.sun.position.x, -this.sun.position.y, this.sun.position.z);

    this.moon.position.copy(this.moonlight.position);
    this.moonBoundLight.position.copy(this.moonlight.position);

    // check moon trophy
    const moonBbox = new THREE.Box3().setFromObject(this.moon);

    if (moonBbox.containsPoint(playerSvc.getPosition())) {
      progressionSvc.increment(PROGRESSION_WEATHER_STORAGE_KEYS.in_moon);
    }
  }

  private updateLights() {
    const phaseInfo: IPhaseInfo = this.getPhaseInfo(this.sunAngle);

    const k: number = Math.floor(THREE.Math.radToDeg(this.sunAngle % MathUtils.TWO_PI) * 10) / 10;
    const v: number = this.computeDayLightIntensity(phaseInfo);

    this.sunlight.intensity = MathUtils.mapInterval(v, 0, 1, this.sunlight.userData.minIntensity, this.sunlight.userData.maxIntensity);

    this.sunBoundLight.intensity = MathUtils.lerp(phaseInfo.phase.boundLightIntensity, phaseInfo.nextPhase.boundLightIntensity, phaseInfo.t);

    this.hemisphereLight.skyColor = this.computeSkyColor(k, phaseInfo);
    this.hemisphereLight.groundColor = this.computeGroundColor(k, phaseInfo);
    this.ambientLight.color = this.fogColor = this.computeFogColor(k, phaseInfo);
  }

  /**
   * Calculate an arc color
   * @param {number} angle Angle in degrees
   * @return {THREE.Color}
   */
  private createColor(phaseInfo: IPhaseInfo, colorKey: string): THREE.Color {
    let color = '#000000';

    if (phaseInfo !== null) {
      color = CommonUtils.lerpColor(phaseInfo.phase[colorKey], phaseInfo.nextPhase[colorKey], phaseInfo.t);
    }

    return new THREE.Color(color);
  }

  /**
   * Get fog color
   * @param {number} key
   * @param {IPhaseInfo} phaseInfo
   * @return {THREE.Color}
   */
  private computeFogColor(key: number, phaseInfo: IPhaseInfo): THREE.Color {
    if (!Weather.FOG_COLORS.has(key)) {
      Weather.FOG_COLORS.set(key, this.createColor(phaseInfo, 'fogColor'));
    }
    return Weather.FOG_COLORS.get(key);
  }

  /**
   * Get ground color
   * @param {number} key
   * @param {IPhaseInfo} phaseInfo
   * @return {THREE.Color}
   */
  private computeGroundColor(key: number, phaseInfo: IPhaseInfo): THREE.Color {
    if (!Weather.GROUND_COLORS.has(key)) {
      Weather.GROUND_COLORS.set(key, this.createColor(phaseInfo, 'groundColor'));
    }
    return Weather.GROUND_COLORS.get(key);
  }

  /**
   * Get sky color
   * @param {number} key
   * @param {IPhaseInfo} phaseInfo
   * @return {THREE.Color}
   */
  private computeSkyColor(key: number, phaseInfo: IPhaseInfo): THREE.Color {
    if (!Weather.SKY_COLORS.has(key)) {
      Weather.SKY_COLORS.set(key, this.createColor(phaseInfo, 'skyColor'));
    }
    return Weather.SKY_COLORS.get(key);
  }

  /**
   * Calculate daylight intensity
   * @param {IPhaseInfo} phaseInfo
   * @return {number}
   */
  private computeDayLightIntensity(phaseInfo: IPhaseInfo): number {
    let intensity = 0;

    if (phaseInfo !== null) {
      // MathUtils.lerp(phaseInfo.phase.daylight, phaseInfo.nextPhase.daylight, phaseInfo.t);
      intensity = MathUtils.mapInterval(phaseInfo.value, 0, phaseInfo.size, phaseInfo.phase.daylight, phaseInfo.nextPhase.daylight);
    }
    return intensity;
  }

  /**
   * Get current phase and next phase with an interpolation alpha value
   * @param {number} rad Sun angle in radian
   * @return {IPhaseInfo | null} phaseInfo, null in case of error
   */
  private getPhaseInfo(rad: number): IPhaseInfo | null {
    const angle = THREE.Math.radToDeg(rad % MathUtils.TWO_PI);

    for (let i = 0, n = Weather.PHASES.length; i < n; i++) {
      const j = (i + 1) % n;

      const a1 = Weather.PHASES[i].value;
      const a2 = Weather.PHASES[j].value;

      const phaseSize = j !== 0 ? a2 - a1 : a2 + 360 - a1;
      const currentValue = j !== 0 ? angle - a1 : phaseSize - (angle > a2 ? 360 - angle + a2 : a2 - angle);

      if ((angle >= a1 && angle < a2) || j === 0) {
        return {
          value: currentValue,
          size: phaseSize,
          t: currentValue / phaseSize,
          phase: Weather.PHASES[i],
          nextPhase: Weather.PHASES[j]
        };
      }
    }

    return null;
  }

  private watchStartTime() {
    multiplayerSvc.time$.subscribe(startTime => {
      const now = Date.now();
      const diff = (now - startTime) / 1000;
      const diffAngle = THREE.Math.degToRad(360 / this.sunRevolutionTime) * diff;
      this.sunAngle = this.startSunAngle + diffAngle;
    });
  }

  setDay() {
    this.sunAngle = 0;
  }
  setNight() {
    this.sunAngle = 180;
  }

  getSunAngle(): number {
    return THREE.Math.radToDeg(Math.atan2(this.sun.position.y, this.sun.position.x));
  }

  getClouds(): THREE.Group {
    return this.clouds.getGroup();
  }

  getFogColor(): THREE.Color {
    return this.fogColor;
  }
}

export default Weather;
