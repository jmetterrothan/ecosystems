export interface IMinMax {
  min: number;
  max: number;
}

export interface ILowHigh {
  low: number;
  high: number;
}

export interface IBiomeWeightedObject {
  weight: number;
  name: string[];
  scarcity: number;
  scale: IMinMax;
  e: number | ILowHigh;
  m: number | ILowHigh;
  low?: number;
  high?: number;
  float: boolean;
}
