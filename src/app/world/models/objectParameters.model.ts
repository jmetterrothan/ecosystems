import { ILowHigh } from './biomeWeightedObject.model';
import { OBJ_TYPE } from '@app/shared/enums/objectTypes.enum';

export interface IPlaceObject {
  animate?: boolean;
  save?: boolean;
  online?: boolean;
}

export interface IRemoveObject {
  online?: boolean;
  animate?: boolean;
}

export interface IPickObject {
  force?: boolean; // bypass scarcity test
  isOnWater?: boolean;
}

export interface IStackReference {
  float: boolean;
  stackReference: string;
  type: OBJ_TYPE;
}

export enum ISpecialObjectCanPlaceIn {
  LAND,
  WATER,
  BOTH
}

export interface ISpecialObject {
  underwater: ISpecialObjectCanPlaceIn;
  float: boolean;
  stackReference: string;
  rotation?: THREE.Vector3;
  position?: THREE.Vector3;
  e?: ILowHigh;
  m?: ILowHigh;
}
