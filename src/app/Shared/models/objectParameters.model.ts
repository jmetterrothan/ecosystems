export interface IPlaceObject {
  animate?: boolean;
}

export interface IPickObject {
  force?: boolean; // bypass scarcity test
  float?: boolean;
}

export interface IStackReference {
  stackReference: string;
}
