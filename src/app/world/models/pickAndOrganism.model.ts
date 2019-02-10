import { IBiomeWeightedObject } from '@world/models/biomeWeightedObject.model';
import { IPick } from '@world/models/pick.model';

export interface IPickAndOrganism {
  organism: IBiomeWeightedObject;
  pick: IPick;
}
