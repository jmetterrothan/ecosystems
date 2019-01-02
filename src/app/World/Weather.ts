import * as THREE from 'three';

import Main from './../Main';
import World from '@world/World';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';
import BiomeGenerator from '@world/BiomeGenerator';
import MathUtils from '@shared/utils/Math.utils';

import { ICloudData } from '@shared/models/cloudData.model';

class Weather {
  private scene: THREE.Scene;
  private generator: BiomeGenerator;

  private clouds: THREE.Group;
  private wind: THREE.Vector3;

  constructor(scene: THREE.Scene, generator: BiomeGenerator) {
    this.scene = scene;
    this.generator = generator;
  }

  update(delta: number) {
    this.updateClouds(delta);
  }

  initClouds() {
    // clouds
    this.clouds = new THREE.Group(); // new THREE.Mesh(new THREE.Geometry(), CLOUD_MATERIAL);
    this.clouds.frustumCulled = true;
    this.clouds.castShadow = true;
    this.clouds.receiveShadow = true;
    this.scene.add(this.clouds);

    this.wind = new THREE.Vector3(0, 0, 768 * Math.sign(Math.random() - 0.5));

    // wind direction helper
    if (Main.DEBUG) {
      const arrowHelper = new THREE.ArrowHelper(this.wind, new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.CLOUD_LEVEL, Terrain.SIZE_Z / 2), 10000, 0xff0000);
      this.scene.add(arrowHelper);
    }
  }

  initRain() {
    this.clouds.children.forEach((cloud: THREE.Mesh) => {
      // particles
      const size = new THREE.Box3().setFromObject(cloud).getSize(new THREE.Vector3());
      const particles = new THREE.Geometry();
      const particleCount = (size.x * size.y * size.z) / 250000000000;

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

  getClouds(): THREE.Group {
    return this.clouds;
  }
}

export default Weather;
