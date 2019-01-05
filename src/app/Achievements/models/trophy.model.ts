import { TROPHY_DIFFICULTY } from '@shared/enums/trophyDIfficulty.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';
import { IProgressionStorageKeys } from '@achievements/models/progressionStorageKeys.model';

export interface ITrophy {
  name: { key: string, options?: { [key: string]: number | string } };
  value: string;
  img: string;
  difficulty: TROPHY_DIFFICULTY;
  checklist: IChecklistOption[];
}

export interface IChecklistOption {
  name: string;
  value: string;
  limit?: number | number[];
  comparison?: COMPARISON_TYPE;
}
