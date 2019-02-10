import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';

import { IChunkParameters } from '@world/models/chunkParameters.model';

import { MeshTypes } from '@mesh/enums/mesh.enum';

abstract class Mesh {
  readonly row: number;
  readonly col: number;

  protected low: number;
  protected high: number;

  protected moistureAverage: number;

  private readonly type: MeshTypes;
  protected readonly parameters: IChunkParameters;
  protected generator: BiomeGenerator;

  /**
   * Mesh constructor
   * @param {BiomeGenerator} generator
   * @param {number} row
   * @param {number} col
   * @param {MeshTypes} type
   * @param {IChunkParameters} parameters
   */
  constructor(generator: BiomeGenerator, row: number, col: number, type: MeshTypes, parameters: IChunkParameters) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.type = type;
    this.parameters = parameters;

    this.low = null;
    this.high = null;
  }

  /**
   * Return height at (x, z) coordinates
   * @param {number} x
   * @param {number} z
   * @return {number}
   */
  abstract getY(x?: number, z?: number): number;

  /**
   * Returns mesh material
   * @return {THREE.Material}
   */
  abstract getMaterial(): THREE.Material;

  /**
   * Returns mesh geometry
   * @return {THREE.Geometry}
   */
  abstract buildGeometry(): THREE.Geometry;

  /**
   * @return {THREE.Mesh}
   */
  generate(): THREE.Mesh {
    const mesh = new THREE.Mesh(this.buildGeometry(), this.getMaterial());

    mesh.frustumCulled = true;
    mesh.matrixAutoUpdate = false;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    return mesh;
  }
}

export default Mesh;
