import { ILowHigh } from './biomeWeightedObject.model';

export interface IPlaceObject {
  animate?: boolean;
  save?: boolean;
}

export interface IPickObject {
  force?: boolean; // bypass scarcity test
  float?: boolean;
}

export interface IStackReference {
  float: boolean;
  stackReference: string;
}

export interface ISpecialObject {
  underwater: boolean;
  float: boolean;
  stackReference: string;
  e?: ILowHigh;
  m?: ILowHigh;
}
