import CloudMesh from '@mesh/CloudMesh';
import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';
import BiomeGenerator from './BiomeGenerator';

import World from './World';
import TerrainMesh from '../Mesh/TerrainMesh';
import WaterMesh from '../Mesh/WaterMesh';

import MathUtils from '@utils/Math.utils';

import { TERRAIN_MESH_PARAMS } from '@mesh/constants/terrainMesh.constants';
import Terrain from './Terrain';

class Chunk {
  static CHUNK_OBJECT_STACK = {};

  readonly row: number;
  readonly col: number;

  key: string;
  objects: any[];

  terrainMesh: THREE.Mesh;
  waterMesh: THREE.Mesh;
  cloudMesh: THREE.Mesh;

  terrain: TerrainMesh;

  generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.key = `${row}:${col}`;
    this.objects = [];

    this.innitTerrainMesh();
    this.initWaterMesh();
    this.initCloudsMesh();
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
        object.position.set(x, Math.max(y, World.SEA_LEVEL), z);
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

    this.terrainMesh.geometry.dispose();
    (<THREE.Material>this.terrainMesh.material).dispose();
    scene.remove(this.terrainMesh);

    if (this.waterMesh) {
      this.waterMesh.geometry.dispose();
      (<THREE.Material>this.waterMesh.material).dispose();
      scene.remove(this.waterMesh);
    }

    if (this.cloudMesh) {
      this.cloudMesh.geometry.dispose();
      (<THREE.Material>this.cloudMesh.material).dispose();
      scene.remove(this.cloudMesh);
    }
  }

  set visible(bool: boolean) {
    this.terrainMesh.visible = bool;
    if (this.waterMesh) this.waterMesh.visible = bool;
    if (this.cloudMesh) this.cloudMesh.visible = bool;

    for (let i = this.objects.length - 1; i >= 0; i--) {
      this.objects[i].visible = bool;
    }
  }

  get visible(): boolean {
    return this.terrainMesh.visible;
  }

  private innitTerrainMesh() {
    this.terrain = new TerrainMesh(this.generator, this.row, this.col);
    this.terrainMesh = this.terrain.generate();
  }

  private initWaterMesh() {
    this.waterMesh = this.terrain.needGenerateWater()
      ? new WaterMesh(this.generator, this.row, this.col).generate()
      : null;
  }

  private initCloudsMesh() {
    this.cloudMesh = this.terrain.needGenerateCloud()
      ? new CloudMesh(this.generator, this.row, this.col).generate()
      : null;
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
