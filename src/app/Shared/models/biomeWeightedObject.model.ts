
import { Object3D } from 'THREE';
export interface IBiomeWeightedObject {
  weight: number;
  name: string;
  low?: number;
  high?: number;
  scarcity?: number;
  scale?: { min: number; max: number; };
  e: any;
  m: any;
  object?: Object3D;
}
