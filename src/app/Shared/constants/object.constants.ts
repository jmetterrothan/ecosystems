import { IObject } from './../models/object.model';

import spruceObj from '../../../obj/spruce/spruce.obj';
import spruceMtl from '../../../obj/spruce/spruce.mtl';

import red_mushroomObj from '../../../obj/red_mushroom/red_mushroom.obj';
import red_mushroomMtl from '../../../obj/red_mushroom/red_mushroom.mtl';

const OBJECTS: [IObject] = [
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
