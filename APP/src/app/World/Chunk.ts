import * as THREE from 'three';
import { DEFAULT_COLORS } from '@shared/constants/colors.constants';
import { IColor } from './../Shared/models/color.model';
import simplexNoise from 'simplex-noise';
import poissonDiskSampling from 'poisson-disk-sampling';

import Utils from '@shared/Utils';
import World from './World';
import Terrain from './Terrain';

class Chunk {
  static readonly MAX_CHUNK_HEIGHT: number = 2000;
  static readonly MIN_CHUNK_HEIGHT: number = -300;
  static readonly NROWS: number = 16;
  static readonly NCOLS: number = 16;
  static readonly CELL_SIZE: number = 64;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE;

  static readonly DEFAULT_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    wireframe: false,
    emissive: 0xffffff,
    emissiveIntensity: 0.075,
    specular: 0x252525,
    shininess: 12,
    reflectivity: 0.75,
    flatShading: true,
    vertexColors: THREE.FaceColors
  });

  static readonly DEFAULT_COLORS: IColor[] = DEFAULT_COLORS;

  readonly row: number;
  readonly col: number;

  readonly simplex: simplexNoise;

  mesh: THREE.Mesh;

  constructor(simplex: simplexNoise, row: number, col: number) {
    this.simplex = simplex;
    this.row = row;
    this.col = col;

    this.mesh = this.generate();
  }

  /**
   * Compute a point of the heightmap
   */
  static sumOctaves(simplex: simplexNoise, x: number, z: number): number {
    const nx = x / Chunk.CELL_SIZE - 0.5;
    const nz = z / Chunk.CELL_SIZE - 0.5;

    let e = 0;
    let amp = 1;
    let f = 0.00375;

    for (let i = 0; i < 8; i++) {
      e += amp * simplex.noise3D(f * nx, 1, f * nz);
      amp /= 1.85;
      f *= 1.95;
    }

    const noise = e * ((Chunk.MAX_CHUNK_HEIGHT + Chunk.MIN_CHUNK_HEIGHT) / 2 + (Chunk.MAX_CHUNK_HEIGHT - Chunk.MAX_CHUNK_HEIGHT) / 2);

    if (noise > 0) {
      return Math.pow(noise, 1.115);
    }
    return noise / 2.5;
  }

  populate(scene: THREE.Scene, terrain: Terrain) {
    const padding = 175;
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding * 2, Chunk.DEPTH - padding * 2], padding * 2, padding * 2, 30, Utils.rng);
    const points = pds.fill();
    const high = 5;
    const low = -150;

    console.log(points);

    points.forEach((point: number[]) => {
      const x = this.col * Chunk.WIDTH + point.shift() + padding;
      const z = this.row * Chunk.DEPTH + point.shift() + padding;
      const y = terrain.getHeightAt(x, z);
      if (y < high && y > low) {
        const f = Utils.randomFloat(0.8, 1.2);
        // const object = Utils.rng() > 0.10 ? World.LOADED_MODELS.get('spruce').clone() : World.LOADED_MODELS.get('red_mushroom').clone();
        const object = World.LOADED_MODELS.get('spruce').clone();

        object.rotateY(Utils.randomInt(0, 360));
        object.scale.set(object.scale.x * f, object.scale.y * f, object.scale.z * f);
        object.position.set(x, y, z);

        scene.add(object);
      }
    });
  }

  /**
   * Generate terrain geometry
   */
  buildGeometry(): THREE.Geometry {
    const geometry = new THREE.Geometry();

    const nbVerticesX = Chunk.NCOLS + 1;
    const nbVerticesZ = Chunk.NROWS + 1;

    // creates all our vertices
    for (let c = 0; c < nbVerticesX; c++) {
      const x = this.col * Chunk.WIDTH + c * Chunk.CELL_SIZE;
      for (let r = 0; r < nbVerticesZ; r++) {
        const z = this.row * Chunk.DEPTH + r * Chunk.CELL_SIZE;
        const y = Chunk.sumOctaves(this.simplex, x, z);

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        // geometry.colors.push(this.getColor(grad, y));
      }
    }

    // creates the associated faces with their indexes

    for (let col = 0; col < Chunk.NCOLS; col++) {
      for (let row = 0; row < Chunk.NROWS; row++) {
        const a = col + nbVerticesX * row;
        const b = (col + 1) + nbVerticesX * row;
        const c = col + nbVerticesX * (row + 1);
        const d = (col + 1) + nbVerticesX * (row + 1);

        const f1 = new THREE.Face3(a, b, d);
        const f2 = new THREE.Face3(d, c, a);

        // METHOD 1 : each face gets a color based on the average height of their vertices
        const y1 = (geometry.vertices[a].y + geometry.vertices[b].y + geometry.vertices[d].y) / 3;
        const y2 = (geometry.vertices[d].y + geometry.vertices[c].y + geometry.vertices[a].y) / 3;
        f1.color = this.getColor(Chunk.DEFAULT_COLORS, y1);
        f2.color = this.getColor(Chunk.DEFAULT_COLORS, y2);

        /*
        // METHOD 2 : each vertices gets a different color based on height and colors are interpolated
        f1.vertexColors[0] = geometry.colors[a];
        f1.vertexColors[1] = geometry.colors[b];
        f1.vertexColors[2] = geometry.colors[d];
        f2.vertexColors[0] = geometry.colors[d];
        f2.vertexColors[1] = geometry.colors[c];
        f2.vertexColors[2] = geometry.colors[a];
        */

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

    return geometry;
  }

  getColor(colors, y): THREE.Color {
    // normalize height value
    const level = (y - Chunk.MIN_CHUNK_HEIGHT) / (Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT);

    for (let i = 0; i < colors.length; i++) {
      if (!colors[i + 1] || level < colors[i + 1].stop) {
        return colors[i].color;
      }
    }
  }

  /**
   * Generate terrain mesh
   */
  generate(): THREE.Mesh {
    const geometry = this.buildGeometry();
    const mesh = new THREE.Mesh(geometry, Chunk.DEFAULT_MATERIAL);

    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.matrixAutoUpdate = false;

    return mesh;
  }
}

export default Chunk;
