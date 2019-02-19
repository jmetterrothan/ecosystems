import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import MathUtils from '@utils/Math.utils';
import CommonUtils from '@utils/Common.utils';
import Stars from '@world/weather/Stars';
import Clouds from '@world/weather/Clouds';

import { configSvc } from '@app/shared/services/config.service';
import { playerSvc } from '@shared/services/player.service';
import { progressionSvc } from '@achievements/services/progression.service';
import { multiplayerSvc } from '@online/services/multiplayer.service';

import { PROGRESSION_WEATHER_STORAGE_KEYS } from '@achievements/constants/progressionWeatherStorageKeys.constants';

class Weather {
  private static FOG_COLORS: Map<number, THREE.Color> = new Map<number, THREE.Color>();
  private static PHASES: any = [
    { value: 22, color: '#B1D8FF' },
    { value: 157, color: '#B1D8FF' },
    { value: 202, color: '#212C37' },
    { value: 337, color: '#212C37' },
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

  private sunAngle: number; // in radians
  private sunRadius: number;
  private sunRevolutionTime: number; // in seconds

  private fogColor: THREE.Color = new THREE.Color();

  /**
  * Weather constructor
  * @param {THREE.Scene} scene
  * @param {BiomeGenerator} generator
  */
  constructor(scene: THREE.Scene, generator: BiomeGenerator) {
    this.scene = scene;

    const startAngle = MathUtils.randomInt(0, 360);

    this.sunAngle = THREE.Math.degToRad(0);
    this.sunRadius = Math.floor((Terrain.SIZE_X + Terrain.SIZE_Z) / 2 * 1.2);
    this.sunRevolutionTime = 10; // 150;

    this.stars = new Stars();
    this.clouds = new Clouds(generator);
  }

  init() {
    this.watchStartTime();

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

    this.hemisphereLight = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.4);
    this.hemisphereLight.position.set(0, Chunk.SEA_LEVEL, 0);
    this.hemisphereLight.castShadow = false;
    this.scene.add(this.hemisphereLight);

    this.ambientLight = new THREE.AmbientLight(0xB1D8FF, 0.35);
    this.ambientLight.position.set(0, Chunk.HEIGHT, 15000);
    this.ambientLight.castShadow = false;
    this.scene.add(this.ambientLight);

    this.initSunlight();
    this.initMoonlight();

    this.moonBoundLight = new THREE.SpotLight(0xc5dadd, 0.1, 0, Math.PI / 2, 1.0);
    this.moonBoundLight.castShadow = false;
    this.moonBoundLight.target = target;
    this.scene.add(this.moonBoundLight);

    this.sunBoundLight = new THREE.SpotLight(0xfd5e53, 1.0, 0, Math.PI / 2, 1.0); // 0xfd5e53
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
    this.sunlight = new THREE.DirectionalLight(0xffffff, 0.2);

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
    this.sunAngle += THREE.Math.degToRad(360 / this.sunRevolutionTime) * delta;

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
    const y = this.sunlight.position.y;
    const c: THREE.Color = this.computeFogColor(this.sunAngle);

    this.hemisphereLight.intensity = MathUtils.mapInterval(Math.abs(y), 0, this.sunRadius, 0.35, 0.75);
    this.ambientLight.intensity = MathUtils.mapInterval(y, 0, Chunk.HEIGHT, 0.2, 0.35);
    this.sunlight.intensity = MathUtils.mapInterval(y, 0, this.sunRadius, 0.0, 0.25);

    this.ambientLight.color = c;
    this.fogColor = c;

    if (y >= -this.sunRadius / 4) {
      this.sunBoundLight.intensity = MathUtils.mapInterval(y, -this.sunRadius / 4, this.sunRadius, 1.0, 0);
    } else {
      this.sunBoundLight.intensity = MathUtils.mapInterval(Math.abs(y), this.sunRadius / 4, this.sunRadius, 1.0, 0);
    }
  }

  private createFogColor(angle: number): THREE.Color {
    let c = '#000000';

    for (let i = 0, n = Weather.PHASES.length; i < n; i++) {
      const j = (i + 1) % n;

      const v1 = j === 0 ? Weather.PHASES[j].value : Weather.PHASES[i].value;
      const v2 = j === 0 ? Weather.PHASES[i].value : Weather.PHASES[j].value;
      const l = angle - v1;

      if (angle >= v1 && angle < v2) {
        console.log(angle, v1, v2, l, l / (v2 - v1));
        c = CommonUtils.lerpColor(Weather.PHASES[i].color, Weather.PHASES[j].color, l / (v2 - v1));
        break;
      }
    }

    return new THREE.Color(c);
  }

  private computeFogColor(rad: number): THREE.Color {
    const angle = Math.floor(THREE.Math.radToDeg(rad % MathUtils.TWO_PI));

    if (!Weather.FOG_COLORS.has(angle)) {
      Weather.FOG_COLORS.set(angle, this.createFogColor(angle));
    }

    return Weather.FOG_COLORS.get(angle);
  }

  private watchStartTime() {
    // multiplayerSvc.time$.subscribe(time => this.startTime = time);
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
