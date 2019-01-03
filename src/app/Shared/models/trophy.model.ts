export interface ITrophy {
  name: string;
  img: string;
  difficulty: number;
  checklist: ITrophyChecklist[];
}

export interface ITrophyChecklist {
  name: string;
}
