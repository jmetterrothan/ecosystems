import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';

import GraphicsConfigService, { configSvc } from '@shared/services/graphicsConfig.service';
import PlayerService, { playerSvc } from '@services/player.service';

import { ICloudData } from '@shared/models/cloudData.model';

import MathUtils from '@shared/utils/Math.utils';
import CommonUtils from '@app/Shared/utils/Common.utils';

class Weather {
  private static RAIN_SPEED : number = 200;
  private static FOG_COLORS : Map<number, THREE.Color> = new Map<number, THREE.Color>();

  private scene: THREE.Scene;
  private generator: BiomeGenerator;

  private configSvc: GraphicsConfigService;
  private playerSvc: PlayerService;

  private clouds: THREE.Group;
  private wind: THREE.Vector3;

  private startTime: number;

  // lights
  private hemisphereLight: THREE.HemisphereLight;
  private ambientLight: THREE.AmbientLight;
  private sunlight: THREE.DirectionalLight;
  private moonlight: THREE.DirectionalLight;
  private lightHelper: THREE.ArrowHelper;

  private moonBoundLight: THREE.PointLight;
  private sunBoundLight: THREE.PointLight;

  // stars
  private starsSystem: THREE.Points;

  // sun objects
  private sun: THREE.Object3D;
  private moon: THREE.Object3D;

  private fogColor: THREE.Color = new THREE.Color();
  /**
   * Weather constructor
   * @param {THREE.Scene} scene
   * @param {BiomeGenerator} generator
   */
  constructor(scene: THREE.Scene, generator: BiomeGenerator) {
    this.scene = scene;
    this.generator = generator;

    this.configSvc = configSvc;
    this.playerSvc = playerSvc;

    this.startTime = window.performance.now();
  }

  getClouds(): THREE.Group {
    return this.clouds;
  }

  getFogColor(): THREE.Color {
    return this.fogColor;
  }

  /**
   * @param {number} delta
   */
  update(delta: number) {
    this.updateClouds(delta);
    this.updateSun();
    this.updateMoon();
    this.updateLights();
    this.updateStars();
  }

  initClouds() {
    // clouds
    this.clouds = new THREE.Group();
    this.clouds.frustumCulled = true;
    this.clouds.castShadow = true;
    this.clouds.receiveShadow = true;
    this.scene.add(this.clouds);

    this.wind = new THREE.Vector3(0, 0, 768 * Math.sign(Math.random() - 0.5));

    // wind direction helper
    if (this.configSvc.config.DEBUG) {
      const arrowHelper = new THREE.ArrowHelper(this.wind, new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.CLOUD_LEVEL, Terrain.SIZE_Z / 2), 10000, 0xff0000);
      this.scene.add(arrowHelper);
    }
  }

  initRain() {
    if (!this.configSvc.config.ENABLE_WEATHER_EFFECTS) { return; }

    this.clouds.children.forEach((cloud: THREE.Mesh) => {
      // particles
      const size = new THREE.Box3().setFromObject(cloud).getSize(new THREE.Vector3());
      const particles = new THREE.Geometry();
      const particleCount = (size.x * size.y * size.z) / 250000000000; // calculate the amount of rain drops from cloud volume

      for (let i = 0; i < particleCount; i++) {
        particles.vertices.push(new THREE.Vector3(
          MathUtils.randomInt(-size.x / 3, size.x / 3),
          MathUtils.randomInt(Chunk.SEA_LEVEL, Chunk.CLOUD_LEVEL),
          MathUtils.randomInt(-size.z / 3, size.z / 3)
        ));
      }

      // material
      const material = new THREE.PointsMaterial({
        size: 1024,
        map: World.LOADED_TEXTURES.get('raindrop'),
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
        opacity: 0.50
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

  initLights() {
    this.hemisphereLight = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.75);
    this.hemisphereLight.position.set(0, Chunk.SEA_LEVEL, 0);
    this.hemisphereLight.castShadow = false;
    this.scene.add(this.hemisphereLight);

    this.ambientLight = new THREE.AmbientLight(0xB1D8FF, 0.3);
    this.ambientLight.position.set(0, Chunk.HEIGHT, 15000);
    this.ambientLight.castShadow = false;
    this.scene.add(this.ambientLight);

    this.initSunlight();
    this.initMoonlight();

    this.moonBoundLight = new THREE.PointLight(0xc5dadd, 0.2, Terrain.SIZE_X, 1.0);
    this.moonBoundLight.castShadow = false;
    this.scene.add(this.moonBoundLight);

    this.sunBoundLight = new THREE.PointLight(0xfd5e53, 1.0, Terrain.SIZE_X * 2, 0.75);
    this.sunBoundLight.castShadow = false;
    this.scene.add(this.sunBoundLight);

    const materialCallback = (mesh) => {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.material.transparent = true;
      mesh.material.side = THREE.FrontSide;
    };

    this.sun = World.LOADED_MODELS.get('sun').clone();
    this.sun.children.forEach(materialCallback);
    // this.sun = new THREE.Mesh(new THREE.SphereGeometry(1000, 24, 24), new THREE.MeshBasicMaterial({ color: 'red' }));
    this.sun.position.copy(this.sunlight.position);
    // this.sun.visible = configSvc.config.DEBUG;

    this.moon = World.LOADED_MODELS.get('moon').clone();
    this.moon.children.forEach(materialCallback);
    // this.moon = new THREE.Mesh(new THREE.SphereGeometry(1000, 24, 24), new THREE.MeshBasicMaterial({ color: 'blue' }));
    this.moon.position.copy(this.sunlight.position);
    // this.moon.visible = configSvc.config.DEBUG;

    this.scene.add(this.sun, this.moon);

    if (configSvc.config.DEBUG) {
      const dirHelper = new THREE.Vector3().subVectors(this.sunlight.target.position.clone(), this.sunlight.position.clone()).normalize();
      this.lightHelper = new THREE.ArrowHelper(dirHelper, this.sunlight.position.clone(), Chunk.HEIGHT, 0xff0000, 10000);
      this.scene.add(this.lightHelper);
    }
  }

  private initSunlight() {
    const d = 1000000;
    this.sunlight = new THREE.DirectionalLight(0xffffff, 0.25);

    this.sunlight.target.position.set(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);
    this.sunlight.target.updateMatrixWorld(true);

    this.sunlight.position.set(Terrain.SIZE_X / 2, Chunk.HEIGHT, Terrain.SIZE_Z / 2);

    this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.width = 4096;
    this.sunlight.shadow.mapSize.height = 4096;
    this.sunlight.shadow.camera.visible = true;
    this.sunlight.shadow.camera.castShadow = true;
    this.sunlight.shadow.bias = 0.0001;
    this.sunlight.shadow.camera.left = -d;
    this.sunlight.shadow.camera.right = d;
    this.sunlight.shadow.camera.top = d;
    this.sunlight.shadow.camera.bottom = -d;
    this.sunlight.shadow.camera.near = 150;
    this.sunlight.shadow.camera.far = 1000000;

    this.scene.add(this.sunlight);
  }

  private initMoonlight() {
    const d = 1000000;
    this.moonlight = new THREE.DirectionalLight(0x5fc2eb, 0.15);

    this.moonlight.target.position.set(Terrain.SIZE_X / 2, 0, Terrain.SIZE_Z / 2);
    this.moonlight.target.updateMatrixWorld(true);

    this.moonlight.position.set(Terrain.SIZE_X / 2, Chunk.HEIGHT, Terrain.SIZE_Z / 2);

    this.moonlight.castShadow = true;
    this.moonlight.shadow.mapSize.width = 4096;
    this.moonlight.shadow.mapSize.height = 4096;
    this.moonlight.shadow.camera.visible = true;
    this.moonlight.shadow.camera.castShadow = true;
    this.moonlight.shadow.bias = 0.0001;
    this.moonlight.shadow.camera.left = -d;
    this.moonlight.shadow.camera.right = d;
    this.moonlight.shadow.camera.top = d;
    this.moonlight.shadow.camera.bottom = -d;
    this.moonlight.shadow.camera.near = 150;
    this.moonlight.shadow.camera.far = 1000000;

    this.scene.add(this.moonlight);
  }

  initStars() {
    const starsCount: number = 1000;
    const stars = new THREE.Geometry();

    for (let i = 0; i < starsCount; i++) {

      const u = MathUtils.rng();
      const v = MathUtils.rng();
      const radius = Chunk.HEIGHT * 2.5;
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const x = (radius * Math.sin(phi) * Math.cos(theta));
      const y = (radius * Math.sin(phi) * Math.sin(theta));
      const z = (radius * Math.cos(phi));

      stars.vertices.push(new THREE.Vector3(x, y, z));
    }

    const material = new THREE.PointsMaterial({
      size: 1500,
      color: '#fefdef',
      transparent: true,
      opacity: 0.75,
      fog: false,
    });

    this.starsSystem = new THREE.Points(stars, material);
    this.starsSystem.position.copy(this.playerSvc.getPosition());
    this.starsSystem.frustumCulled = false;

    this.scene.add(this.starsSystem);
  }

  /**
   * Update cloud movements an weather particles
   * @param {number} delta
   */
  private updateClouds(delta: number) {
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

      if (!this.configSvc.config.ENABLE_WEATHER_EFFECTS) { continue; }

      // rain
      const rainData = cloud.userData as ICloudData;

      rainData.isRaininig = this.generator.computeWaterMoistureAt(cloud.position.x, cloud.position.z) >= 0.65;
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
        if (position.y <= Chunk.SEA_ELEVATION) position.y = Chunk.CLOUD_LEVEL - size.y / 2;
        if (rainData.isRaininig) {
          rainData.particleMaterial.visible = true;
          position.y -= Weather.RAIN_SPEED;
        } else {
          // rain stop
          if (position.y < Chunk.CLOUD_LEVEL - 1000) {
            position.y -= Weather.RAIN_SPEED;
          } else {
            position.set(cloud.position.x, Chunk.CLOUD_LEVEL - size.y / 2, cloud.position.z);
          }

        }
      });

      rainData.particles.verticesNeedUpdate = true;
    }
  }

  private updateSun() {
    const elapsedTime = (window.performance.now() - this.startTime) / 24000; // 60000

    const x = Terrain.SIZE_X / 2 + Chunk.HEIGHT * Math.cos(elapsedTime);
    const y = Chunk.HEIGHT * Math.sin(elapsedTime);

    this.sunlight.position.setX(x);
    this.sunlight.position.setY(y);

    this.sun.position.copy(this.sunlight.position);
    this.sunlight.shadow.camera.updateProjectionMatrix();

    this.sunBoundLight.position.copy(this.sunlight.position);

    if (this.configSvc.config.DEBUG) {
      this.lightHelper.position.copy(this.sunlight.position);
      this.lightHelper.setDirection(new THREE.Vector3().subVectors(this.sunlight.target.position.clone(), this.sunlight.position.clone()).normalize());
    }
  }

  private updateMoon() {
    this.moonlight.position.set(Terrain.SIZE_X - this.sun.position.x, -this.sun.position.y, this.sun.position.z);

    this.moon.position.copy(this.moonlight.position);
    this.moonlight.shadow.camera.updateProjectionMatrix();

    this.moonBoundLight.position.copy(this.moonlight.position);
  }

  private updateLights() {
    const y = this.sunlight.position.y;
    this.hemisphereLight.intensity = MathUtils.mapInterval(Math.abs(y), 0, Chunk.HEIGHT, 0.35, 0.75);
    this.ambientLight.intensity = MathUtils.mapInterval(y, 0, Chunk.HEIGHT, 0.15, 0.3);
    this.sunlight.intensity = MathUtils.mapInterval(y, 0, Chunk.HEIGHT, 0.15, 0.25);

    if (y > 0) {
      this.computeFogColor(y);
      this.sunBoundLight.intensity = MathUtils.mapInterval(Math.abs(y), 0, Chunk.HEIGHT, 1.0, 0);
    } else {
      this.sunBoundLight.intensity = MathUtils.mapInterval(Math.abs(y), 0, Chunk.HEIGHT / 2, 1.0, 0);
    }
  }

  private updateStars() {
    const position = this.playerSvc.getPosition();
    this.starsSystem.position.copy(position);
  }

  private computeFogColor(y: number) {
    const yFloor = Math.floor(y);

    if (!Weather.FOG_COLORS.has(yFloor)) {
      const t = MathUtils.mapInterval(yFloor, 0, Chunk.HEIGHT, 0, 1);
      const color = CommonUtils.lerpColor('#212C37', '#B1D8FF', t);
      const threeColor = new THREE.Color(color);

      Weather.FOG_COLORS.set(yFloor, threeColor);
      this.fogColor = threeColor;
    } else {
      this.fogColor = Weather.FOG_COLORS.get(yFloor);
    }
  }
}

export default Weather;
