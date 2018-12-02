export const BIOMES = {
  GRASSLAND: {
    color: new THREE.Color(0x93c54b),
    organisms: [
      {
        weight: 1.0,
        name: 'spruce',
        scarcity: 0.995,
        e: null,
        m: null,
        scale: { min: 0.75, max: 1.25 },
      }
    ]
  },
  FOREST: {
    color: new THREE.Color(0x5da736),
    organisms: [
      {
        weight: 0.9,
        name: 'spruce',
        scarcity: 0.5,
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
        weight: 0.2,
        name: 'cactus2',
        scarcity: 0.985,
        e: null,
        m: null,
        scale: { min: 1.25, max: 2.5 },
      },
      {
        weight: 0.3,
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
      }
    ]
  },
  TUNDRA: {
    color: new THREE.Color(0xB4C1A9),
    organisms: []
  },
  TAIGA: {
    color: new THREE.Color(0xb4c09c),
    organisms: []
  },
  MOUNTAIN: {
    color: new THREE.Color(0x9C9B7A),
    organisms: []
  },
  RAINFOREST: {
    color: new THREE.Color(0x3ead52),
    organisms: []
  },
  BEACH: {
    color: new THREE.Color(0xf0e68c),
    organisms: [
      {
        weight: 1,
        name: 'lilypad',
        scarcity: 0.975,
        e: { low: 0.0025, high: 0.00575 },
        m: { low: 0.5, high: 1.0 },
        scale: { min: 0.75, max: 1.45 },
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
        weight: 0.33,
        name: 'red_mushroom',
        scarcity: 0.85,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.33,
        name: 'brown_mushroom',
        scarcity: 0.85,
        e: { low: 0.02, high: 0.025 },
        m: null,
        scale: { min: 0.75, max: 1.25 },
      },
      {
        weight: 0.33,
        name: 'mangrove',
        scarcity: 0.975,
        e: null,
        m: { low: 0.7, high: 1 },
        scale: { min: 0.8, max: 1 },
      }
    ]
  },
  TEST: {
    color: new THREE.Color('purple'),
    organisms: []
  }
};
