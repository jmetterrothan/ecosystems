import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';

export interface IProgression {
  name: string;
  value: string;
  show: boolean;
  type?: TROPHY_TYPE;
}

export interface IProgressionWithCount extends IProgression {
  count: number;
}
