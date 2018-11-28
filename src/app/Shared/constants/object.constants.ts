import { IObject } from './../models/object.model';

import spruceObj from '../../../public/assets/obj/spruce/spruce.obj';
import spruceMtl from '../../../public/assets/obj/spruce/spruce.mtl';

import red_mushroomObj from '../../../public/assets/obj/red_mushroom/red_mushroom.obj';
import red_mushroomMtl from '../../../public/assets/obj/red_mushroom/red_mushroom.mtl';

import cactusObj from '../../../public/assets/obj/cactus/cactus.obj';
import cactusMtl from '../../../public/assets/obj/cactus/cactus.mtl';

import cactus2Obj from '../../../public/assets/obj/cactus2/cactus2.obj';
import cactus2Mtl from '../../../public/assets/obj/cactus2/cactus2.mtl';

export const OBJECTS: IObject[] = [
  {
    name: 'spruce',
    obj: spruceObj,
    mtl: spruceMtl
  },
  {
    name: 'red_mushroom',
    obj: red_mushroomObj,
    mtl: red_mushroomMtl
  },
  {
    name: 'cactus',
    obj: cactusObj,
    mtl: cactusMtl
  },
  {
    name: 'cactus2',
    obj: cactus2Obj,
    mtl: cactus2Mtl
  },
];
