export interface IProgression {
  name: string;
  value: string;
  show: boolean;
  callback?: Function;
}

export interface IProgressionWithCount extends IProgression {
  count: number;
}
