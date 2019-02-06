import * as THREE from 'three';

import { IBiomeWeightedObject } from '@world/models/biomeWeightedObject.model';

export interface IBiome {
  name: string;
  color: THREE.Color;
  organisms: IBiomeWeightedObject[];
}
