import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import poissonDiskSampling from 'poisson-disk-sampling';

import BiomeGenerator from '@world/BiomeGenerator';
import World from '@world/World';
import Terrain from '@world/Terrain';
import MathUtils from '@utils/Math.utils';
import TerrainMesh from '@mesh/TerrainMesh';
import WaterMesh from '@mesh/WaterMesh';
import Fifo from '@app/shared/Fifo';

import { IPick } from '@world/models/pick.model';
import { IPlaceObject, IPickObject, IStackReference, IRemoveObject } from '@world/models/objectParameters.model';

import { CLOUD_MATERIAL } from '@materials/cloud.material';

interface ISamplingParameters {
  isOnWater: boolean;
}

class Chunk {
  static readonly SHOW_HELPER: boolean = false;
  static readonly NROWS: number = 12;
  static readonly NCOLS: number = 12;

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

  static readonly INTERACTION_DISTANCE: number = 60000;
  static readonly SO_INTERACTION_DISTANCE: number = 40000;
  static readonly ANIMATION_DELAY: number = 200;

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
    this.objects.visible = World.SHOW_POPULATION;

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

  private initWater(terrain: Terrain) {
    if (terrain.getBiome().hasWater() && this.terrainBlueprint.needGenerateWater()) {
      const p1 = this.generator.computeHeightAt(this.col * Chunk.WIDTH, this.row * Chunk.DEPTH);
      const p2 = this.generator.computeHeightAt(this.col * Chunk.WIDTH + Chunk.WIDTH, this.row * Chunk.DEPTH);
      const p3 = this.generator.computeHeightAt(this.col * Chunk.WIDTH, this.row * Chunk.DEPTH + Chunk.DEPTH);
      const p4 = this.generator.computeHeightAt(this.col * Chunk.WIDTH + Chunk.WIDTH, this.row * Chunk.DEPTH + Chunk.DEPTH);
      const p5 = this.generator.computeHeightAt(this.col * Chunk.WIDTH + Chunk.WIDTH / 2, this.row * Chunk.DEPTH + Chunk.DEPTH / 2);
      const level = Chunk.SEA_LEVEL + 1024;

      if (p1 <= level || p2 <= level || p3 <= level || p4 <= level || p5 <= level) {
        const waterMesh = this.waterBlueprint.generate();

        (<THREE.Geometry>terrain.water.geometry).mergeMesh(waterMesh);
        (<THREE.Geometry>terrain.water.geometry).elementsNeedUpdate = true;
      }
    }
  }

  private initClouds(terrain: Terrain) {
    const v = new THREE.Vector3((this.bbox.max.x + this.bbox.min.x) / 2, (this.bbox.max.y + this.bbox.min.y) / 2, (this.bbox.max.z + this.bbox.min.z) / 2);

    if (this.terrainBlueprint.needGenerateCloud(v)) {
      const cloudTypes = ['cloud1', 'cloud2', 'cloud3', 'cloud4'];

      const name = cloudTypes[MathUtils.randomInt(0, cloudTypes.length - 1)];
      const mesh: THREE.Mesh = <THREE.Mesh>World.LOADED_MODELS.get(name).clone().children[0];

      const x = this.col * Chunk.WIDTH + Chunk.WIDTH / 2;
      const y = Chunk.CLOUD_LEVEL;
      const z = this.row * Chunk.DEPTH + Chunk.DEPTH / 2;

      // prepare object
      const s = World.OBJ_INITIAL_SCALE * MathUtils.randomFloat(0.6, 1.0);
      mesh.geometry = new THREE.Geometry().fromBufferGeometry(<THREE.BufferGeometry>mesh.geometry);
      mesh.frustumCulled = true;
      mesh.matrixAutoUpdate = true;
      mesh.receiveShadow = false;
      mesh.castShadow = true;
      mesh.visible = World.SHOW_CLOUDS;
      mesh.position.set(x, y, z);
      mesh.scale.set(s, s, s);
      mesh.updateMatrixWorld(true);
      mesh.material = CLOUD_MATERIAL;

      // put the cloud in the world only if it doesn't collide with the terrain
      const bbox = new THREE.Box3().setFromObject(mesh);

      const p1 = this.generator.computeHeightAt(bbox.min.x, bbox.min.z);
      const p2 = this.generator.computeHeightAt(bbox.max.x, bbox.min.z);
      const p3 = this.generator.computeHeightAt(bbox.min.x, bbox.max.z);
      const p4 = this.generator.computeHeightAt(bbox.max.x, bbox.max.z);

      if (p1 < Chunk.CLOUD_LEVEL && p2 < Chunk.CLOUD_LEVEL && p3 < Chunk.CLOUD_LEVEL && p4 < Chunk.CLOUD_LEVEL) {
        terrain
          .getWorld()
          .getWeather()
          .getClouds()
          .add(mesh);
      }
    }

    this.loadPopulation({ isOnWater: false });
    this.loadPopulation({ isOnWater: true });

    this.merged = true;
    this.dirty = true;
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
    this.initWater(terrain);

    // generate clouds
    this.initClouds(terrain);
  }

  /**
   * Poisson disk sampling
   */
  private loadPopulation(parameters: ISamplingParameters) {
    const padding = World.OBJ_INITIAL_SCALE + 4096; // object bounding box size / 2
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 30, MathUtils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * Chunk.WIDTH + point.shift();
      const z = padding + this.row * Chunk.DEPTH + point.shift();

      // select an organism based on the current biome
      const item = this.generator.pick(x, z, parameters);

      if (item !== null) {
        this.savePick(item);
      }
    });
  }

  /**
   * Save an object to the chunk blueprint
   * @param {THREE.Object3D} object
   */
  saveObject(object: THREE.Object3D) {
    this.savePick(Chunk.convertObjectToPick(object));
  }

  /**
   * Save an object pick to the chunk blueprint
   * @param {Pick} pick
   */
  savePick(pick: IPick) {
    this.objectsBlueprint.push(pick);
  }

  /**
   * Remove an object to blueprint and scene
   * @param {THREE.Object3D} object
   */
  removeObject(object: THREE.Object3D, parameters: IRemoveObject = {}) {
    const pick = Chunk.convertObjectToPick(object);

    const online = parameters.online;

    this.objectsBlueprint = this.objectsBlueprint.filter(p => !pick.p.equals(p.p));

    const objectToDelete = online ? this.objects.children.find(obj => obj.position.equals(object.position)) : object;

    if (objectToDelete !== undefined && parameters.animate) {
      new TWEEN.Tween(objectToDelete.scale)
        .to(new THREE.Vector3(0.000001, 0.000001, 0.000001), 400)
        .easing(TWEEN.Easing.Cubic.In)
        .start()
        .onComplete(() => this.objects.remove(objectToDelete));
    } else {
      this.objects.remove(objectToDelete);
    }
  }

  /**
   * Populate the world with pre-computed object parameters
   * @param scene
   */
  populate() {
    for (const item of this.objectsBlueprint) {
      const object = this.getObject(item);
      if (!this.canPlaceObject(object)) {
        this.repurposeObject(object);
        continue;
      }
      this.placeObject(object);
    }

    this.dirty = false;
  }

  update() {
    /*
    const time = window.performance.now() / 1000;
    const biome = this.generator.getBiome();

    this.objects.traverse(object => {
      if (object.userData.stackReference === 'lilypad') {
        const ax = (time + object.userData.initialPosition.x) * biome.getWaterDistortionFreq();
        const az = (time + object.userData.initialPosition.z) * biome.getWaterDistortionFreq();

        const dy = Math.cos(ax) * biome.getWaterDistortionAmp() + Math.sin(az) * biome.getWaterDistortionAmp();

        object.position.setY(object.userData.initialPosition.y + dy);
      }
    });
    */
  }

  /**
   * Recovers an object from the pool and prepares the Object3D
   * @param {IPick} item
   * @return {THREE.Object3D | null}
   */
  getObject(item: IPick): THREE.Object3D | null {
    let object = null;

    if (item.n) {
      // if object stack doesn't exist yet we create one
      if (!Chunk.CHUNK_OBJECT_STACK[item.n]) {
        Chunk.CHUNK_OBJECT_STACK[item.n] = new Fifo<THREE.Object3D>();
      }

      // if the stack is empty, create a new object else pop an object from the stack
      if (Chunk.CHUNK_OBJECT_STACK[item.n].isEmpty()) {
        object = World.LOADED_MODELS.get(item.n).clone();
      } else {
        object = Chunk.CHUNK_OBJECT_STACK[item.n].pop();
      }

      // restore transformations
      object.rotation.copy(item.r);
      object.scale.copy(item.s);
      object.position.copy(item.p);
      object.userData = <IStackReference>{ stackReference: item.n, float: item.f, type: object.userData.type, initialPosition: new THREE.Vector3().copy(item.p) };
      object.visible = true;
    }

    return object;
  }

  /**
   * Place an object
   * @param {THREE.Object3D} object
   * @param {IPlaceObject} parameters
   * @return {boolean}
   */
  placeObject(object: THREE.Object3D, parameters: IPlaceObject = {}): boolean {
    if (object === null) {
      console.warn(`Failed to place object`);
      return false;
    }

    if (parameters.animate === true) {
      this.placeObjectWithAnimation(object);
    } else {
      this.objects.add(object);
    }

    if (parameters.save === true) {
      this.saveObject(object);
    }

    return true;
  }

  /**
   * Check if an object can be put at it's current location
   * @param {THREE.Object3D} object
   * @return {boolean}
   */
  canPlaceObject(object: THREE.Object3D): boolean {
    if (!(object instanceof THREE.Object3D)) {
      return false;
    }

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
   */
  clean() {
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
    if (object === null) {
      return;
    }

    const ref = (<IStackReference>object.userData).stackReference;

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
      this.objects.visible = bool && World.SHOW_POPULATION;
    }
    this.visible = bool;

    if (this.bboxHelper) {
      (<THREE.Object3D>this.bboxHelper).visible = bool;
    }
  }

  /**
   * pick an object
   * @param {number} x
   * @param {number} z
   * @param {IPickObject} parameters
   */
  pick(x: number, z: number, parameters: IPickObject = {}): IPick | null {
    return this.generator.pick(x, z, parameters);
  }

  /**
   * Chunk objects are visible in frustum if true
   * @return {boolean}
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Chunk population need to be regenerated if true
   * @return {boolean}
   */
  isDirty(): boolean {
    return this.dirty;
  }

  /**
   * Chunk has been merged to the terrain if true
   * @return {boolean}
   */
  isMerged(): boolean {
    return this.merged;
  }

  /**
   * @return {THREE.Box3}
   */
  getBbox(): THREE.Box3 {
    return this.bbox;
  }

  getObjects(): THREE.Group {
    return this.objects;
  }

  private placeObjectWithAnimation(object: THREE.Object3D) {
    const scaleSaved = object.scale.clone();
    object.scale.set(0.00001, 0.00001, 0.00001);
    this.objects.add(object);

    // animation
    new TWEEN.Tween(object.scale)
      .to(scaleSaved, 750)
      .delay(Chunk.ANIMATION_DELAY)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();
  }

  /**
   * Returns a chunk's bounding box
   * @param {number} row
   * @param {number} col
   * @return {THREE.Box3}
   */
  static createBoundingBox(row: number, col: number): THREE.Box3 {
    return new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(col * Chunk.WIDTH + Chunk.WIDTH / 2, Chunk.SEA_LEVEL - Chunk.HEIGHT / 4, row * Chunk.DEPTH + Chunk.DEPTH / 2), new THREE.Vector3(Chunk.WIDTH, Chunk.HEIGHT / 2, Chunk.DEPTH));
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

  /**
   * Convert an object3d to pick information
   * @param {THREE.Object3D} object
   * @return {IPick}
   */
  static convertObjectToPick(object: THREE.Object3D): IPick {
    const translation = new THREE.Vector3();
    const rotationQ = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    object.matrixWorld.decompose(translation, rotationQ, scale);

    // convert object to pick
    const item: IPick = {
      p: object.position,
      f: object.userData.float,
      n: object.userData.stackReference,
      r: object.rotation,
      s: scale
    };

    return item;
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
