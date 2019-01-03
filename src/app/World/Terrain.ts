import * as THREE from 'three';

import Chunk from './Chunk';
import World from './World';
import BiomeGenerator from './BiomeGenerator';
import Coord from './Coord';
import Biome from './Biome';
import Main from '../Main';
import MathUtils from '@shared/utils/Math.utils';
import Crosshair from '../UI/Crosshair';

import { MOUSE_TYPES } from '@shared/enums/mouse.enum';
import { TERRAIN_MATERIAL, TERRAIN_SIDE_MATERIAL } from '@materials/terrain.material';
import { WATER_MATERIAL } from '@materials/water.material';

import { CONFIG } from '@shared/constants/config.constants';

import { IBiome } from '@shared/models/biome.model';
import { IPick } from '@shared/models/pick.model';
import { underwaterSvc } from '@shared/services/underwater.service';

class Terrain {
  static readonly NCHUNKS_X: number = 16;
  static readonly NCHUNKS_Z: number = 16;
  static readonly NCOLS: number = Terrain.NCHUNKS_X * Chunk.NCOLS;
  static readonly NROWS: number = Terrain.NCHUNKS_Z * Chunk.NROWS;

  static readonly SIZE_X: number = Terrain.NCOLS * Chunk.CELL_SIZE_X;
  static readonly SIZE_Y: number = Chunk.HEIGHT;
  static readonly SIZE_Z: number = Terrain.NROWS * Chunk.CELL_SIZE_Z;

  static readonly OFFSET_X: number = Terrain.SIZE_X / 2;
  static readonly OFFSET_Z: number = Terrain.SIZE_Z / 2;

  private chunks: Map<string, Chunk>;
  private visibleChunks: Chunk[];

  private start: Coord;
  private end: Coord;
  private chunk: Coord;

  private scene: THREE.Scene;
  private world: World;
  private generator: BiomeGenerator;

  public terrain: THREE.Mesh;
  public terrainSide: THREE.Mesh;
  public water: THREE.Mesh;

  private layers: THREE.Group;

  // preview
  private previewItem: IPick;
  private previewObject: THREE.Object3D;
  private previewActive: boolean;
  private currentSubBiome: IBiome;
  private intersectionSurface: THREE.Object3D;
  private objectAnimated: boolean;

  /**
   * Terrain constructor
   * @param {THREE.Scene} scene
   * @param {World} world
   * @param {BiomeGenerator} generator
   */
  constructor(scene: THREE.Scene, world: World, generator: BiomeGenerator) {
    this.scene = scene;
    this.world = world;
    this.generator = generator;

    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];

    this.layers = new THREE.Group();

    this.chunk = new Coord();
    this.start = new Coord();
    this.end = new Coord();
  }

  init() {
    this.initMeshes();
    this.initUnderwater();
  }

  /**
   * Loads region chunks
   */
  preload() {
    this.loadChunks(0, 0, Terrain.NCHUNKS_Z, Terrain.NCHUNKS_X);

    // borders generation
    const bt1 = this.getBorderMesh(1, Terrain.NCOLS, (row, col) => col * Chunk.CELL_SIZE_X, (row, col) => 0);
    const bt2 = this.getBorderMesh(1, Terrain.NCOLS, (row, col) => col * Chunk.CELL_SIZE_X, (row, col) => Terrain.SIZE_Z);
    const bt3 = this.getBorderMesh(1, Terrain.NROWS, (row, col) => Terrain.SIZE_X, (row, col) => col * Chunk.CELL_SIZE_Z);
    const bt4 = this.getBorderMesh(1, Terrain.NROWS, (row, col) => 0, (row, col) => col * Chunk.CELL_SIZE_Z);
    const bt5 = this.getBottomMesh();

    const bw1 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_X * 4, (row, col) => col * Chunk.WIDTH / 4, (row, col) => Terrain.SIZE_Z, false);
    const bw2 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_X * 4, (row, col) => col * Chunk.WIDTH / 4, (row, col) => 0, true);
    const bw3 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_Z * 4, (row, col) => 0, (row, col) => col * Chunk.WIDTH / 4, false);
    const bw4 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_Z * 4, (row, col) => Terrain.SIZE_X, (row, col) => col * Chunk.DEPTH / 4, true);

    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt1);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt2);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt3);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt4);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt5);

    (<THREE.Geometry>this.water.geometry).mergeMesh(bw1);
    (<THREE.Geometry>this.water.geometry).mergeMesh(bw2);
    (<THREE.Geometry>this.water.geometry).mergeMesh(bw3);
    (<THREE.Geometry>this.water.geometry).mergeMesh(bw4);

    // water mesh offset
    const offset = 8;
    const sx = 1 - (offset / Terrain.SIZE_X);
    const sz = 1 - (offset / Terrain.SIZE_Z);

    this.water.scale.set(sx, 1, sz);
    this.water.position.x += offset / 2;
    this.water.position.z += offset / 2;

    (<THREE.ShaderMaterial>this.water.material).uniforms.size.value = new THREE.Vector3(Terrain.SIZE_X, Terrain.SIZE_Y, Terrain.SIZE_Z);

    const biome: Biome = this.generator.getBiome();
    (<THREE.ShaderMaterial>this.water.material).uniforms.water_distortion.value = CONFIG.ENABLE_WATER_EFFECTS && biome.getWaterDistortion();
    (<THREE.ShaderMaterial>this.water.material).uniforms.water_distortion_freq.value = biome.getWaterDistortionFreq();
    (<THREE.ShaderMaterial>this.water.material).uniforms.water_distortion_amp.value = biome.getWaterDistortionAmp();
  }

  /**
   * Loads chunks in a specified area
   * @param {number} startRow
   * @param {number} startCol
   * @param {number} endRow
   * @param {number} endCol
   */
  loadChunks(startRow: number, startCol: number, endRow: number, endCol: number) {
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        this.chunks.set(`${row}:${col}`, this.loadChunk(row, col));
      }
    }
  }

  /**
   * Loads and initializes a chunk at the given coordinates
   * @param {number} row
   * @param {number} col
   * @return {Chunk}
   */
  loadChunk(row: number, col: number): Chunk {
    const chunk = new Chunk(this.scene, this.generator, row, col);
    chunk.init(this);
    chunk.setVisible(false);

    return chunk;
  }

  /**
   * Update terrain
   * @param {THREE.Frustum} frustum
   * @param {THREE.Vector3} position
   * @param {number} delta
   * @param {number} tick
   */
  update(frustum: THREE.Frustum, position: THREE.Vector3, delta: number, tick: number) {
    this.getChunkCoordAt(this.chunk, position.x, position.z);

    this.start.col = this.chunk.col - CONFIG.MAX_VISIBLE_CHUNKS;
    this.start.row = this.chunk.row - CONFIG.MAX_VISIBLE_CHUNKS;
    this.end.col = this.chunk.col + CONFIG.MAX_VISIBLE_CHUNKS;
    this.end.row = this.chunk.row + CONFIG.MAX_VISIBLE_CHUNKS;

    if (this.start.col < 0) { this.start.col = 0; }
    if (this.start.row < 0) { this.start.row = 0; }
    if (this.end.col > Terrain.NCHUNKS_X) { this.end.col = Terrain.NCHUNKS_X; }
    if (this.end.row > Terrain.NCHUNKS_Z) { this.end.row = Terrain.NCHUNKS_Z; }

    // reset previously visible chunks
    for (const chunk of this.visibleChunks) {
      chunk.setVisible(false);

      if (!(chunk.col >= this.start.col &&
        chunk.col < this.start.col + (this.end.col - this.start.col) &&
        chunk.row >= this.start.row &&
        chunk.row < this.start.row + (this.end.row - this.start.row))) {
        chunk.clean();
      }
    }

    this.visibleChunks = [];

    // loop through all chunks in range
    for (let i = this.start.row; i < this.end.row; i++) {
      for (let j = this.start.col; j < this.end.col; j++) {
        const chunk = this.getChunk(i, j);
        if (!chunk) { continue; }

        // chunk is visible in frustum
        if (frustum.intersectsBox(chunk.getBbox())) {
          if (chunk.isDirty()) {
            chunk.populate();
          }

          // mark this chunk as visible for the next update
          chunk.setVisible(true);
          this.visibleChunks.push(chunk);
        }
      }
    }

    // update water distorsion effect
    (<THREE.ShaderMaterial>this.water.material).uniforms.time.value = tick;
    (<THREE.ShaderMaterial>this.water.material).needsUpdate = true;
  }

  /**
   * Handle user interaction between the terrain and mouse
   * @param {THREE.Raycaster} raycaster
   * @param {MOUSE_TYPES} interactionType
   */
  handleMouseInteraction(raycaster: THREE.Raycaster, interactionType: MOUSE_TYPES) {
    switch (interactionType) {
      case MOUSE_TYPES.MOVE:
        this.manageObjectPreview(raycaster);
        break;

      case MOUSE_TYPES.CLICK:
        this.placeObjectWithMouseClick(raycaster);
        break;

      default:
        break;
    }
  }

  /**
   * Place an object at the target location
   * @param {THREE.Raycaster} raycaster
   */
  placeObjectWithMouseClick(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.water, this.terrain], false);

    for (const intersection of intersections) {
      if (!this.previewObject) return;

      const chunk = this.getChunkAt(intersection.point.x, intersection.point.z);

      if (!chunk.canPlaceObject(this.previewObject) || !chunk.checkInteractionDistance(intersection.distance)) {
        Crosshair.shake();
        return;
      }

      chunk.placeObject(this.previewObject, { animate: true });

      this.objectAnimated = true;
      this.resetPreview();
      setTimeout(() => this.objectAnimated = false, Chunk.ANIMATION_DELAY + 200);

      break;
    }

  }

  /**
   * Handle mouse click in the 3d space
   * @param {THREE.Raycaster} raycaster
   */
  manageObjectPreview(raycaster: THREE.Raycaster) {
    if (this.objectAnimated) return;
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.water, this.terrain], false);

    if (!intersections.length && this.previewObject) {
      this.scene.remove(this.previewObject);
      this.previewActive = false;
    }

    for (const intersection of intersections) {
      const chunk = this.getChunkAt(intersection.point.x, intersection.point.z);
      const validDistance = chunk.checkInteractionDistance(intersection.distance);

      Crosshair.show(validDistance);
      Crosshair.switch(validDistance && this.previewActive);

      if (!validDistance || this.intersectBorder(intersection.point)) {
        // bail out if the target is ouside the valid range
        if (this.previewObject) {
          this.scene.remove(this.previewObject);
          this.previewActive = false;
        }
        return;
      }

      const biome = this.generator.getSubBiome(
        this.generator.computeElevationAt(intersection.point.x, intersection.point.z),
        this.generator.computeMoistureAt(intersection.point.x, intersection.point.z)
      );

      // if user fly over another biome or if preview item does not exist
      if (this.currentSubBiome !== biome || !this.previewItem || this.intersectionSurface !== intersection.object) {
        this.scene.remove(this.previewObject);
        this.resetPreview();

        this.currentSubBiome = biome;
        this.intersectionSurface = intersection.object;

        const item = chunk.pick(intersection.point.x, intersection.point.z, {
          force: true,
          float: (this.intersectionSurface === this.water)
        });
        if (!item) {
          // bail out if no item gets picked
          this.previewActive = false;
          return;
        }

        this.previewItem = item;
        this.previewObject = chunk.getObject(this.previewItem);

        this.scene.add(this.previewObject);
        this.previewActive = true;
      }

      const canPlaceObject = chunk.canPlaceObject(this.previewObject);
      Crosshair.switch(canPlaceObject);

      if (!this.previewActive) this.scene.add(this.previewObject);
      if (!canPlaceObject) {
        // bail out if the item cannot be placed at the current location
        this.scene.remove(this.previewObject);
        this.previewActive = false;
        return;
      }

      this.previewObject.position.set(intersection.point.x, intersection.point.y, intersection.point.z);
      break;
    }

  }

  /**
   * Retrieve the chunk coordinates at the given position
   * @param {Coord} out
   * @param {number} x
   * @param {number} z
   * @return {Coord}
   */
  getChunkCoordAt(out: Coord, x: number, z: number): Coord {
    out.row = (z / Chunk.DEPTH) | 0;
    out.col = (x / Chunk.WIDTH) | 0;

    return out;
  }

  /**
   * Retrieve the chunk at the given coordinates (row, col) if it exists
   * @param {number} row
   * @param {number} col
   * @return {Chunk|undefined}
   */
  getChunk(row: number, col: number): Chunk | undefined {
    return this.chunks.get(`${row}:${col}`);
  }

  /**
   * Retrieve the chunk at the given location (x, z) if it exists
   * @param {number} x
   * @param {number} z
   * @return {Chunk|undefined}
   */
  getChunkAt(x: number, z: number): Chunk {
    const p = this.getChunkCoordAt(new Coord(), x, z);
    return this.chunks.get(`${p.row}:${p.col}`);
  }

  /**
   * Retrieve the height at the given coordinates
   * @param {number} x
   * @param {number} z
   * @return {number}
   */
  getHeightAt(x: number, z: number): number {
    return this.generator.computeHeightAt(x, z);
  }

  /**
   * Construct a water border mesh
   * @param {number} nbRows
   * @param {number} nbCols
   * @param {Function} X Callback function returning the x component
   * @param {Function} Z Callback function returning the z component
   * @return {THREE.Mesh}
   */
  getWaterBorderMesh(nbRows: number, nbCols: number, X: Function, Z: Function, flipIndexes: boolean = false): THREE.Mesh {
    const geometry = new THREE.Geometry();

    const nbVerticesZ = nbCols + 1;
    const nbVerticesY = nbRows + 1;

    for (let col = 0; col < nbVerticesZ; col++) {
      for (let row = 0; row < nbVerticesY; row++) {
        const x = X(row, col);
        const z = Z(row, col);
        const bottom = -Chunk.HEIGHT / 2 + 2048; // Math.min(this.generator.computeHeightAt(x, z) - 2048, Chunk.SEA_LEVEL);

        const y = row === 0 ? this.generator.computeWaterHeightAt(x, z) : bottom;

        geometry.vertices.push(new THREE.Vector3(x, y, z));
      }
    }

    for (let col = 0; col < nbCols; col++) {
      for (let row = 0; row < nbRows; row++) {
        const a = row + nbVerticesY * col;
        const b = (row + 1) + nbVerticesY * col;
        const c = row + nbVerticesY * (col + 1);
        const d = (row + 1) + nbVerticesY * (col + 1);

        const f1 = new THREE.Face3(a, b, d);
        const f2 = new THREE.Face3(d, c, a);

        const x1 = (geometry.vertices[a].x + geometry.vertices[b].x + geometry.vertices[d].x) / 3;
        const x2 = (geometry.vertices[d].x + geometry.vertices[c].x + geometry.vertices[a].x) / 3;

        const z1 = (geometry.vertices[a].z + geometry.vertices[b].z + geometry.vertices[d].z) / 3;
        const z2 = (geometry.vertices[d].z + geometry.vertices[c].z + geometry.vertices[a].z) / 3;

        const m1 = this.generator.computeMoistureAt(x1, z1);
        const m2 = this.generator.computeMoistureAt(x2, z2);

        f1.color = this.generator.getWaterColor(m1);
        f2.color = this.generator.getWaterColor(m2);

        geometry.faces.push(f1);
        geometry.faces.push(f2);
      }
    }

    if (flipIndexes) {
      let tmp;
      for (let f = 0; f < geometry.faces.length; f++) {
        tmp = geometry.faces[f].clone();
        geometry.faces[f].a = tmp.c;
        geometry.faces[f].c = tmp.a;
      }
    }

    // need to tell the engine we updated the vertices
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    return new THREE.Mesh(geometry, WATER_MATERIAL);
  }

  /**
   * Construct a water border mesh
   * @param {number} nbRows
   * @param {number} nbCols
   * @param {Function} X Callback function returning the x component
   * @param {Function} Z Callback function returning the z component
   * @return {THREE.Mesh}
   */
  getBorderMesh(nbRows: number, nbCols: number, X: Function, Z: Function): THREE.Mesh {
    const geometry = new THREE.Geometry();

    const nbVerticesX = nbCols + 1;
    const nbVerticesY = nbRows + 1;

    for (let col = 0; col < nbVerticesX; col++) {
      for (let row = 0; row < nbVerticesY; row++) {
        const x = X(row, col);
        const z = Z(row, col);
        const y = row === 0 ? this.generator.computeHeightAt(x, z) : -Chunk.HEIGHT / 2;

        geometry.vertices.push(new THREE.Vector3(x, y, z));
      }
    }

    for (let col = 0; col < nbCols; col++) {
      for (let row = 0; row < nbRows; row++) {
        const a = row + nbVerticesY * col;
        const b = (row + 1) + nbVerticesY * col;
        const c = row + nbVerticesY * (col + 1);
        const d = (row + 1) + nbVerticesY * (col + 1);

        const f1 = new THREE.Face3(a, b, d);
        const f2 = new THREE.Face3(d, c, a);

        f1.color = this.generator.getSubBiome((-Chunk.HEIGHT / 2) / Chunk.MAX_TERRAIN_HEIGHT, 0).color;
        f2.color = this.generator.getSubBiome((-Chunk.HEIGHT / 2) / Chunk.MAX_TERRAIN_HEIGHT, 0).color;

        geometry.faces.push(f1);
        geometry.faces.push(f2);
      }
    }

    // need to tell the engine we updated the vertices
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    return new THREE.Mesh(geometry, TERRAIN_MATERIAL);
  }

  private getBottomMesh(): THREE.Mesh {
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, -Terrain.SIZE_Y / 2, 0));
    geometry.vertices.push(new THREE.Vector3(Terrain.SIZE_X, -Terrain.SIZE_Y / 2, 0));
    geometry.vertices.push(new THREE.Vector3(Terrain.SIZE_X, -Terrain.SIZE_Y / 2, Terrain.SIZE_Z));
    geometry.vertices.push(new THREE.Vector3(0, -Terrain.SIZE_Y / 2, Terrain.SIZE_Z));

    const f1 = new THREE.Face3(0, 1, 2);
    const f2 = new THREE.Face3(2, 0, 3);
    f1.color = this.generator.getSubBiome((-Terrain.SIZE_Y / 2) / Chunk.MAX_TERRAIN_HEIGHT, 0).color;
    f2.color = this.generator.getSubBiome((-Terrain.SIZE_Y / 2) / Chunk.MAX_TERRAIN_HEIGHT, 0).color;
    geometry.faces.push(f1);
    geometry.faces.push(f2);

    return new THREE.Mesh(geometry, TERRAIN_MATERIAL);
  }

  private initMeshes() {
    // main terrain with borders
    this.terrain = new THREE.Mesh(new THREE.Geometry(), TERRAIN_MATERIAL);
    this.terrain.frustumCulled = true;
    this.terrain.castShadow = false;
    this.terrain.receiveShadow = true;
    this.layers.add(this.terrain);

    this.terrainSide = new THREE.Mesh(new THREE.Geometry(), TERRAIN_SIDE_MATERIAL);
    this.terrainSide.frustumCulled = true;
    this.terrainSide.castShadow = false;
    this.terrainSide.receiveShadow = false;
    this.layers.add(this.terrainSide);

    // water
    this.water = new THREE.Mesh(new THREE.Geometry(), WATER_MATERIAL);
    this.water.frustumCulled = true;
    this.water.castShadow = false;
    this.water.receiveShadow = true;
    this.layers.add(this.water);

    if (CONFIG.DEBUG) this.layers.add(<THREE.Object3D>Terrain.createRegionWaterBoundingBoxHelper());

    this.scene.add(this.layers);
  }

  private initUnderwater() {
    underwaterSvc.observable$.subscribe(
      () => {
        if (this.previewObject) {
          this.scene.remove(this.previewObject);
          this.resetPreview();
        }
      }
    );
  }

  private resetPreview() {
    this.previewItem = null;
    this.previewObject = null;
    this.currentSubBiome = null;
    this.intersectionSurface = null;
  }

  private intersectBorder(intersection: THREE.Vector3): boolean {
    const offset = 200;
    return MathUtils.between(intersection.x, -offset, offset) || MathUtils.between(intersection.x, Terrain.SIZE_X - offset, Terrain.SIZE_X + offset) ||
      MathUtils.between(intersection.z, -offset, offset) || MathUtils.between(intersection.z, Terrain.SIZE_Z - offset, Terrain.SIZE_Z + offset);
  }

  public getWorld(): World {
    return this.world;
  }

  /**
   * Retrieve the whole region's bounding box
   * @return {THREE.Box3}
   */
  static createRegionBoundingBox(): THREE.Box3 {
    return new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        Terrain.SIZE_X / 2,
        Terrain.SIZE_Y / 2,
        Terrain.SIZE_Z / 2
      ),
      new THREE.Vector3(
        Terrain.SIZE_X,
        Terrain.SIZE_Y,
        Terrain.SIZE_Z
      ));
  }

  /**
   * Retrieve the region's water bounding box
   * @return {THREE.Box3}
   */
  static createRegionWaterBoundingBox(): THREE.Box3 {
    return new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(
        Terrain.SIZE_X / 2,
        Chunk.SEA_LEVEL - Terrain.SIZE_Y / 4,
        Terrain.SIZE_Z / 2
      ),
      new THREE.Vector3(
        Terrain.SIZE_X,
        Terrain.SIZE_Y / 2,
        Terrain.SIZE_Z
      ));
  }

  /**
   * Retrieve the region's bounding box helper
   * @param {THREE.Box3|null} bbox Region's bounding box (if not set it will be created)
   * @return {THREE.Box3Helper}
   */
  static createRegionBoundingBoxHelper(bbox: THREE.Box3 = null): THREE.Box3Helper {
    return new THREE.Box3Helper(bbox ? bbox : Terrain.createRegionBoundingBox(), 0xff0000);
  }

  /**
   * Retrieve the region's water bounding box helper
   * @param {THREE.Box3|null} bbox Region's bounding box (if not set it will be created)
   * @return {THREE.Box3Helper}
   */
  static createRegionWaterBoundingBoxHelper(bbox: THREE.Box3 = null): THREE.Box3Helper {
    return new THREE.Box3Helper(bbox ? bbox : Terrain.createRegionWaterBoundingBox(), 0x0000ff);
  }
}

export default Terrain;
