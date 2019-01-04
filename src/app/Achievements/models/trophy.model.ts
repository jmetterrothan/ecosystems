import { TROPHY_DIFFICULTY } from '@shared/enums/trophyDIfficulty.enum';
import { IProgressionStorageKeys } from '@achievements/models/progressionStorageKeys.model';

export interface ITrophy {
  name: string;
  img: string;
  completed: boolean;
  difficulty: TROPHY_DIFFICULTY;
  checklist: IChecklistOption[];
}

export interface IChecklistOption {
  name: string;
  value: string;
  limit?: number | number[];
}
