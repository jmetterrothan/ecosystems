import { IEventCategory, IEventAction } from '@shared/models/monitoring.model';

export const EVENT_CATEGORY: IEventCategory = {
  game: 'game',
  object: 'object',
  biome: 'biome',
  trophy: 'trophy'
};

export const EVENT_ACTION: IEventAction = {
  placed: 'placed',
  played: 'played',
  visited: 'visited',
  completed: 'completed'
};
