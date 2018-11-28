import { IObject } from './../models/object.model';

import spruceObj from '../../../public/assets/obj/tree/spruce.obj';
import spruceMtl from '../../../public/assets/obj/tree/spruce.mtl';

import red_mushroomObj from '../../../public/assets/obj/mushroom/red_mushroom.obj';
import red_mushroomMtl from '../../../public/assets/obj/mushroom/red_mushroom.mtl';

import brown_mushroomObj from '../../../public/assets/obj/mushroom/brown_mushroom.obj';
import brown_mushroomMtl from '../../../public/assets/obj/mushroom/brown_mushroom.mtl';

import cactus1Obj from '../../../public/assets/obj/cactus/cactus1.obj';
import cactus1Mtl from '../../../public/assets/obj/cactus/cactus1.mtl';

import cactus2Obj from '../../../public/assets/obj/cactus/cactus2.obj';
import cactus2Mtl from '../../../public/assets/obj/cactus/cactus2.mtl';

import cactus3Obj from '../../../public/assets/obj/cactus/cactus3.obj';
import cactus3Mtl from '../../../public/assets/obj/cactus/cactus3.mtl';

import cactus4Obj from '../../../public/assets/obj/cactus/cactus4.obj';
import cactus4Mtl from '../../../public/assets/obj/cactus/cactus4.mtl';

import rock1Obj from '../../../public/assets/obj/rock/rock1.obj';
import rock1Mtl from '../../../public/assets/obj/rock/rock1.mtl';

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
    name: 'brown_mushroom',
    obj: brown_mushroomObj,
    mtl: brown_mushroomMtl
  },
  {
    name: 'cactus1',
    obj: cactus1Obj,
    mtl: cactus1Mtl
  },
  {
    name: 'cactus2',
    obj: cactus2Obj,
    mtl: cactus2Mtl
  },
  {
    name: 'cactus3',
    obj: cactus3Obj,
    mtl: cactus3Mtl
  },
  {
    name: 'cactus4',
    obj: cactus4Obj,
    mtl: cactus4Mtl
  },
  {
    name: 'rock1',
    obj: rock1Obj,
    mtl: rock1Mtl
  },
];
