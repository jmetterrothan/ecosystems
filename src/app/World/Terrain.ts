import * as THREE from 'three';
import 'three/examples/js/postprocessing/OutlinePass';

import Chunk from './Chunk';
import World from './World';
import BiomeGenerator from './BiomeGenerator';
import Coord from './Coord';
import WaterMesh from '@mesh/WaterMesh';
import Boids from '../Boids/Boids';
import { MOUSE_TYPES } from '@shared/enums/mouse.enum';

import OceanBiome from '@world/Biomes/OceanBiome';

import { TERRAIN_MATERIAL, TERRAIN_SIDE_MATERIAL } from '@materials/terrain.material';
import { WATER_MATERIAL, WATER_SIDE_MATERIAL } from '@materials/water.material';
import { CLOUD_MATERIAL } from '@materials/cloud.material';
import { IBiome } from '@shared/models/biome.model';
import { IPick } from '@shared/models/pick.model';
import Crosshair from '../UI/Crosshair';

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
  private generator: BiomeGenerator;
  public terrain: THREE.Mesh;
  public terrainSide: THREE.Mesh;
  public water: THREE.Mesh;
  public waterSide: THREE.Mesh;
  public clouds: THREE.Mesh;

  private layers: THREE.Group;

  private boidsAllowed: boolean;
  private boids: Boids;

  private previewItem: IPick;
  private previewObject: THREE.Object3D;
  private previewActive: boolean;
  private lastBiome: IBiome;

  /**
   * Terrain constructor
   * @param {THREE.Scene} scene
   */
  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.generator = new BiomeGenerator();
    this.boidsAllowed = this.generator.getBiome() instanceof OceanBiome;

    this.chunks = new Map<string, Chunk>();
    this.visibleChunks = [];

    this.layers = new THREE.Group();

    this.chunk = new Coord();
    this.start = new Coord();
    this.end = new Coord();

  }

  init() {
    // main terrain with borders
    this.terrain = new THREE.Mesh(new THREE.Geometry(), TERRAIN_MATERIAL);
    this.terrain.frustumCulled = true;
    this.terrain.castShadow = true;
    this.terrain.receiveShadow = true;
    this.layers.add(this.terrain);

    // water
    this.water = new THREE.Mesh(new THREE.Geometry(), WATER_MATERIAL);
    this.water.frustumCulled = true;
    this.water.castShadow = true;
    this.water.receiveShadow = true;
    this.layers.add(this.water);

    this.terrainSide = new THREE.Mesh(new THREE.Geometry(), TERRAIN_SIDE_MATERIAL);
    this.terrainSide.frustumCulled = true;
    this.terrainSide.castShadow = false;
    this.terrainSide.receiveShadow = false;
    this.layers.add(this.terrainSide);

    this.waterSide = new THREE.Mesh(new THREE.Geometry(), WATER_SIDE_MATERIAL);
    this.waterSide.frustumCulled = true;
    this.waterSide.castShadow = false;
    this.waterSide.receiveShadow = false;
    this.layers.add(this.waterSide);

    // clouds
    this.clouds = new THREE.Mesh(new THREE.Geometry(), CLOUD_MATERIAL);
    this.clouds.frustumCulled = true;
    this.clouds.castShadow = true;
    this.clouds.receiveShadow = true;
    this.layers.add(this.clouds);

    // this.layers.add(<THREE.Object3D>Terrain.createRegionWaterBoundingBoxHelper());

    this.scene.add(this.layers);

    if (this.boidsAllowed) {
      this.boids = new Boids(
        this.scene,
        new THREE.Vector3(Terrain.SIZE_X, 20000, Terrain.SIZE_Z),
        new THREE.Vector3(Terrain.SIZE_X / 2, Chunk.SEA_LEVEL - 25000, Terrain.SIZE_Z / 2),
        50
      );
      this.boids.generate();
    }
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

    const bw1 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_X * 4, (row, col) => col * Chunk.WIDTH / 4, (row, col) => Terrain.SIZE_Z - WaterMesh.SEA_OFFSET);
    const bw2 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_X * 4, (row, col) => col * Chunk.WIDTH / 4, (row, col) => WaterMesh.SEA_OFFSET);
    const bw3 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_Z * 4, (row, col) => WaterMesh.SEA_OFFSET, (row, col) => col * Chunk.WIDTH / 4);
    const bw4 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_Z * 4, (row, col) => Terrain.SIZE_X - WaterMesh.SEA_OFFSET, (row, col) => col * Chunk.DEPTH / 4);

    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt1);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt2);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt3);
    (<THREE.Geometry>this.terrainSide.geometry).mergeMesh(bt4);

    (<THREE.Geometry>this.waterSide.geometry).mergeMesh(bw1);
    (<THREE.Geometry>this.waterSide.geometry).mergeMesh(bw2);
    (<THREE.Geometry>this.waterSide.geometry).mergeMesh(bw3);
    (<THREE.Geometry>this.waterSide.geometry).mergeMesh(bw4);
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

  update(frustum: THREE.Frustum, position: THREE.Vector3, delta: number) {
    this.getChunkCoordAt(this.chunk, position.x, position.z);

    this.start.col = this.chunk.col - World.MAX_VISIBLE_CHUNKS;
    this.start.row = this.chunk.row - World.MAX_VISIBLE_CHUNKS;
    this.end.col = this.chunk.col + World.MAX_VISIBLE_CHUNKS;
    this.end.row = this.chunk.row + World.MAX_VISIBLE_CHUNKS;

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

    // entities update
    if (this.boidsAllowed) this.boids.update(delta);
  }

  handleMouseInteraction(raycaster: THREE.Raycaster, interactionType: MOUSE_TYPES) {
    switch (interactionType) {
      case MOUSE_TYPES.MOVE:
        this.manageObjectPreview(raycaster);
        break;

      case MOUSE_TYPES.CLICK:
        this.placeObject(raycaster);
        break;

      default:
        break;
    }
  }

  placeObject(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.water, this.terrain], false);

    for (const intersection of intersections) {
      if (!this.previewObject) return;

      const chunk = this.getChunkAt(intersection.point.x, intersection.point.z);

      if (!chunk.canPlaceObject(this.previewObject) || !chunk.checkInteractionDistance(intersection.distance)) {
        chunk.repurposeObject(this.previewObject);
        Crosshair.shake();
        return;
      }

      chunk.placeObject(this.previewObject, { animate: true });

      this.resetPreview();

      break;
    }

  }

  /**
   * Handle mouse click in the 3d space
   * @param {THREE.Raycaster} raycaster
   */
  manageObjectPreview(raycaster: THREE.Raycaster) {
    const intersections: THREE.Intersection[] = raycaster.intersectObjects([this.water, this.terrain], false);

    for (const intersection of intersections) {
      const chunk = this.getChunkAt(intersection.point.x, intersection.point.z);
      const validDistance = chunk.checkInteractionDistance(intersection.distance);

      Crosshair.switch(validDistance);

      if (!validDistance) {
        if (this.previewObject) {
          this.scene.remove(this.previewObject);
          this.previewActive = false;
        }
        return;
      }

      const biome = this.generator.getBiomeInformations(
        intersection.point.y,
        this.generator.computeMoistureAt(intersection.point.x, intersection.point.z)
      );

      // if user fly over another biome or if preview item does not exist
      if (this.lastBiome !== biome || !this.previewItem) {
        this.scene.remove(this.previewObject);
        this.resetPreview();

        this.lastBiome = biome;

        const item = chunk.pick(intersection.point.x, intersection.point.z, { force: true });
        if (!item) return;

        this.previewItem = item;
        this.previewObject = chunk.getObject(this.previewItem);

        this.scene.add(this.previewObject);
        this.previewActive = true;
      }

      const canPlaceObject = chunk.canPlaceObject(this.previewObject);
      Crosshair.switch(canPlaceObject);

      if (!this.previewActive) this.scene.add(this.previewObject);
      if (!canPlaceObject) {
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
  getWaterBorderMesh(nbRows: number, nbCols: number, X: Function, Z: Function): THREE.Mesh {
    const geometry = new THREE.Geometry();

    const nbVerticesZ = nbCols + 1;
    const nbVerticesY = nbRows + 1;

    for (let col = 0; col < nbVerticesZ; col++) {
      for (let row = 0; row < nbVerticesY; row++) {
        const x = X(row, col);
        const z = Z(row, col);

        const y = row === 0 ? this.generator.computeWaterHeightAt(x, z) : this.generator.computeHeightAt(x, z) - 2500;

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

    // need to tell the engine we updated the vertices
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    return new THREE.Mesh(geometry, WATER_SIDE_MATERIAL);
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

        f1.color = this.generator.getBiomeInformations((-Chunk.HEIGHT / 2) / Chunk.MAX_TERRAIN_HEIGHT, 0).color;
        f2.color = this.generator.getBiomeInformations((-Chunk.HEIGHT / 2) / Chunk.MAX_TERRAIN_HEIGHT, 0).color;

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

  private resetPreview() {
    this.previewItem = null;
    this.previewObject = null;
    this.lastBiome = null;
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
        Chunk.SEA_LEVEL / 2,
        Terrain.SIZE_Z / 2
      ),
      new THREE.Vector3(
        Terrain.SIZE_X,
        Chunk.SEA_LEVEL,
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
