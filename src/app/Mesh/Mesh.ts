import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';
import Stack from '@shared/Stack';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { IChunkParameters } from '@shared/models/chunkParameters.model';

abstract class Mesh {
  static GEOMETRY_STACK = new Stack<THREE.Geometry>();

  readonly row: number;
  readonly col: number;

  protected low: number;
  protected high: number;

  protected moistureAverage: number;

  private readonly type: MESH_TYPES;
  protected readonly parameters: IChunkParameters;
  protected generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number, type: MESH_TYPES, parameters: IChunkParameters) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.type = type;
    this.parameters = parameters;

    this.low = null;
    this.high = null;
  }

  abstract getY(x?: number, z?: number): number;
  abstract getMaterial(): THREE.Material;
  abstract buildGeometry(): THREE.Geometry;

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
