import simplexNoise from 'simplex-noise';
import * as THREE from 'three';

import Terrain, { TerrainParameters } from './Terrain';
import ITerrainParameters from '../models/ITerrainParameters';

class Chunk
{
  public static readonly NROWS = 4;
  public static readonly NCOLS = 4;
  public static readonly CELL_SIZE = 32;

  public static readonly WIDTH = Chunk.NCOLS * Chunk.CELL_SIZE;
  public static readonly DEPTH = Chunk.NROWS * Chunk.CELL_SIZE;

  public readonly terrain: Terrain;
  public readonly row: number;
  public readonly col: number;

  public mesh: THREE.Mesh;

  constructor(simplex: simplexNoise, parameters: ITerrainParameters, row: number, col: number) {
    this.simplex = simplex;
    this.parameters = parameters;
    this.row = row;
    this.col = col;

    this.mesh = this.generate();
  }

  /**
   * Compute a point of the heightmap
   */
  sumOctaves(x: number, z: number) : number {
    let maxAmp = 0;
    let amp = 1;
    let freq = this.parameters.scale;
    let noise = 0;

    for (let i = 0; i < this.parameters.octaves; i++) {
      noise += this.simplex.noise2D(x * freq, z * freq) * amp;
      maxAmp += amp;
      amp *= this.parameters.persistence;
      freq *= this.parameters.lacunarity;
    }

    noise /= maxAmp;

    // keeps the output bewteen the high and low values
    noise *= (this.parameters.high - this.parameters.low) / 2 + (this.parameters.high + this.parameters.low) / 2;

    return noise;
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
        const y = this.sumOctaves(x, z);

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        geometry.colors.push(this.getColor(y));
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
        // const y1 = (geometry.vertices[a].y + geometry.vertices[b].y + geometry.vertices[d].y) / 3;
        // const y2 = (geometry.vertices[d].y + geometry.vertices[c].y + geometry.vertices[a].y) / 3;
        // f1.color = this.getColor(y1);
        // f2.color = this.getColor(y2);

        // METHOD 2 : each vertices gets a different color based on height and colors are interpolated
        f1.vertexColors[0] = geometry.colors[a];
        f1.vertexColors[1] = geometry.colors[b];
        f1.vertexColors[2] = geometry.colors[d];
        f2.vertexColors[0] = geometry.colors[d];
        f2.vertexColors[1] = geometry.colors[c];
        f2.vertexColors[2] = geometry.colors[a];

        geometry.faces.push(f1);
        geometry.faces.push(f2);
      }
    }

    // need to tell the engine we updated the vertices
    // geometry.verticesNeedUpdate = true;
    // geometry.colorsNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate	= true;

    return geometry;
  }

  getColor(y) {
    const level = y / (this.parameters.high + Math.abs(this.parameters.low));

    // TODO: relative to the biome / relative to height
    if (level > 0.9) {
      return new THREE.Color(0xffffff);
    }
    if (level > 0.5) {
      return new THREE.Color(0x645148);
    }
    if (level > 0) {
      return new THREE.Color(0x93c54b);
    }

    return new THREE.Color(0xf0e68c);
  }

  /**
   * Generate terrain mesh
   */
  generate(): THREE.Mesh {
    const material = new THREE.MeshPhongMaterial({
      wireframe: false,
      emissive: 0xffffff,
      emissiveIntensity: 0.1,
      specular: 0xffffff,
      shininess: 4,
      flatShading: true,
      vertexColors: THREE.FaceColors
    });

    const geometry = this.buildGeometry();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.dynamic = true;

    return mesh;
  }
}

export default Chunk;
