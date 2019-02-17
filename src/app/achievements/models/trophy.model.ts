import { TROPHY_DIFFICULTY } from '@achievements/enums/trophyDIfficulty.enum';
import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';

export interface ITrophy {
  name: { key: string, options?: { [key: string]: number | string } };
  value: string;
  Icon: any;
  difficulty: TROPHY_DIFFICULTY;
  type: TROPHY_TYPE;
  checklist: IChecklistOption[];
  percentage?: number;
  unlocked?: boolean;
}

export interface IChecklistOption {
  name: string;
  value: string;
  limit?: number | number[];
  comparison?: COMPARISON_TYPE;
}
