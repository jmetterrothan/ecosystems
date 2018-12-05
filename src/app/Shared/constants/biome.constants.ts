import * as THREE from 'three';

import { IBiomes } from '@shared/models/biomes.model';

export const BIOMES: IBiomes = {
  GRASSLAND: {
    color: new THREE.Color(0x93c54b),
    organisms: [
      {
        weight: 0.6,
        name: 'spruce',
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.1,
        name: 'tulip',
        scarcity: 0.98,
        e: null,
        m: null,
        scale: { min: 0.95, max: 1.25 },
      },
      {
        weight: 0.1,
        name: 'daisy',
        scarcity: 0.98,
        e: null,
        m: null,
        scale: { min: 0.95, max: 1.25 },
      },
      {
        weight: 0.1,
        name: 'bush',
        scarcity: 0.9925,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.00 },
      },
      {
        weight: 0.1,
        name: 'diamond',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.1 },
      },
    ]
  },
  TAIGA: {
    color: new THREE.Color(0x5da736),
    organisms: [
      {
        weight: 0.9,
        name: 'spruce',
        scarcity: 0.825,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.05,
        name: 'red_mushroom',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.05,
        name: 'brown_mushroom',
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
      }
    ]
  },
  DESERT: {
    color: new THREE.Color(0xe6cf87),
    organisms: [
      {
        weight: 0.3,
        name: 'cactus1',
        scarcity: 0.985,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
      },
      {
        weight: 0.1,
        name: 'cactus2',
        scarcity: 0.985,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
      },
      {
        weight: 0.2,
        name: 'cactus3',
        scarcity: 0.985,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
      },
      {
        weight: 0.2,
        name: 'cactus4',
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 1, max: 1.2 },
      },
      {
        weight: 0.1,
        name: 'rock1',
        scarcity: 0.985,
        e: null,
        m: null,
        scale: { min: 1.0, max: 2.85 },
      },
      {
        weight: 0.1,
        name: 'palm_tree',
        scarcity: 0.995,
        e: { low: 0.26, high: 0.5 },
        m: null,
        scale: { min: 1.1, max: 1.5 },
      }
    ]
  },
  TUNDRA: {
    color: new THREE.Color(0xB4C1A9),
    organisms: []
  },
  MOUNTAIN: {
    color: new THREE.Color(0x5da736),
    organisms: []
  },
  RAINFOREST: {
    color: new THREE.Color(0x3ead52),
    organisms: [
      {
        weight: 0.6,
        name: 'jungle_tree',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.35 },
      },
      {
        weight: 0.4,
        name: 'banana_tree',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.5 },
      }
    ]
  },
  BEACH: {
    color: new THREE.Color(0xf0e68c),
    organisms: [
      {
        weight: 0.5,
        name: 'lilypad',
        scarcity: 0.975,
        e: { low: 0.0025, high: 0.00575 },
        m: { low: 0.5, high: 1.0 },
        scale: { min: 0.75, max: 1.45 },
      },
      {
        weight: 0.5,
        name: 'rock1',
        scarcity: 0.975,
        e: { low: 0.0175, high: 0.5 },
        m: null,
        scale: { min: 0.65, max: 0.95 },
      },
      {
        weight: 0.1,
        name: 'palm_tree',
        scarcity: 0.975,
        e: { low: 0.0175, high: 0.5 },
        m: { low: 0.0, high: 0.35 },
        scale: { min: 1.1, max: 1.5 },
      }
    ]
  },
  OCEAN: {
    color: new THREE.Color(0xedc375),
    organisms: []
  },
  SNOW: {
    color: new THREE.Color(0xfffffff),
    organisms: []
  },
  SWAMP: {
    color: new THREE.Color(0xbed69e),
    organisms: [
      {
        weight: 0.20,
        name: 'red_mushroom',
        scarcity: 0.85,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.20,
        name: 'brown_mushroom',
        scarcity: 0.85,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.20,
        name: 'mangrove',
        scarcity: 0.985,
        e: null,
        m: { low: 0.6, high: 1 },
        scale: { min: 0.8, max: 1 },
      },
      {
        weight: 0.20,
        name: 'stack',
        scarcity: 0.995,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.10,
        name: 'pink',
        scarcity: 0.995,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.10,
        name: 'blue',
        scarcity: 0.995,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
    ]
  },
  TEST: {
    color: new THREE.Color('purple'),
    organisms: []
  }
};
