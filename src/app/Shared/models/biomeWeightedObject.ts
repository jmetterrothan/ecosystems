
import { Object3D } from 'THREE';
export interface IBiomeWeightedObject {
  weight: number;
  name: string;
  scarcity: number;
  scale: { min: number; max: number; };
  object?: Object3D;
}
