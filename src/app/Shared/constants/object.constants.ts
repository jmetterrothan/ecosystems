import { IObject } from './../models/object.model';

import spruceObj from '@objmodels/tree/spruce.obj';
import spruceMtl from '@objmodels/tree/spruce.mtl';

import red_mushroomObj from '@objmodels/mushroom/red_mushroom.obj';
import red_mushroomMtl from '@objmodels/mushroom/red_mushroom.mtl';

import brown_mushroomObj from '@objmodels/mushroom/brown_mushroom.obj';
import brown_mushroomMtl from '@objmodels/mushroom/brown_mushroom.mtl';

import cactus1Obj from '@objmodels/cactus/cactus1.obj';
import cactus1Mtl from '@objmodels/cactus/cactus1.mtl';

import cactus2Obj from '@objmodels/cactus/cactus2.obj';
import cactus2Mtl from '@objmodels/cactus/cactus2.mtl';

import cactus3Obj from '@objmodels/cactus/cactus3.obj';
import cactus3Mtl from '@objmodels/cactus/cactus3.mtl';

import cactus4Obj from '@objmodels/cactus/cactus4.obj';
import cactus4Mtl from '@objmodels/cactus/cactus4.mtl';

import rock1Obj from '@objmodels/rock/rock1.obj';
import rock1Mtl from '@objmodels/rock/rock1.mtl';

import lilypadObj from '@objmodels/flower/lilypad.obj';
import lilypadMtl from '@objmodels/flower/lilypad.mtl';

import mangroveObj from '@objmodels/tree/mangrove.obj';
import mangroveMtl from '@objmodels/tree/mangrove.mtl';

export const OBJECTS: IObject[] = [
  {
    name: 'spruce',
    obj: spruceObj,
    mtl: spruceMtl
  },
  {
    name: 'mangrove',
    obj: mangroveObj,
    mtl: mangroveMtl,
    doubleSide: true
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
  {
    name: 'lilypad',
    obj: lilypadObj,
    mtl: lilypadMtl,
    doubleSide: true
  },
];
