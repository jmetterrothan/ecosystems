import { IObject } from './../models/object.model';

import spruceObj from '../../../public/assets/obj/spruce/spruce.obj';
import spruceMtl from '../../../public/assets/obj/spruce/spruce.mtl';

import red_mushroomObj from '../../../public/assets/obj/red_mushroom/red_mushroom.obj';
import red_mushroomMtl from '../../../public/assets/obj/red_mushroom/red_mushroom.mtl';

const OBJECTS: IObject[] = [
  {
    name: 'spruce',
    obj: spruceObj,
    mtl: spruceMtl
  },
  {
    name: 'red_mushroom',
    obj: red_mushroomObj,
    mtl: red_mushroomMtl
  }
];

export default OBJECTS;
