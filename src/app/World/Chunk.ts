import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
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
  static readonly SHOW_HELPER: boolean = false;
  static readonly NROWS: number = 8;
  static readonly NCOLS: number = 8;

  static readonly CELL_SIZE_X: number = 2048;
  static readonly CELL_SIZE_Z: number = 2048;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE_X;
  static readonly HEIGHT: number = 200000;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE_Z;
  static readonly MAX_TERRAIN_HEIGHT: number = 64000;

  static readonly SEA_LEVEL: number = 0;
  static readonly CLOUD_LEVEL: number = 48000;

  static readonly SEA_ELEVATION: number = Chunk.SEA_LEVEL / Chunk.MAX_TERRAIN_HEIGHT;
  static readonly CLOUD_ELEVATION: number = Chunk.CLOUD_LEVEL / Chunk.MAX_TERRAIN_HEIGHT;

  static readonly CHUNK_OBJECT_STACK = {};

  private generator: BiomeGenerator;

  readonly row: number;
  readonly col: number;

  private objects: THREE.Group;

  private bbox: THREE.Box3;
  private bboxHelper: THREE.Box3Helper;

  private terrainBlueprint: TerrainMesh;
  private waterBlueprint: WaterMesh;

  private objectsBlueprint: IPick[];

  private dirty: boolean;
  private merged: boolean;
  private visible: boolean;

  private scene: THREE.Scene;

  public readonly key: string;

  /**
   * Chunk constructor
   * @param {THREE.Scene} scene
   * @param {BiomeGenerator} generator
   * @param {number} row
   * @param {number} col
   */
  constructor(scene: THREE.Scene, generator: BiomeGenerator, row: number, col: number) {
    this.generator = generator;
    this.row = row;
    this.col = col;

    this.key = `${row}:${col}`;
    this.dirty = false;
    this.merged = false;

    this.scene = scene;

    this.objects = new THREE.Group();
    scene.add(this.objects);

    this.terrainBlueprint = new TerrainMesh(this.generator, this.row, this.col);
    this.waterBlueprint = new WaterMesh(this.generator, this.row, this.col);

    // compute the bounding box of the chunk for later optimization
    this.bbox = Chunk.createBoundingBox(row, col);

    // bbox helper
    if (Chunk.SHOW_HELPER) {
      this.bboxHelper = Chunk.createBoundingBoxHelper(this.bbox);
      scene.add(<THREE.Object3D>this.bboxHelper);
    }

    this.objectsBlueprint = [];
  }

  /**
   * Chunk initialization
   * @param {Terrain} terrain
   */
  init(terrain: Terrain) {
    // merge generated chunk with region geometry
    const terrainMesh = this.terrainBlueprint.generate();

    (<THREE.Geometry>terrain.terrain.geometry).mergeMesh(terrainMesh);
    (<THREE.Geometry>terrain.terrain.geometry).elementsNeedUpdate = true;

    // generate water
    if (this.terrainBlueprint.needGenerateWater()) {
      const waterMesh = this.waterBlueprint.generate();

      (<THREE.Geometry>terrain.water.geometry).mergeMesh(waterMesh);
      (<THREE.Geometry>terrain.water.geometry).elementsNeedUpdate = true;
    }

    // generate clouds
    if (this.terrainBlueprint.needGenerateCloud()) {
      const cloudTypes = ['cloud1', 'cloud2', 'cloud3', 'cloud4'];

      const name = cloudTypes[MathUtils.randomInt(0, cloudTypes.length - 1)];
      const mesh: THREE.Mesh = (<THREE.Mesh>World.LOADED_MODELS.get(name).clone().children[0]);

      const x = this.col * Chunk.WIDTH + Chunk.WIDTH / 2;
      const y = Chunk.CLOUD_LEVEL;
      const z = this.row * Chunk.DEPTH + Chunk.DEPTH / 2;

      // prepare object
      const s = World.OBJ_INITIAL_SCALE * MathUtils.randomFloat(0.6, 1.0);
      mesh.geometry = new THREE.Geometry().fromBufferGeometry(<THREE.BufferGeometry>mesh.geometry);
      mesh.frustumCulled = false;
      mesh.matrixAutoUpdate = true;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.visible = true;
      mesh.position.set(x, y, z);
      mesh.scale.set(s, s, s);
      mesh.updateMatrixWorld(true);
      mesh.geometry.computeBoundingBox();

      // put the cloud in the world only if it doesn't collide with the terrain
      const bbox = mesh.geometry.boundingBox;
      // update bbox matrix
      bbox.applyMatrix4(mesh.matrixWorld);

      const p1 = this.generator.computeHeightAt(bbox.min.x, bbox.min.z);
      const p2 = this.generator.computeHeightAt(bbox.max.x, bbox.min.z);
      const p3 = this.generator.computeHeightAt(bbox.min.x, bbox.max.z);
      const p4 = this.generator.computeHeightAt(bbox.max.x, bbox.max.z);

      if (p1 < Chunk.CLOUD_LEVEL && p2 < Chunk.CLOUD_LEVEL && p3 < Chunk.CLOUD_LEVEL && p4 < Chunk.CLOUD_LEVEL) {
        (<THREE.Geometry>terrain.clouds.geometry).mergeMesh(mesh);
        (<THREE.Geometry>terrain.clouds.geometry).elementsNeedUpdate = true;
      }
    }

    this.loadPopulation();

    this.merged = true;
    this.dirty = true;
  }

  /**
   * Poisson disk sampling
   */
  loadPopulation() {
    const padding = World.OBJ_INITIAL_SCALE + 4096; // object bounding box size / 2
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
  populate() {
    for (const item of this.objectsBlueprint) {
      this.placeObject(item);
    }

    this.dirty = false;
  }

  /**
  * Places a picke object
  * @param {Pick} item
  * @param {boolean} animate
  */
  placeObject(item: IPick, animate: boolean = false) {
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

    if (!this.canPlaceObject(object)) {
      this.repurposeObject(object);
      return;
    }

    if (animate) {
      // play bounce animation
      const scaleSaved = object.scale.clone();
      object.scale.set(0, 0, 0);
      this.objects.add(object);

      const animation = new TWEEN.Tween(object.scale)
        .to(scaleSaved, 500)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();
    } else {
      this.objects.add(object);
    }
  }

  canPlanceObjectMove(point: THREE.Vector3) {
    for (let i = 0; i < this.objects.children.length; i++) {
      const bbox = new THREE.Box3().setFromObject(this.objects.children[i]);

      if (bbox.containsPoint(point)) return false;
    }

    return true;
  }

  /**
   * Check if an object can be put at it's current location
   * @param {THREE.Object3D} object
   * @return {boolean}
   */
  canPlaceObject(object: THREE.Object3D): boolean {
    const bbox = new THREE.Box3().setFromObject(object);

    for (let i = 0; i < this.objects.children.length; i++) {
      const bbox2 = new THREE.Box3().setFromObject(this.objects.children[i]);

      if (bbox.intersectsBox(bbox2)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Clean the object layer of the chunk (repurpose objects if needed)
   * @param {THREE.Scene} scene
   */
  clean(scene: THREE.Scene) {
    for (let i = this.objects.children.length - 1; i >= 0; i--) {
      this.repurposeObject(this.objects.children[i]);
    }

    this.objects.children = [];
    this.dirty = true;
  }

  /**
  * Reuses objects if the pool is not full or simply deletes it
  * @param {THREE.Object3D} object
  */
  repurposeObject(object: THREE.Object3D) {
    // @ts-ignore
    const ref = object.stackReference;

    if (ref && Chunk.CHUNK_OBJECT_STACK[ref].size < 256) {
      // collect unused objects
      object.visible = false;
      Chunk.CHUNK_OBJECT_STACK[ref].push(object);
    } else {
      this.scene.remove(object);
    }
  }

  /**
   * Change chunk objects visibility
   * @param {boolean} bool
   */
  setVisible(bool: boolean) {
    if (this.visible !== bool) {
      this.objects.visible = bool;
    }
    this.visible = bool;

    if (this.bboxHelper) {
      (<THREE.Object3D>this.bboxHelper).visible = bool;
    }
  }

  pick(x: number, z: number, force: boolean = false): IPick | null {
    return this.generator.pick(x, z, force);
  }

  /**
   * Chunk objects are visible in frustum if true
   * @return {boolean}
   */
  isVisible() { return this.visible; }

  /**
   * Chunk population need to be regenerated if true
   * @return {boolean}
   */
  isDirty() { return this.dirty; }

  /**
   * Chunk has been merged to the terrain if true
   * @return {boolean}
   */
  isMerged() { return this.merged; }

  /**
   * @return {THREE.Box3}
   */
  getBbox(): THREE.Box3 { return this.bbox; }

  /**
   * Returns a chunk's bounding box
   * @param {number} row
   * @param {number} col
   * @return {THREE.Box3}
   */
  static createBoundingBox(row: number, col: number): THREE.Box3 {
    return new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        col * Chunk.WIDTH + Chunk.WIDTH / 2,
        Chunk.SEA_LEVEL,
        row * Chunk.DEPTH + Chunk.DEPTH / 2
      ),
      new THREE.Vector3(
        Chunk.WIDTH,
        Chunk.HEIGHT,
        Chunk.DEPTH
      ));
  }

  /**
   * Returns a chunk's bounding box helper
   * @param {bbTHREE.Box3ox} bbox
   * @return {THREE.Box3Helper}
   */
  static createBoundingBoxHelper(bbox: THREE.Box3): THREE.Box3Helper {
    return new THREE.Box3Helper(bbox, 0xffff00);
  }

  /**
   * Returns a chunk's bounding box helper
   * @param {number} row
   * @param {number} col
   * @return {THREE.Box3Helper}
   */
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
