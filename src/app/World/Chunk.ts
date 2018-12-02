import CloudMesh from '@mesh/CloudMesh';
import { WATER_CONSTANTS } from '@shared/constants/water.constants';
import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import BiomeGenerator from './BiomeGenerator';

import TerrainMesh from '../Mesh/TerrainMesh';
import WaterMesh from '../Mesh/WaterMesh';

import MathUtils from '@utils/Math.utils';

import { TERRAIN_MESH_PARAMS } from '@mesh/constants/terrainMesh.constants';

class Chunk {
  static CHUNK_OBJECT_STACK = {};

  readonly row: number;
  readonly col: number;

  key: string;
  objects: any[];

  terrain: THREE.Mesh;
  water: THREE.Mesh;
  cloud: THREE.Mesh;

  generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.key = `${row}:${col}`;
    this.objects = [];

    const terrainMesh = new TerrainMesh(this.generator, this.row, this.col);
    this.terrain = terrainMesh.generate();

    this.water = terrainMesh.needGenerateWater() ? new WaterMesh(this.generator, this.row, this.col).generate() : null;

    this.cloud = Math.random() > 0.95 ? new CloudMesh(this.generator, this.row, this.col).generate() : null;
  }

  /**
   * Populate the world with objects use Poisson disk sampling
   * @param scene
   */
  populate(scene: THREE.Scene) {
    const padding = 300; // object bounding box size / 2
    const pds = new poissonDiskSampling([TERRAIN_MESH_PARAMS.WIDTH - padding, TERRAIN_MESH_PARAMS.DEPTH - padding], padding * 2, padding * 2, 30, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * TERRAIN_MESH_PARAMS.WIDTH + point.shift();
      const z = padding + this.row * TERRAIN_MESH_PARAMS.DEPTH + point.shift();
      const y = this.generator.computeHeight(x, z);

      // select an organism based on the current biome
      const object = this.generator.pick(x, z);

      if (object) {
        object.visible = true;
        object.position.set(x, Math.max(y, WATER_CONSTANTS.SEA_LEVEL), z);
        this.objects.push(object);

        scene.add(object);
      }
    });
  }

  clean(scene: THREE.Scene) {
    for (let i = this.objects.length - 1; i >= 0; i--) {
      if (Chunk.CHUNK_OBJECT_STACK[this.objects[i].stack_ref].size < 256) {
        // collect unused objects
        this.objects[i].visible = false;
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
    (<THREE.Material>this.terrain.material).dispose();
    scene.remove(this.terrain);

    if (this.water) {
      this.water.geometry.dispose();
      (<THREE.Material>this.terrain.material).dispose();
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

  static debugStacks() {
    console.log('## CHUNK OBJECT STACKS');
    let str = '';
    for (const type in Chunk.CHUNK_OBJECT_STACK) {
      str += `${type} : ${Chunk.CHUNK_OBJECT_STACK[type].size}\n`;
    }
    console.log(`${str}\n`);
  }
}
export default Chunk;
