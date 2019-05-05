import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import MathUtils from '@utils/Math.utils';
import BiomeGenerator from '@world/BiomeGenerator';
import CommonUtils from '@utils/Common.utils';
import World from '@world/World';

import { configSvc } from '@app/shared/services/config.service';
import { playerSvc } from '@shared/services/player.service';
import { progressionSvc } from '@achievements/services/progression.service';

import { ICloudData } from '@world/models/cloudData.model';

import { PROGRESSION_WEATHER_STORAGE_KEYS } from '@achievements/constants/progressionWeatherStorageKeys.constants';

const SNOW = {
  material: new THREE.PointsMaterial({
    size: 2048,
    map: CommonUtils.createSnowFlakeTexture('#FFFFFF'),
    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
    opacity: 0.4,
    alphaTest: 0.15,
    fog: true,
  }),
  speed: 4000
};

const RAIN = {
  material: new THREE.PointsMaterial({
    size: 2048,
    map: CommonUtils.createRainDropTexture('#92D4F4'),
    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
    opacity: 0.3,
    alphaTest: 0.15,
    fog: true,
  }),
  speed: 17500
};

class Clouds {
  private generator: BiomeGenerator;
  private group: THREE.Group;
  private wind: THREE.Vector3;

  constructor(generator: BiomeGenerator) {
    this.generator = generator;
  }

  init(scene: THREE.Scene) {
    // clouds
    this.group = new THREE.Group();
    this.group.frustumCulled = true;
    this.group.castShadow = true;
    this.group.receiveShadow = true;
    scene.add(this.group);

    this.wind = new THREE.Vector3(0, 0, MathUtils.randomInt(600, 1200) * Math.sign(Math.random() - 0.5));

    // wind direction helper
    if (configSvc.debug && World.SHOW_CLOUDS) {
      const arrowHelper = new THREE.ArrowHelper(this.wind, new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.CLOUD_LEVEL, Terrain.SIZE_Z / 2), 10000, 0xff0000);
      scene.add(arrowHelper);
    }
  }

  initRain(scene: THREE.Scene) {
    if (!configSvc.config.ENABLE_WEATHER_EFFECTS) { return; }

    const temperature = this.generator.getBiome().getTemperature();

    this.group.children.forEach((cloud: THREE.Mesh) => {
      cloud.updateMatrixWorld(true);

      // particles
      const size = new THREE.Box3().setFromObject(cloud).getSize(new THREE.Vector3());
      const particles = new THREE.Geometry();

      let particleCount = (size.x * size.y * size.z) / 250000000000; // calculate the amount of rain drops from cloud volume

      if (temperature > 40) {
        particleCount = 0;
      }

      for (let i = 0; i < particleCount; i++) {
        particles.vertices.push(new THREE.Vector3(
          MathUtils.randomInt(-size.x / 3, size.x / 3),
          MathUtils.randomInt(Chunk.SEA_LEVEL, Chunk.CLOUD_LEVEL),
          MathUtils.randomInt(-size.z / 3, size.z / 3)
        ));
      }

      // precipitations
      const precipitationType = temperature > 0 ? RAIN : SNOW;

      const data: ICloudData = {
        precipitationType,
        particles,
        particleMaterial: precipitationType.material,
        particleSystem: new THREE.Points(particles, precipitationType.material),
        isRaininig: false,
        allParticlesDropped: false,
        scale: cloud.scale.clone(),
        animating: false,
      };

      scene.add(data.particleSystem);
      cloud.userData = data;
    });
  }

  update(delta: number) {
    const playerPosition = playerSvc.getPosition();

    for (const cloud of this.group.children) {
      // move cloud
      if (!cloud.userData.animating && !window.isFreezed) {
        cloud.position.add(this.wind.clone().multiplyScalar(delta));
      }

      // reset position if the cloud goes off the edges of the world
      const bbox: THREE.Box3 = new THREE.Box3().setFromObject(cloud);
      const size: THREE.Vector3 = bbox.getSize(new THREE.Vector3());

      // animate cloud when it's off bounds
      if (!cloud.userData.animating) {
        if (cloud.position.x < 0) {
          const position = cloud.position.clone();
          position.x = Terrain.SIZE_X;
          this.animateCloudOut(cloud, position);
        }
        if (cloud.position.z < 0) {
          const position = cloud.position.clone();
          position.z = Terrain.SIZE_Z;
          this.animateCloudOut(cloud, position);
        }
        if (cloud.position.x > Terrain.SIZE_X) {
          const position = cloud.position.clone();
          position.x = 0;
          this.animateCloudOut(cloud, position);
        }
        if (cloud.position.z > Terrain.SIZE_Z) {
          const position = cloud.position.clone();
          position.z = 0;
          this.animateCloudOut(cloud, position);
        }
      }

      if (!configSvc.config.ENABLE_WEATHER_EFFECTS) { continue; }

      // rain
      const rainData = cloud.userData as ICloudData;
      rainData.isRaininig = this.generator.computeWaterMoistureAt(cloud.position.x, cloud.position.z) >= 0.6;

      if (!rainData.isRaininig) {
        rainData.allParticlesDropped = rainData.particles.vertices.every(position => position.y === Chunk.CLOUD_LEVEL);
      }

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
        rainData.particleMaterial.visible = rainData.isRaininig;
        position.y -= rainData.precipitationType.speed * delta;

        if (position.y <= Chunk.SEA_LEVEL) {
          position.y = Chunk.CLOUD_LEVEL - size.y / 2;
        }
      });

      // progression
      const playerPositionAtCloudElevation = new THREE.Vector3().copy(playerPosition).setY(Chunk.CLOUD_LEVEL + 500);
      if (rainData.isRaininig && MathUtils.between(playerPosition.y, Chunk.SEA_LEVEL, Chunk.CLOUD_LEVEL) && bbox.containsPoint(playerPositionAtCloudElevation)) {
        progressionSvc.increment(PROGRESSION_WEATHER_STORAGE_KEYS.under_rain);
      }

      rainData.particles.verticesNeedUpdate = true;
    }
  }

  /**
  * Cloud world entry animation
  * @param {THREE.Object3D} cloud
  */
  private animateCloudIn(cloud: THREE.Object3D) {
    new TWEEN.Tween(cloud.scale)
      .to(cloud.userData.scale, 750)
      .delay(500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        cloud.userData.animating = false;
      })
      .start();
  }

  /**
  * Cloud world exit animation
  * @param {THREE.Object3D} cloud
  * @param {THREE.Vector3} position Position to set after the animation is finished
  */
  private animateCloudOut(cloud: THREE.Object3D, position: THREE.Vector3) {
    cloud.userData.animating = true;

    new TWEEN.Tween(cloud.scale)
      .to(new THREE.Vector3(0.00001, 0.00001, 0.00001), 750)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        cloud.position.copy(position);
        this.animateCloudIn(cloud);
      })
      .start();
  }

  getGroup() { return this.group; }
}

export default Clouds;
