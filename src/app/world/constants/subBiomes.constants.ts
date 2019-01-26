import * as THREE from 'three';

import Chunk from '@world/Chunk';

import { IBiomes } from '@world/models/biomes.model';

export const SUB_BIOMES: IBiomes = {
  FROZEN_TAIGA: {
    color: new THREE.Color(0x96c47b),
    organisms: []
  },
  FROZEN_GRASSLAND: {
    color: new THREE.Color(0x96c47b),
    organisms: [
      {
        weight: 0.25,
        name: ['dead_tree', 'dead_tree2'],
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 0.9, max: 1.25 },
        float: false,
      },
      {
        weight: 0.25,
        name: ['spruce', 'spruce2'],
        scarcity: 0.8,
        e: null,
        m: null,
        scale: { min: 0.9, max: 1.25 },
        float: false,
      },
      {
        weight: 0.2,
        name: ['bush', 'bush2', 'bush3'],
        scarcity: 0.825,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.3,
        name: 'rock5',
        scarcity: 0.825,
        e: null,
        m: null,
        scale: { min: 0.5, max: 1.25 },
        float: false,
      },
    ]
  },
  FJORD: {
    color: new THREE.Color(0x546c63),
    organisms: [
      {
        weight: 0.2,
        name: 'simple_tree',
        scarcity: 0.65,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.6 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'rock6',
        scarcity: 0.5,
        e: null,
        m: null,
        scale: { min: 0.5, max: 1.25 },
        float: false,
      },
      {
        weight: 0.25,
        name: ['bush', 'bush2', 'bush3'],
        scarcity: 0.4,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.65 },
        float: false,
      },
      {
        weight: 0.3,
        name: ['spruce', 'spruce2'],
        scarcity: 0.4,
        e: { low: Chunk.SEA_ELEVATION + 0.25, high: null },
        m: { low: 0.0, high: 0.325 },
        scale: { min: 1.0, max: 1.75 },
        float: false,
      },
      {
        weight: 0.1,
        name: ['pink_mushroom', 'blue_mushroom'],
        scarcity: 0.9875,
        e: { low: Chunk.SEA_ELEVATION + 0.025, high: 1.0 },
        m: null,
        scale: { min: 0.85, max: 1.35 },
        float: false,
      }
    ]
  },
  FJORD_SNOW_CAP: {
    color: new THREE.Color(0xffffff),
    organisms: []
  },
  FJORD_BEACH: {
    color: new THREE.Color(0x87a194),
    organisms: [
      {
        weight: 0.3,
        name: ['pink_mushroom', 'blue_mushroom'],
        scarcity: 0.9,
        e: { low: Chunk.SEA_ELEVATION + 0.025, high: 1.0 },
        m: null,
        scale: { min: 0.85, max: 1.35 },
        float: false,
      },
      {
        weight: 0.7,
        name: 'reed',
        scarcity: 0.925,
        e: { low: Chunk.SEA_ELEVATION - 0.01, high: Chunk.SEA_ELEVATION + 0.075 },
        m: null,
        scale: { min: 1.0, max: 1.45 },
        float: false,
      },
    ]
  },
  GRASSLAND: {
    color: new THREE.Color(0x93c54b),
    organisms: [
      {
        weight: 0.5,
        name: ['tulip', 'daisy'],
        scarcity: 0.85,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1.0 },
        m: null,
        scale: { min: 1.5, max: 2 },
        float: false,
      },
      {
        weight: 0.35,
        name: ['bush', 'bush2', 'bush3'],
        scarcity: 0.875,
        e: null,
        m: null,
        scale: { min: 1.25, max: 1.75 },
        float: false,
      },
      {
        weight: 0.075,
        name: 'birch',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.0 },
        float: false,
      },
      {
        weight: 0.075,
        name: 'simple_tree',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.0 },
        float: false,
      },
    ]
  },
  TAIGA: {
    color: new THREE.Color(0x298c2d),
    organisms: [
      {
        weight: 0.85,
        name: ['spruce', 'spruce2'],
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: ['red_mushroom', 'brown_mushroom'],
        scarcity: 0.995,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1.0 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
        float: false,
      }
    ]
  },
  DESERT: {
    color: new THREE.Color(0xe6cf87),
    organisms: [
      {
        weight: 0.775,
        name: ['cactus1', 'cactus2', 'cactus3', 'cactus4'],
        scarcity: 0.965,
        e: null,
        m: null,
        scale: { min: 1.00, max: 2.75 },
        float: false,
      },
      {
        weight: 0.1,
        name: 'rock1',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 1.0, max: 2.85 },
        float: false,
      },
      {
        weight: 0.025,
        name: 'carcass',
        scarcity: 0.999,
        e: null,
        m: null,
        scale: { min: 0.65, max: 1.25 },
        float: false,
      },
      {
        weight: 0.1,
        name: 'savanna_tree',
        scarcity: 0.9875,
        e: null,
        m: null,
        scale: { min: 1.25, max: 1.75 },
        float: false,
      },
    ]
  },
  TUNDRA: {
    color: new THREE.Color(0xe8d587),
    organisms: [
      {
        weight: 0.7,
        name: ['rock2', 'rock3'],
        scarcity: 0.9,
        e: null,
        m: null,
        scale: { min: 0.8, max: 2.75 },
        float: false,
      },
      {
        weight: 0.2,
        name: ['highlands_tree', 'highlands_tree2', 'yellow_tree'],
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.5 },
        float: false,
      },
      {
        weight: 0.1,
        name: ['blue_mushroom', 'brown_mushroom'],
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
    ]
  },
  MOUNTAIN: {
    color: new THREE.Color(0xd2c8a6),
    organisms: []
  },
  CORAL_REEF: {
    color: new THREE.Color(0xeacd73),
    organisms: [
      {
        weight: 0.45,
        name: 'rock1',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 1.0, max: 2.0 },
        float: false,
      },
      {
        weight: 0.35,
        name: ['algea', 'algea2', 'algea3'],
        scarcity: 0.9,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.5 },
        float: false,
      },
    ]
  },
  RAINFOREST: {
    color: new THREE.Color(0x3ead68),
    organisms: [
      {
        weight: 0.85,
        name: ['jungle_tree', 'jungle_tree2'],
        scarcity: 0.7,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'tulip',
        scarcity: 0.9,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1.0 },
        m: null,
        scale: { min: 1.5, max: 2 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'pink_mushroom',
        scarcity: 0.9,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1.0 },
        m: null,
        scale: { min: 0.85, max: 1.25 },
        float: false,
      },
    ]
  },
  RAINFOREST_HILLS: {
    color: new THREE.Color(0x3ead52),
    organisms: [
      {
        weight: 0.10,
        name: 'rock4',
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 1.0, max: 2.0 },
        float: false,
      },
      {
        weight: 0.5,
        name: ['jungle_tree', 'jungle_tree2'],
        scarcity: 0.6,
        e: null,
        m: null,
        scale: { min: 1, max: 1.25 },
        float: false,
      },
      {
        weight: 0.30,
        name: 'banana_tree',
        scarcity: 0.5,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.5 },
        float: false,
      },
      {
        weight: 0.1,
        name: ['pink_mushroom', 'blue_mushroom'],
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1.0 },
        m: null,
        scale: { min: 0.85, max: 1.35 },
        float: false,
      },
    ]
  },
  RAINFOREST_SWAMPS: {
    color: new THREE.Color(0xbed69e),
    organisms: [
      {
        weight: 0.50,
        name: 'mangrove',
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.50,
        name: 'blue',
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.00, max: 1.25 },
        float: false,
      },
    ]
  },
  BEACH: {
    color: new THREE.Color(0xf0e68c),
    organisms: [
      {
        weight: 0.25,
        name: 'lilypad',
        scarcity: 0.975,
        e: { low: null, high: Chunk.SEA_ELEVATION - 0.05 },
        m: { low: 0.5, high: 1.0 },
        scale: { min: 0.75, max: 1.65 },
        float: false,
      },
      {
        weight: 0.375,
        name: 'rock1',
        scarcity: 0.965,
        e: { low: null, high: 0.5 },
        m: null,
        scale: { min: 0.65, max: 0.95 },
        float: false,
      },
      {
        weight: 0.375,
        name: 'reed',
        scarcity: 0.925,
        e: { low: Chunk.SEA_ELEVATION - 0.01, high: Chunk.SEA_ELEVATION + 0.075 },
        m: null,
        scale: { min: 1.0, max: 1.45 },
        float: false,
      },
    ]
  },
  FROZEN_BEACH: {
    color: new THREE.Color(0xe0dcb8),
    organisms: [
      {
        weight: 0.5,
        name: 'rock2',
        scarcity: 0.965,
        e: { low: null, high: 0.5 },
        m: null,
        scale: { min: 0.65, max: 0.95 },
        float: false,
      },
      {
        weight: 0.5,
        name: 'reed',
        scarcity: 0.925,
        e: { low: Chunk.SEA_ELEVATION - 0.01, high: Chunk.SEA_ELEVATION + 0.075 },
        m: null,
        scale: { min: 1.0, max: 1.45 },
        float: false,
      },
    ]
  },
  OASIS: {
    color: new THREE.Color(0xf0e68c),
    organisms: [
      {
        weight: 0.5,
        name: 'rock1',
        scarcity: 0.965,
        e: null,
        m: null,
        scale: { min: 0.65, max: 0.95 },
        float: false,
      },
      {
        weight: 0.5,
        name: 'palm_tree',
        scarcity: 0.995,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 0.5 },
        m: null,
        scale: { min: 1.1, max: 1.5 },
        float: false,
      }
    ]
  },
  OCEAN: {
    color: new THREE.Color(0xf1c176),
    organisms: [
      {
        weight: 0.5,
        name: 'lilypad',
        scarcity: 0.8,
        e: { low: null, high: Chunk.SEA_ELEVATION - 0.05 },
        m: { low: 0.65, high: 1.0 },
        scale: { min: 1.0, max: 1.65 },
        float: true,
      },
      {
        weight: 0.45,
        name: 'rock1',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.5, max: 2 },
        float: false,
      },
      {
        weight: 0.1,
        name: ['star', 'shell'],
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.15 },
        float: false,
      },
    ]
  },
  FROZEN_OCEAN: {
    color: new THREE.Color(0xcdba97),
    organisms: [
      {
        weight: 0.5,
        name: 'rock2',
        scarcity: 0.8,
        e: null,
        m: null,
        scale: { min: 0.5, max: 2 },
        float: false,
      },
      {
        weight: 0.5,
        name: ['iceberg1', 'iceberg2'],
        scarcity: 0.95,
        e: { low: null, high: Chunk.SEA_ELEVATION - 0.05 },
        m: { low: 0.35, high: 1.0 },
        scale: { min: 0.9, max: 1.1 },
        float: true,
      },
    ]
  },
  SNOW: {
    color: new THREE.Color(0xf1f1f1),
    organisms: [
      {
        weight: 0.35,
        name: ['dead_tree', 'dead_tree2'],
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 0.9, max: 1.25 },
        float: false,
      },
      {
        weight: 0.3,
        name: ['spruce', 'spruce2'],
        scarcity: 0.8,
        e: null,
        m: null,
        scale: { min: 0.9, max: 1.25 },
        float: false,
      },
      {
        weight: 0.35,
        name: 'rock5',
        scarcity: 0.825,
        e: null,
        m: null,
        scale: { min: 0.5, max: 1.25 },
        float: false,
      },
    ]
  },
  SWAMP: {
    color: new THREE.Color(0xbed69e),
    organisms: [
      {
        weight: 0.15,
        name: ['red_mushroom', 'brown_mushroom'],
        scarcity: 0.8,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'mangrove',
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION - 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.45,
        name: ['stack', 'pink', 'blue'],
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'lilypad',
        scarcity: 0.85,
        e: { low: null, high: Chunk.SEA_ELEVATION - 0.05 },
        m: null,
        scale: { min: 1.0, max: 1.65 },
        float: true,
      },
    ]
  },
  TEST: {
    color: new THREE.Color('gray'),
    organisms: []
  }
};
