import * as THREE from 'three';

import Chunk from '@world/Chunk';
import { IBiomes } from '@shared/models/biomes.model';

export const BIOMES: IBiomes = {
  FROZEN_TAIGA: {
    color: new THREE.Color(0x96c47b),
    organisms: []
  },
  FROZEN_GRASSLAND: {
    color: new THREE.Color(0x96c47b),
    organisms: []
  },
  GRASSLAND: {
    color: new THREE.Color(0x93c54b),
    organisms: [
      {
        weight: 0.25,
        name: 'tulip',
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 1.5, max: 2 },
        float: false,
      },
      {
        weight: 0.25,
        name: 'daisy',
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 1.5, max: 2 },
        float: false,
      },
      {
        weight: 0.25,
        name: 'bush',
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 1.25, max: 1.75 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'diamond',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.1 },
        float: false,
      },
      {
        weight: 0.20,
        name: 'birch',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.9, max: 2.0 },
        float: false,
      },
    ]
  },
  TAIGA: {
    color: new THREE.Color(0x298c2d),
    organisms: [
      {
        weight: 0.85,
        name: 'spruce',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
        float: false,
      },
      {
        weight: 0.1,
        name: 'red_mushroom',
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'brown_mushroom',
        scarcity: 0.9975,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
        float: false,
      },
    ]
  },
  DESERT: {
    color: new THREE.Color(0xe6cf87),
    organisms: [
      {
        weight: 0.25,
        name: 'cactus1',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'cactus2',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
        float: false,
      },
      {
        weight: 0.2,
        name: 'cactus3',
        scarcity: 0.975,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
        float: false,
      },
      {
        weight: 0.2,
        name: 'cactus4',
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 1, max: 1.2 },
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
        weight: 0.1,
        name: 'savanna_tree',
        scarcity: 0.985,
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
        weight: 0.4,
        name: 'rock2',
        scarcity: 0.9,
        e: null,
        m: null,
        scale: { min: 0.8, max: 2.75 },
        float: false,
      },
      {
        weight: 0.4,
        name: 'rock3',
        scarcity: 0.9,
        e: null,
        m: null,
        scale: { min: 0.8, max: 1 },
        float: false,
      },
      {
        weight: 0.1,
        name: 'highlands_tree',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.5 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'brown_mushroom',
        scarcity: 0.95,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'blue_mushroom',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.25 },
        float: false,
      },
    ]
  },
  MOUNTAIN: {
    color: new THREE.Color(0xd2c8a6),
    organisms: []
  },
  CORAL_REEF: {
    color: new THREE.Color(0xd0b480),
    organisms: [
      {
        weight: 1,
        name: 'rock2',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 1.0, max: 2.0 },
        float: false,
      },
    ]
  },
  RAINFOREST: {
    color: new THREE.Color(0x3ead68),
    organisms: [
      {
        weight: 0.45,
        name: 'jungle_tree',
        scarcity: 0.7,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.40,
        name: 'jungle_tree2',
        scarcity: 0.8,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'tulip',
        scarcity: 0.9,
        e: null,
        m: null,
        scale: { min: 1.5, max: 2 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'pink_mushroom',
        scarcity: 0.9,
        e: null,
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
        weight: 0.1,
        name: 'rock4',
        scarcity: 0.85,
        e: null,
        m: null,
        scale: { min: 1.0, max: 2.0 },
        float: false,
      },
      {
        weight: 0.35,
        name: 'jungle_tree',
        scarcity: 0.6,
        e: null,
        m: null,
        scale: { min: 1, max: 1.25 },
        float: false,
      },
      {
        weight: 0.1,
        name: 'jungle_tree2',
        scarcity: 0.8,
        e: null,
        m: null,
        scale: { min: 1, max: 1.25 },
        float: false,
      },
      {
        weight: 0.35,
        name: 'banana_tree',
        scarcity: 0.5,
        e: null,
        m: null,
        scale: { min: 1.0, max: 1.5 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'pink_mushroom',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.35 },
        float: false,
      },
      {
        weight: 0.05,
        name: 'blue_mushroom',
        scarcity: 0.95,
        e: null,
        m: null,
        scale: { min: 0.85, max: 1.25 },
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
        weight: 0.5,
        name: 'lilypad',
        scarcity: 0.975,
        e: { low: -1, high: Chunk.SEA_ELEVATION },
        m: { low: 0.5, high: 1.0 },
        scale: { min: 0.75, max: 1.45 },
        float: false,
      },
      {
        weight: 0.5,
        name: 'rock1',
        scarcity: 0.965,
        e: { low: -1, high: 0.5 },
        m: null,
        scale: { min: 0.65, max: 0.95 },
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
        e: { low: -1, high: 0.5 },
        m: null,
        scale: { min: 0.65, max: 0.95 },
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
    color: new THREE.Color(0xedc375),
    organisms: [
      {
        weight: 0.50,
        name: 'lilypad',
        scarcity: 0.8,
        e: { low: -1, high: Chunk.SEA_ELEVATION },
        m: { low: 0.65, high: 1.0 },
        scale: { min: 1.0, max: 1.5 },
        float: true,
      },
      {
        weight: 0.5,
        name: 'rock1',
        scarcity: 0.8,
        e: null,
        m: null,
        scale: { min: 1.25, max: 3 },
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
        scale: { min: 1.25, max: 3 },
        float: false,
      },
    ]
  },
  SNOW: {
    color: new THREE.Color(0xf1f1f1),
    organisms: []
  },
  SWAMP: {
    color: new THREE.Color(0xbed69e),
    organisms: [
      {
        weight: 0.15,
        name: 'red_mushroom',
        scarcity: 0.8,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'brown_mushroom',
        scarcity: 0.8,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: 1 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'mangrove',
        scarcity: 0.9,
        e: { low: Chunk.SEA_ELEVATION - 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'stack',
        scarcity: 0.925,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'pink',
        scarcity: 0.925,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.15,
        name: 'blue',
        scarcity: 0.925,
        e: { low: Chunk.SEA_ELEVATION + 0.05, high: Chunk.SEA_ELEVATION + 0.2 },
        m: null,
        scale: { min: 1.0, max: 1.25 },
        float: false,
      },
      {
        weight: 0.10,
        name: 'lilypad',
        scarcity: 0.85,
        e: { low: -1, high: Chunk.SEA_ELEVATION },
        m: null,
        scale: { min: 1.0, max: 1.35 },
        float: true,
      },
    ]
  },
  TEST: {
    color: new THREE.Color('purple'),
    organisms: []
  }
};
