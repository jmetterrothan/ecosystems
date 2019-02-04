import { ILowHigh } from './biomeWeightedObject.model';
import { OBJ_TYPE } from '@app/shared/enums/objectTypes.enum';

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
  type: OBJ_TYPE;
}

export interface ISpecialObject {
  underwater: boolean;
  float: boolean;
  stackReference: string;
  e?: ILowHigh;
  m?: ILowHigh;
}
