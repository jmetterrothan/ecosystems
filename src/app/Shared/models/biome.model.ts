import { IBiomeWeightedObject } from './biomeWeightedObject.model';

export interface IBiome {
  color: THREE.Color;
  organisms: IBiomeWeightedObject[];
}
