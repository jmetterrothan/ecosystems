import * as THREE from 'three';

import World from '@world/World';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';

import GraphicsConfigService, { configSvc } from '@shared/services/graphicsConfig.service';

import { ICloudData } from '@shared/models/cloudData.model';

import MathUtils from '@shared/utils/Math.utils';

class Weather {
  private scene: THREE.Scene;
  private generator: BiomeGenerator;

  private clouds: THREE.Group;
  private wind: THREE.Vector3;

  private startTime: number;

  // lights
  private sunlight: THREE.DirectionalLight;
  private moonlight: THREE.DirectionalLight;
  private lightHelper: THREE.ArrowHelper;

  // sun objects
  private sun: THREE.Mesh;
  private moon: THREE.Mesh;
  private target: THREE.Mesh;

  /**
   * Weather constructor
   * @param {THREE.Scene} scene
   * @param {BiomeGenerator} generator
   */
  constructor(scene: THREE.Scene, generator: BiomeGenerator) {
    this.scene = scene;
    this.generator = generator;

    this.startTime = window.performance.now();
  }

  getClouds(): THREE.Group {
    return this.clouds;
  }

  /**
   * @param {number} delta
   */
  update(delta: number) {
    this.updateClouds(delta);
    this.updateSun();
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
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.75);
    light.position.set(0, Chunk.SEA_LEVEL, 0);
    light.castShadow = false;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.275);
    ambient.position.set(0, Chunk.HEIGHT, 15000);
    ambient.castShadow = false;
    this.scene.add(ambient);

    this.initSunlight();
    this.initMoonlight();

    this.sun = new THREE.Mesh(new THREE.SphereGeometry(5000, 24, 24), new THREE.MeshBasicMaterial({ color: 'red' }));
    this.sun.position.copy(this.sunlight.position);

    this.moon = new THREE.Mesh(new THREE.SphereGeometry(5000, 24, 24), new THREE.MeshBasicMaterial({ color: 'blue' }));
    this.moon.position.copy(this.sunlight.position);

    this.target = new THREE.Mesh(new THREE.SphereGeometry(5000, 24, 24), new THREE.MeshBasicMaterial({ color: 'green' }));
    this.target.position.copy(this.sunlight.target.position);

    this.scene.add(this.sun, this.moon, this.target);

    if (configSvc.config.DEBUG) {
      const dirHelper = new THREE.Vector3().subVectors(this.sunlight.target.position.clone(), this.sunlight.position.clone()).normalize();
      this.lightHelper = new THREE.ArrowHelper(dirHelper, this.sunlight.position.clone(), Chunk.HEIGHT, 0xff0000, 10000);
      this.scene.add(this.lightHelper);
    }
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
          position.y -= World.RAIN_SPEED;
        } else {
          // rain stop
          if (position.y < Chunk.CLOUD_LEVEL - 1000) {
            position.y -= World.RAIN_SPEED;
          } else {
            position.set(cloud.position.x, Chunk.CLOUD_LEVEL - size.y / 2, cloud.position.z);
          }

        }
      });

      rainData.particles.verticesNeedUpdate = true;

    }
  }

  private updateSun() {
    const elapsedTime = (window.performance.now() - this.startTime) / 5000;

    this.sunlight.position.x = Terrain.SIZE_X / 2 + Chunk.HEIGHT * Math.cos(elapsedTime);
    this.sunlight.position.y = Chunk.HEIGHT * Math.sin(elapsedTime);

    this.moonlight.position.set(Terrain.SIZE_X - this.sun.position.x, -this.sun.position.y, this.sun.position.z);

    this.sun.position.copy(this.sunlight.position);
    this.moon.position.copy(this.moonlight.position);
    this.target.position.copy(this.sunlight.target.position);

    this.lightHelper.position.copy(this.sunlight.position);
    this.lightHelper.setDirection(new THREE.Vector3().subVectors(this.sunlight.target.position.clone(), this.sunlight.position.clone()).normalize());

    this.sunlight.shadow.camera.updateProjectionMatrix();
    this.moonlight.shadow.camera.updateProjectionMatrix();
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
    this.moonlight = new THREE.DirectionalLight(0xffffff, 0.05);

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
}

export default Weather;
