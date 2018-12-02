import * as THREE from 'three';

import { IMinMax } from '@shared/models/biomeWeightedObject.model';

import { CLOUD_MATERIAL } from '@shared/materials/cloud.material';
import MathUtils from '@shared/utils/Math.utils';

class Clouds {

  mesh: THREE.Mesh;

  visibleClouds: THREE.Mesh[];

  private static readonly scaleX: IMinMax = { min: 0.8, max: 2 };
  private static readonly scaleY: IMinMax = { min: 0.9, max: 1.2 };
  private static readonly scaleZ: IMinMax = { min: 0.8, max: 2 };

  constructor() {
    this.visibleClouds = [];

    this.mesh = this.createCloud();
  }

  pick(): THREE.Mesh {
    const mesh = this.mesh.clone();

    mesh.scale.set(
      MathUtils.randomInt(Clouds.scaleX.min, Clouds.scaleX.max),
      MathUtils.randomInt(Clouds.scaleY.min, Clouds.scaleY.max),
      MathUtils.randomInt(Clouds.scaleZ.min, Clouds.scaleZ.max)
    );
    mesh.rotateY(Math.PI / Math.round(Math.random()) + 1);
    mesh.position.set(0, 4000, 0);

    this.visibleClouds.push(mesh);

    return mesh;
  }

  private createCloud(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1000, 120, 1000, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, CLOUD_MATERIAL);

    return mesh;
  }

}

export default Clouds;
