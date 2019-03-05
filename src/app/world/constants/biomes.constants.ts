import RainForestBiome from '@world/biomes/RainForestBiome';
import HighlandBiome from '@world/biomes/HighlandBiome';
import OceanBiome from '@world/biomes/OceanBiome';
import SwampBiome from '@world/biomes/SwampBiome';
import DesertBiome from '@world/biomes/DesertBiome';
import SnowBiome from '@world/biomes/SnowBiome';
import FjordBiome from '@world/biomes/FjordBiome';
import DesertIslandBiome from '@world/biomes/DesertIslandBiome';
import TaigaBiome from '@world/biomes/TaigaBiome';

interface IWeightedBiomePic {
  class: any;
  weight: number;
}

export const Biomes: IWeightedBiomePic[] = [
  { class: RainForestBiome, weight: 12 },
  { class: HighlandBiome, weight: 10 },
  { class: OceanBiome, weight: 14 },
  { class: SwampBiome, weight: 12 },
  { class: DesertBiome, weight: 14 },
  { class: SnowBiome, weight: 6 },
  { class: FjordBiome, weight: 8 },
  { class: DesertIslandBiome, weight: 14 },
  { class: TaigaBiome, weight: 2 },
];
