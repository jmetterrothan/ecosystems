import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';
import BiomeGenerator from './BiomeGenerator';

import World from './World';
import Terrain from './Terrain';
import TerrainMesh from '@mesh/TerrainMesh';
import WaterMesh from '@mesh/WaterMesh';
import Stack from '@shared/Stack';

import MathUtils from '@utils/Math.utils';

import { IPick } from '@shared/models/pick.model';

class Chunk {
  static readonly NROWS: number = 8;
  static readonly NCOLS: number = 8;

  static readonly CELL_SIZE_X: number = 2048;
  static readonly CELL_SIZE_Z: number = 2048;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE_X;
  static readonly HEIGHT: number = 64000;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE_Z;

  static readonly SEA_LEVEL: number = Chunk.HEIGHT / 4;
  static readonly CLOUD_LEVEL: number = Chunk.HEIGHT - Chunk.HEIGHT / 8;

  static readonly SEA_DEPTH_THICKNESS: number = 10000;

  static readonly SEA_ELEVATION: number = Chunk.SEA_LEVEL / Chunk.HEIGHT;
  static readonly CLOUD_ELEVATION: number = Chunk.CLOUD_LEVEL / Chunk.HEIGHT;

  static readonly CHUNK_OBJECT_STACK = {};

  private generator: BiomeGenerator;

  readonly row: number;
  readonly col: number;

  private objects: THREE.Object3D[];

  readonly bbox: THREE.Box3;

  private terrainBlueprint: TerrainMesh;
  private waterBlueprint: WaterMesh;

  private objectsBlueprint: IPick[];

  private dirty: boolean;
  private merged: boolean;
  private visible: boolean;

  public readonly key: string;

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

    // compute the bounding box of the chunk for later optimization
    this.bbox = Chunk.createBoundingBox(row, col);

    this.objectsBlueprint = [];
  }

  init(terrain: Terrain, scene: THREE.Scene) {
    // merge generated chunk with region geometry
    const terrainMesh = this.terrainBlueprint.generate();

    (<THREE.Geometry>terrain.terrain.geometry).mergeMesh(terrainMesh);
    (<THREE.Geometry>terrain.terrain.geometry).elementsNeedUpdate = true;

    // TODO optimize this part (mesh could be static objects reused using transformations and data could just be copied to the global geometry)
    if (this.terrainBlueprint.needGenerateWater()) {
      const waterMesh = this.waterBlueprint.generate();

      (<THREE.Geometry>terrain.water.geometry).mergeMesh(waterMesh);
      (<THREE.Geometry>terrain.water.geometry).elementsNeedUpdate = true;
    }

    // clouds
    if (this.terrainBlueprint.needGenerateCloud()) {
      const cloudTypes = ['cloud1', 'cloud2', 'cloud3', 'cloud4'];

      const name = cloudTypes[MathUtils.randomInt(0, cloudTypes.length - 1)];
      const mesh: THREE.Mesh = (<THREE.Mesh>World.LOADED_MODELS.get(name).clone().children[0]);

      const x = this.col * Chunk.WIDTH + Chunk.WIDTH / 2;
      const y = Chunk.CLOUD_LEVEL;
      const z = this.row * Chunk.DEPTH + Chunk.DEPTH / 2;

      const s = World.OBJ_INITIAL_SCALE * MathUtils.randomFloat(0.6, 1.0);

      mesh.geometry = new THREE.Geometry().fromBufferGeometry(<THREE.BufferGeometry>mesh.geometry);
      mesh.frustumCulled = false;
      mesh.matrixAutoUpdate = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.visible = true;
      mesh.position.set(x, y, z);
      mesh.scale.set(s, s, s);

      (<THREE.Geometry>terrain.clouds.geometry).mergeMesh(mesh);
      (<THREE.Geometry>terrain.clouds.geometry).elementsNeedUpdate = true;
    }

    this.loadPopulation();

    this.merged = true;
    this.dirty = true;
  }

  /**
   * Poisson disk sampling
   */
  loadPopulation() {
    const padding = World.OBJ_INITIAL_SCALE + 256; // object bounding box size / 2
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 30, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * Chunk.WIDTH + point.shift();
      const z = padding + this.row * Chunk.DEPTH + point.shift();

      // select an organism based on the current biome
      const item = this.generator.pick(x, z);

      if (item !== null) {
        this.objectsBlueprint.push(item);
      }
    });
  }

  /**
   * Populate the world with pre-computed object parameters
   * @param scene
   */
  populate(scene: THREE.Scene) {
    for (const item of this.objectsBlueprint) {
      let object = null;

      // if object stack doesn't exist yet we create one
      if (!Chunk.CHUNK_OBJECT_STACK[item.n]) {
        Chunk.CHUNK_OBJECT_STACK[item.n] = new Stack<THREE.Object3D>();
      }

      // if the stack is empty, create a new object else pop an object from the stack
      if (Chunk.CHUNK_OBJECT_STACK[item.n].empty) {
        object = World.LOADED_MODELS.get(item.n).clone();
      } else {
        object = Chunk.CHUNK_OBJECT_STACK[item.n].pop();
      }

      // restore transforms
      object.rotation.y = item.r;
      object.scale.set(item.s, item.s, item.s);
      object.position.set(item.x, item.y, item.z);
      object.stackReference = item.n;

      object.visible = true;

      scene.add(object);
      this.objects.push(object);
    }

    this.dirty = false;
  }

  clean(scene: THREE.Scene) {
    for (let i = this.objects.length - 1; i >= 0; i--) {
      // @ts-ignore
      const ref = this.objects[i].stackReference;

      if (Chunk.CHUNK_OBJECT_STACK[ref].size < 256) {
        // collect unused objects
        this.objects[i].visible = false;
        Chunk.CHUNK_OBJECT_STACK[ref].push(this.objects[i]);
      } else {
        scene.remove(this.objects[i]);
      }
    }

    this.objects = [];
    this.dirty = true;
  }

  setVisible(bool: boolean) {
    if (this.visible !== bool) {
      for (let i = this.objects.length - 1; i >= 0; i--) {
        this.objects[i].visible = bool;
      }
    }
    this.visible = bool;
  }

  isVisible() { return this.visible; }
  isDirty() { return this.dirty; }
  isMerged() { return this.merged; }

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

  static createBoundingBoxHelperFromCoords(row: number, col: number): THREE.Box3Helper {
    return new THREE.Box3Helper(Chunk.createBoundingBox(row, col), 0xffff00);
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
