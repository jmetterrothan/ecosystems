import * as THREE from 'three';

import Chunk from './Chunk';
import World from './World';
import BiomeGenerator from './BiomeGenerator';
import Coord from './Coord';
import TerrainMesh from '@mesh/TerrainMesh';
import WaterMesh from '@mesh/WaterMesh';
import Boids from '../Boids/Boids';

import { TERRAIN_MATERIAL } from '@materials/terrain.material';
import { WATER_MATERIAL, WATER_SIDE_MATERIAL } from '@materials/water.material';
import { CLOUD_MATERIAL } from '@materials/cloud.material';

class Terrain {
  static readonly NCHUNKS_X: number = 8;
  static readonly NCHUNKS_Z: number = 8;
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
  public water: THREE.Mesh;
  public waterSide: THREE.Mesh;
  public clouds: THREE.Mesh;

  private layers: THREE.Group;

  private boids: Boids;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.generator = new BiomeGenerator();
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
    this.layers.add(this.terrain);

    // water
    this.water = new THREE.Mesh(new THREE.Geometry(), WATER_MATERIAL);
    this.water.frustumCulled = true;
    this.layers.add(this.water);

    this.waterSide = new THREE.Mesh(new THREE.Geometry(), WATER_SIDE_MATERIAL);
    this.waterSide.frustumCulled = true;
    this.layers.add(this.waterSide);

    // clouds
    this.clouds = new THREE.Mesh(new THREE.Geometry(), CLOUD_MATERIAL);
    this.clouds.frustumCulled = true;
    this.layers.add(this.clouds);

    // this.layers.add(<THREE.Object3D>Terrain.createRegionWaterBoundingBoxHelper());

    this.scene.add(this.layers);

    this.boids = new Boids(this.scene, Terrain.SIZE_X, Chunk.SEA_LEVEL, Terrain.SIZE_Z);
    this.boids.generate();
  }

  /**
   * Loads region chunks
   */
  preload() {
    this.loadChunks(0, 0, Terrain.NCHUNKS_Z, Terrain.NCHUNKS_X);

    // borders
    const bt1 = this.getBorderMesh(1, Terrain.NCOLS, (row, col) => col * Chunk.CELL_SIZE_X, (row, col) => 0);
    const bt2 = this.getBorderMesh(1, Terrain.NCOLS, (row, col) => col * Chunk.CELL_SIZE_X, (row, col) => Terrain.SIZE_Z);
    const bt3 = this.getBorderMesh(1, Terrain.NROWS, (row, col) => Terrain.SIZE_X, (row, col) => col * Chunk.CELL_SIZE_Z);
    const bt4 = this.getBorderMesh(1, Terrain.NROWS, (row, col) => 0, (row, col) => col * Chunk.CELL_SIZE_Z);

    const bw1 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_X * 4, (row, col) => col * Chunk.WIDTH / 4, (row, col) => Terrain.SIZE_Z - WaterMesh.SEA_OFFSET);
    const bw2 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_X * 4, (row, col) => col * Chunk.WIDTH / 4, (row, col) => WaterMesh.SEA_OFFSET);
    const bw3 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_Z * 4, (row, col) => WaterMesh.SEA_OFFSET, (row, col) => col * Chunk.WIDTH / 4);
    const bw4 = this.getWaterBorderMesh(1, Terrain.NCHUNKS_Z * 4, (row, col) => Terrain.SIZE_X - WaterMesh.SEA_OFFSET, (row, col) => col * Chunk.DEPTH / 4);

    (<THREE.Geometry>this.terrain.geometry).mergeMesh(bt1);
    (<THREE.Geometry>this.terrain.geometry).mergeMesh(bt2);
    (<THREE.Geometry>this.terrain.geometry).mergeMesh(bt3);
    (<THREE.Geometry>this.terrain.geometry).mergeMesh(bt4);

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
    const chunk = new Chunk(this.generator, row, col);
    chunk.init(this, this.scene);

    // this.scene.add(Chunk.createBoundingBoxHelper(chunk.bbox));

    return chunk;
  }

  update(frustum: THREE.Frustum, position: THREE.Vector3) {
    this.getChunkCoordAt(this.chunk, position.x, position.z);

    this.start.col = this.chunk.col - World.MAX_VISIBLE_CHUNKS;
    this.start.row = this.chunk.row - World.MAX_VISIBLE_CHUNKS;
    this.end.col = this.chunk.col + World.MAX_VISIBLE_CHUNKS;
    this.end.row = this.chunk.row + World.MAX_VISIBLE_CHUNKS;

    if (this.start.col < 0) { this.start.col = 0; }
    if (this.start.row < 0) { this.start.row = 0; }
    if (this.end.col > Terrain.NCHUNKS_X) { this.end.col = Terrain.NCHUNKS_X; }
    if (this.end.row > Terrain.NCHUNKS_Z) { this.end.row = Terrain.NCHUNKS_Z; }

    this.boids.update();

    // reset previously visible chunks
    for (const chunk of this.visibleChunks) {
      chunk.setVisible(false);
      if (chunk.col < this.start.col || chunk.row < this.start.row || chunk.col > this.end.col || chunk.row > this.end.row) {
        chunk.clean(this.scene);
      }
    }

    this.visibleChunks = [];

    // loop through all chunks in range
    for (let i = this.start.row; i < this.end.row; i++) {
      for (let j = this.start.col; j < this.end.col; j++) {
        const chunk = this.getChunk(i, j);
        if (!chunk) { continue; }

        // chunk is visible in frustum
        if (frustum.intersectsBox(chunk.bbox)) {
          if (chunk.isDirty()) {
            chunk.populate(this.scene);
          }

          // mark this chunk as visible for the next update
          chunk.setVisible(true);
          this.visibleChunks.push(chunk);
        }
      }
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

  getBorderMesh(nbRows: number, nbCols: number, X: Function, Z: Function): THREE.Mesh {
    const geometry = new THREE.Geometry();

    const nbVerticesX = nbCols + 1;
    const nbVerticesY = nbRows + 1;

    for (let col = 0; col < nbVerticesX; col++) {
      for (let row = 0; row < nbVerticesY; row++) {
        const x = X(row, col);
        const z = Z(row, col);
        const y = row === 0 ? this.generator.computeHeightAt(x, z) : TerrainMesh.LOW - Chunk.SEA_DEPTH_THICKNESS;

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

        f1.color = this.generator.getBiome(TerrainMesh.LOW / Chunk.HEIGHT, 0).color;
        f2.color = this.generator.getBiome(TerrainMesh.LOW / Chunk.HEIGHT, 0).color;

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

    /**
   * Retrieve the region's bounding box
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
