import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import BiomeGenerator from '@world/BiomeGenerator';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';

import MathUtils from '@shared/utils/Math.utils';
import CommonUtils from '@app/shared/utils/Common.utils';

class BubbleEmitter {
  private emitters: THREE.Points[];

  constructor() {
    this.emitters = [];
  }

  /**
   * BubbleEmitter init
   * @param {THREE.Scene} scene
   * @param {BiomeGenerator} generator
   */
  init(scene: THREE.Scene, generator: BiomeGenerator) {
    const biome = generator.getBiome();

    if (!biome.hasWater()) {
      return;
    }

    const size = 75000;

    const pds = new poissonDiskSampling([Terrain.SIZE_X - size, Terrain.SIZE_Z - size], size, size, 60, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = size / 2 + point.shift();
      const z = size / 2 + point.shift();
      const y = generator.computeHeightAt(x, z);

      if (y < Chunk.SEA_LEVEL - Chunk.HEIGHT / 4) {
        scene.add(this.createParticleSource(x, y, z));
      }
    });
  }

  /**
   * Update
   * @param {number} delta
   */
  update(delta: number) {
    this.emitters.forEach(system => {
      const geo = (<THREE.Geometry>system.geometry);
      geo.vertices.forEach(position => {
        position.y += 12500 * delta;

        // particle has reached the surface
        if (position.y >= -1024) {
          position.y = system.userData.origin.y;
        }
      });

      geo.verticesNeedUpdate = true;
    });
  }

  /**
   * Create a particle source emitter
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {THREE.Points}
   */
  private createParticleSource(x: number, y: number, z: number): THREE.Points {
    const count: number = MathUtils.randomInt(16, 32);
    const radius = 15000;
    const geo = new THREE.Geometry();

    const material = new THREE.PointsMaterial({
      size: 7168,
      map: CommonUtils.createBubbleTexture('#ffffff'),
      transparent: true,
      depthTest: true,
      opacity: 0.2,
      fog: false,
      alphaTest: 0.1
    });

    for (let i = 0; i < count; i++) {
      const ox = x + radius * Math.cos(MathUtils.rng());
      const oz = z + radius * Math.sin(MathUtils.rng());
      const oy = MathUtils.randomFloat(y + 1024, Chunk.SEA_LEVEL);

      geo.vertices.push(new THREE.Vector3(ox, oy, oz));
    }

    const emitter = new THREE.Points(geo, material);
    // retain origin information to optimize updates (prevent recalculating origin y position)
    emitter.userData.origin = new THREE.Vector3(x, y, z);
    emitter.frustumCulled = false;

    this.emitters.push(emitter);

    return emitter;
  }
}

export default BubbleEmitter;
