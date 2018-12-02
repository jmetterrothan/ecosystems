import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import BiomeGenerator from './BiomeGenerator';

import TerrainMesh from '../Mesh/TerrainMesh';
import WaterMesh from '../Mesh/WaterMesh';

import World from './World';
import MathUtils from '@utils/Math.utils';

import { CHUNK_PARAMS } from '@shared/constants/chunkParams.constants';

class Chunk {
  static CHUNK_OBJECT_STACK = {};

  readonly row: number;
  readonly col: number;

  terrain: THREE.Mesh;
  water: THREE.Mesh;

  generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.key = `${row}:${col}`;
    this.objects = [];

    const terrainMesh = new TerrainMesh(generator, row, col);
    this.terrain = terrainMesh.generate();

    this.water = terrainMesh.needGenerateWater() ? new WaterMesh(generator, row, col).generate() : null;
  }

  populate(scene: THREE.Scene) {
    const padding = 300; // object bounding box size / 2
    const pds = new poissonDiskSampling([CHUNK_PARAMS.WIDTH - padding, CHUNK_PARAMS.DEPTH - padding], padding * 2, padding * 2, 30, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * CHUNK_PARAMS.WIDTH + point.shift();
      const z = padding + this.row * CHUNK_PARAMS.DEPTH + point.shift();
      const y = this.generator.computeHeight(x, z);

      // select an organism based on the current biome
      const object = this.generator.pick(x, z);

      if (object) {
        object.visible = true;
        object.position.set(x, Math.max(y, World.WATER_LEVEL), z);
        this.objects.push(object);

        scene.add(object);
      }
    });
  }

  clean(scene) {
    for (let i = this.objects.length - 1; i >= 0; i--) {
      if (Chunk.CHUNK_OBJECT_STACK[this.objects[i].stack_ref].size < 256) {
        // collect unused objects
        Chunk.CHUNK_OBJECT_STACK[this.objects[i].stack_ref].push(this.objects[i]);
      } else {
        // remove objects if the stack is full
        this.objects[i].traverse((child) => {
          if (child.geometry !== undefined) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });

        scene.remove(this.objects[i]);
        delete this.objects[i];
      }
    }

    this.terrain.geometry.dispose();
    this.terrain.material.dispose();
    scene.remove(this.terrain);

    if (this.water) {
      this.water.geometry.dispose();
      this.water.material.dispose();
      scene.remove(this.water);
    }
  }

  set visible(bool: boolean) {
    this.terrain.visible = bool;
    if (this.water) this.water.visible = bool;
  }

  get visible(): boolean {
    return this.terrain.visible;
  }
}
export default Chunk;
