import { TROPHY_DIFFICULTY } from '@shared/enums/trophyDIfficulty.enum';
import { TROPHY_TYPE } from '@shared/enums/trophyType.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';

export interface ITrophy {
  name: { key: string, options?: { [key: string]: number | string } };
  value: string;
  img: string;
  difficulty: TROPHY_DIFFICULTY;
  type?: TROPHY_TYPE;
  checklist: IChecklistOption[];
}

export interface IChecklistOption {
  name: string;
  value: string;
  limit?: number | number[];
  comparison?: COMPARISON_TYPE;
}
