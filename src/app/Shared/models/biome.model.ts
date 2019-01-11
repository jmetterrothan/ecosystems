import * as THREE from 'three';

import { IBiomeWeightedObject } from '@shared/models/biomeWeightedObject.model';

export interface IBiome {
  color: THREE.Color;
  organisms: IBiomeWeightedObject[];
}
