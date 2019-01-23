export interface IProgression {
  name: string;
  value: string;
  show: boolean;
}

export interface IProgressionWithCount extends IProgression {
  count: number;
}
