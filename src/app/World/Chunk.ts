import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';
import BiomeGenerator from './BiomeGenerator';

import World from './World';
import TerrainMesh from '@mesh/TerrainMesh';
import WaterMesh from '@mesh/WaterMesh';
import CloudMesh from '@mesh/CloudMesh';

import MathUtils from '@utils/Math.utils';

import Terrain from './Terrain';

class Chunk {
  static readonly MAX_CHUNK_HEIGHT: number = 20000;
  static readonly MIN_CHUNK_HEIGHT: number = -10000;

  static readonly NROWS: number = 8;
  static readonly NCOLS: number = 8;

  static readonly CELL_SIZE_X: number = 168;
  static readonly CELL_SIZE_Z: number = 168;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE_X;
  static readonly HEIGHT: number = Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE_Z;

  static readonly CHUNK_OBJECT_STACK = {};

  private generator: BiomeGenerator;

  readonly row: number;
  readonly col: number;

  readonly key: string;
  readonly objects: any[];

  readonly bbox: THREE.Box3;

  private terrainBlueprint: TerrainMesh;
  private waterBlueprint: WaterMesh;
  private cloudBlueprint: CloudMesh;

  dirty: boolean;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    this.generator = generator;
    this.row = row;
    this.col = col;

    this.key = `${row}:${col}`;
    this.objects = [];
    this.dirty = false;
    this.merged = false;

    this.terrainBlueprint = new TerrainMesh(this.generator, this.row, this.col);
    this.waterBlueprint = new WaterMesh(this.generator, this.row, this.col);
    this.cloudBlueprint = new CloudMesh(this.generator, this.row, this.col);

    // compute the bounding box of the chunk for later optimization
    this.bbox = Chunk.createBoundingBox(row, col);
  }

  init(topography: THREE.Geometry, water: THREE.Geometry, clouds:  THREE.Geometry) {
    // merge generated chunk with region geometry
    if (!this.merged) {
      const terrainMesh = this.terrainBlueprint.generate();
      topography.mergeMesh(terrainMesh);

      // TODO optimize this part (mesh could be static objects reused using transformations and data could just be copied to the global geometry)
      if (this.terrainBlueprint.needGenerateWater()) {
        const waterMesh = this.waterBlueprint.generate();
        water.mergeMesh(waterMesh);
      }

      if (this.terrainBlueprint.needGenerateCloud()) {
        const cloudMesh = this.cloudBlueprint.generate();
        clouds.mergeMesh(cloudMesh);
      }

      this.merged = true;
    }
  }

  /**
   * Populate the world with objects use Poisson disk sampling
   * @param scene
   */
  populate(scene: THREE.Scene) {
    const padding = 300; // object bounding box size / 2
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 20, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * Chunk.WIDTH + point.shift();
      const z = padding + this.row * Chunk.DEPTH + point.shift();
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
      const ref = this.objects[i].stack_ref;

      if (Chunk.CHUNK_OBJECT_STACK[ref].size < 256) {
        // collect unused objects
        this.objects[i].visible = false;
        Chunk.CHUNK_OBJECT_STACK[ref].push(this.objects[i]);
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
    if (this.waterMesh) this.waterMesh.visible = bool;
    if (this.cloudMesh) this.cloudMesh.visible = bool;

    for (let i = this.objects.length - 1; i >= 0; i--) {
      this.objects[i].visible = bool;
    }
  }

  static createBoundingBox(row: number, col: number): THREE.Box3 {
    return new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        col * Chunk.WIDTH + Chunk.WIDTH / 2,
        Chunk.HEIGHT / 2,
        row * Chunk.DEPTH + Chunk.DEPTH / 2
      ),
      new THREE.Vector3(
        Chunk.WIDTH,
        Chunk.HEIGHT,
        Chunk.DEPTH
      ));
  }

  static createBoundingBoxHelper(bbox: THREE.Box3): THREE.Box3Helper {
    return new THREE.Box3Helper(bbox, 0xffff00);
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

window.debug = () => {
  Chunk.debugStacks();
};

export default Chunk;
