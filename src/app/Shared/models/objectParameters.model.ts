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
