import { IObject } from '@shared/models/object.model';

import fish1Obj from '@objmodels/fauna/fish1.obj';
import fish1Mtl from '@objmodels/fauna/fish1.mtl';

import fish2Obj from '@objmodels/fauna/fish2.obj';
import fish2Mtl from '@objmodels/fauna/fish2.mtl';

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

import rock2Obj from '@objmodels/rock/rock2.obj';
import rock2Mtl from '@objmodels/rock/rock2.mtl';

import rock3Obj from '@objmodels/rock/rock3.obj';
import rock3Mtl from '@objmodels/rock/rock3.mtl';

import rock4Obj from '@objmodels/rock/rock4.obj';
import rock4Mtl from '@objmodels/rock/rock4.mtl';

import lilypadObj from '@objmodels/flower/lilypad.obj';
import lilypadMtl from '@objmodels/flower/lilypad.mtl';

import mangroveObj from '@objmodels/tree/mangrove.obj';
import mangroveMtl from '@objmodels/tree/mangrove.mtl';

import jungle_treeObj from '@objmodels/tree/jungle_tree.obj';
import jungle_treeMtl from '@objmodels/tree/jungle_tree.mtl';

import jungle_tree2Obj from '@objmodels/tree/jungle_tree2.obj';
import jungle_tree2Mtl from '@objmodels/tree/jungle_tree2.mtl';

import tulipObj from '@objmodels/flower/tulip.obj';
import tulipMtl from '@objmodels/flower/tulip.mtl';

import daisyObj from '@objmodels/flower/daisy.obj';
import daisyMtl from '@objmodels/flower/daisy.mtl';

import palm_treeObj from '@objmodels/tree/palm_tree.obj';
import palm_treeMtl from '@objmodels/tree/palm_tree.mtl';

import banana_treeObj from '@objmodels/tree/banana_tree.obj';
import banana_treeMtl from '@objmodels/tree/banana_tree.mtl';

import bushObj from '@objmodels/tree/bush.obj';
import bushMtl from '@objmodels/tree/bush.mtl';

import stackObj from '@objmodels/tree/stack.obj';
import stackMtl from '@objmodels/tree/stack.mtl';

import pinkObj from '@objmodels/tree/pink.obj';
import pinkMtl from '@objmodels/tree/pink.mtl';

import blueObj from '@objmodels/tree/blue.obj';
import blueMtl from '@objmodels/tree/blue.mtl';

import diamondObj from '@objmodels/tree/diamond.obj';
import diamondMtl from '@objmodels/tree/diamond.mtl';

import algeaObj from '@objmodels/flower/algea.obj';
import algeaMtl from '@objmodels/flower/algea.mtl';

import highlands_treeObj from '@objmodels/tree/highlands_tree.obj';
import highlands_treeMtl from '@objmodels/tree/highlands_tree.mtl';

import birchObj from '@objmodels/tree/birch.obj';
import birchMtl from '@objmodels/tree/birch.mtl';

import blue_mushroomObj from '@objmodels/mushroom/blue_mushroom.obj';
import blue_mushroomMtl from '@objmodels/mushroom/blue_mushroom.mtl';

import pink_mushroomObj from '@objmodels/mushroom/pink_mushroom.obj';
import pink_mushroomMtl from '@objmodels/mushroom/pink_mushroom.mtl';

import cloud1Obj from '@objmodels/cloud/cloud1.obj';
import cloud1Mtl from '@objmodels/cloud/cloud1.mtl';

import cloud2Obj from '@objmodels/cloud/cloud2.obj';
import cloud2Mtl from '@objmodels/cloud/cloud2.mtl';

import cloud3Obj from '@objmodels/cloud/cloud3.obj';
import cloud3Mtl from '@objmodels/cloud/cloud3.mtl';

import cloud4Obj from '@objmodels/cloud/cloud4.obj';
import cloud4Mtl from '@objmodels/cloud/cloud4.mtl';

export const OBJECTS: IObject[] = [
  {
    name: 'fish2',
    obj: fish2Obj,
    mtl: fish2Mtl,
    doubleSide: true
  },
  {
    name: 'fish1',
    obj: fish1Obj,
    mtl: fish1Mtl,
    doubleSide: true
  },
  {
    name: 'cloud1',
    obj: cloud1Obj,
    mtl: cloud1Mtl
  },
  {
    name: 'cloud2',
    obj: cloud2Obj,
    mtl: cloud2Mtl
  },
  {
    name: 'cloud3',
    obj: cloud3Obj,
    mtl: cloud3Mtl
  },
  {
    name: 'cloud4',
    obj: cloud4Obj,
    mtl: cloud4Mtl
  },
  {
    name: 'pink_mushroom',
    obj: pink_mushroomObj,
    mtl: pink_mushroomMtl
  },
  {
    name: 'blue_mushroom',
    obj: blue_mushroomObj,
    mtl: blue_mushroomMtl
  },
  {
    name: 'birch',
    obj: birchObj,
    mtl: birchMtl
  },
  {
    name: 'highlands_tree',
    obj: highlands_treeObj,
    mtl: highlands_treeMtl,
    doubleSide: true
  },
  {
    name: 'algea',
    obj: algeaObj,
    mtl: algeaMtl,
    doubleSide: true
  },
  {
    name: 'diamond',
    obj: diamondObj,
    mtl: diamondMtl
  },
  {
    name: 'blue',
    obj: blueObj,
    mtl: blueMtl
  },
  {
    name: 'pink',
    obj: pinkObj,
    mtl: pinkMtl
  },
  {
    name: 'stack',
    obj: stackObj,
    mtl: stackMtl
  },
  {
    name: 'bush',
    obj: bushObj,
    mtl: bushMtl
  },
  {
    name: 'banana_tree',
    obj: banana_treeObj,
    mtl: banana_treeMtl,
    doubleSide: true
  },
  {
    name: 'palm_tree',
    obj: palm_treeObj,
    mtl: palm_treeMtl,
    doubleSide: true
  },
  {
    name: 'daisy',
    obj: daisyObj,
    mtl: daisyMtl
  },
  {
    name: 'tulip',
    obj: tulipObj,
    mtl: tulipMtl
  },
  {
    name: 'spruce',
    obj: spruceObj,
    mtl: spruceMtl
  },
  {
    name: 'jungle_tree',
    obj: jungle_treeObj,
    mtl: jungle_treeMtl
  },
  {
    name: 'jungle_tree2',
    obj: jungle_tree2Obj,
    mtl: jungle_tree2Mtl
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
    name: 'rock4',
    obj: rock4Obj,
    mtl: rock4Mtl
  },
  {
    name: 'rock2',
    obj: rock2Obj,
    mtl: rock2Mtl
  },
  {
    name: 'rock3',
    obj: rock3Obj,
    mtl: rock3Mtl
  },
  {
    name: 'lilypad',
    obj: lilypadObj,
    mtl: lilypadMtl,
    doubleSide: true
  },
];
