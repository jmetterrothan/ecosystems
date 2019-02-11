import React from 'react';
import classNames from 'classnames';

import CommonUtils from '@app/shared/utils/Common.utils';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Row from '@public/components/row/row';

import { progressionSvc } from '@achievements/services/progression.service';
import { translationSvc } from '@shared/services/translation.service';

import { IProgressionWithCount } from '@achievements/models/progression.model';

import './progress-tab.styles';

import FjordPic from '@images/biomes/thumbs/fjord/thumb_001.png';
import OceanPic from '@images/biomes/thumbs/ocean/thumb_001.png';
import RainforestPic from '@images/biomes/thumbs/rainforest/thumb_001.png';
import SwampPic from '@images/biomes/thumbs/swamp/thumb_001.png';
import DesertPic from '@images/biomes/thumbs/desert/thumb_001.png';
import SnowyHillsPic from '@images/biomes/thumbs/snowy_hills/thumb_001.png';
import HighlandsPic from '@images/biomes/thumbs/highlands/thumb_001.png';
import DesertIslandPic from '@images/biomes/thumbs/desert_island/thumb_001.png';

type IBiomeProgress = {
  name: string;
  unlocked: boolean;
  image?: string;
};

const BiomeProgress: React.FunctionComponent<IBiomeProgress> = ({ name, image, unlocked }) => {
  return (
    <div className={classNames('biome-progress',  unlocked && 'biome-progress--unlocked')}>
      <img src={image} />
      <h4>{name}</h4>
    </div>
  );
};

type IProgressTabState = {
  progression: IProgressionWithCount[];
};

class ProgressTab extends React.Component<any, IProgressTabState> {
  state = {
    progression: progressionSvc.getProgressionShown()
  };

  render() {
    const progression: any = progressionSvc.getProgressionStorage();

    return (
      <div className='tab progress-tab'>
        <header className='tab__header'>
          <H3 className='title color-theme mb-2'>{translationSvc.translate('UI.progress-tab.title')}</H3>
        </header>
        <div className='tab__content'>
          <Row Tag='ul' className='biome-progress mb-2'>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.desert')} image={DesertPic} unlocked={progression.desert_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.desert_island')} image={DesertIslandPic} unlocked={progression.desert_island_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.fjords')} image={FjordPic} unlocked={progression.fjord_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.highlands')} image={HighlandsPic} unlocked={progression.highland_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.ocean')} image={OceanPic} unlocked={progression.ocean_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.rainforest')} image={RainforestPic} unlocked={progression.rainforest_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.snowy_hills')} image={SnowyHillsPic} unlocked={progression.snow_visited} />
            </li>
            <li className='flexcol flexcol--12 flexcol--8-t flexcol--6-d mb-1'>
              <BiomeProgress name={translationSvc.translate('UI.biomes.swamps')} image={SwampPic} unlocked={progression.swamp_visited} />
            </li>
          </Row>
          <ul className='overall-progress'>
          {this.state.progression.map((item: IProgressionWithCount, index: number) => (
            <li className='p-2 pt-1 pb-1' key={index}>
              {translationSvc.translate(`UI.progress-tab.${item.name}`, { count: CommonUtils.formatNumberWithSpaces(item.count) })}
            </li>
          ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ProgressTab;
