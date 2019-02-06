import React from 'react';
import { Subscription } from 'rxjs';

import Row from '@public/components/row/row';
import Col from '@public/components/col/col';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Trophy from './trophy/trophy';
import Button from '@public/components/button/button';

import { translationSvc } from '@shared/services/translation.service';
import { achievementSvc } from '@achievements/services/achievement.service';
import { progressionSvc } from '@achievements/services/progression.service';

import { ITrophy } from '@achievements/models/trophy.model';

import { TROPHIES } from '@achievements/constants/trophies.constants';
import { TROPHY_SORT } from '@achievements/enums/trophySort.enum';

import './trophies-tab.styles.scss';

interface ITrophiesTabProps { }

interface ITrophiesTabState {
  allTrophies: ITrophy[];
  unlockedTrophies: ITrophy[];
}

class TrophiesTab extends React.Component<ITrophiesTabProps, ITrophiesTabState> {
  static SORT_TYPE: TROPHY_SORT = TROPHY_SORT.TYPE;

  private trophySubscription: Subscription;

  state = {
    allTrophies: TROPHIES,
    unlockedTrophies: achievementSvc.getUnlockedTrophies()
  };

  componentWillMount() {
    this.trophySubscription = achievementSvc.trophy$.subscribe(() => {
      this.setState({ unlockedTrophies: achievementSvc.getUnlockedTrophies() });
    });
  }

  componentWillUnmount() {
    this.trophySubscription.unsubscribe();
  }

  componentDidMount() {
    this.sortBy();
  }

  handleSelectChange = ev => {
    TrophiesTab.SORT_TYPE = ev.target.value;
    this.sortBy();
  }

  resetProgression = () => {
    progressionSvc.reset();
    progressionSvc.init();
  }

  render() {
    return (
      <div className='tab trophies-tab'>
        <header className='tab__header mb-2'>
          <Row suffix='-48'>
            <Col className='flexcol--14-t mb-2 mb-0-t'><H3 className='color-theme'>{translationSvc.translate('UI.trophies-tab.title')}</H3></Col>
            <Col className='flexcol--10-t'>{this.renderSelect()}</Col>
          </Row>
        </header>
        <div className='tab__content'>
          <Row Tag='ul'>
            {this.state.allTrophies.map((trophy: ITrophy, index: number) => (
              <Col Tag='li' key={index} className='flexcol--12-t flexcol--8-l mb-3'>
                <Trophy {...trophy} unlocked={this.state.unlockedTrophies.includes(trophy)} />
              </Col>
            ))}
          </Row>
          <footer className='tab__footer progression-reset'>
            <Row>
              <Col className='flexcol--24'>
                <H4 className='mt-3 mb-2'>{translationSvc.translate('UI.trophies-tab.reset_title')}</H4>
                <p className='paragraph mb-2'>{translationSvc.translate('UI.trophies-tab.reset_text')}</p>
              </Col>
              <Col className='flexcol--24 flex justify-content--end'>
                <Button className='btn--darkblue btn--expand-mobile' onClick={this.resetProgression}>{translationSvc.translate('UI.trophies-tab.reset_btn')}</Button>
              </Col>
            </Row>
          </footer>
        </div>
      </div>
    );
  }

  private sortBy() {
    switch (TrophiesTab.SORT_TYPE) {
      case TROPHY_SORT.TYPE:
        this.setState({
          allTrophies: this.state.allTrophies.sort((a: ITrophy, b: ITrophy) => a.type - b.type)
        });
        break;
      case TROPHY_SORT.COMPLETED:
        this.setState({
          allTrophies: this.state.allTrophies.sort((a: ITrophy, b: ITrophy) => +this.state.unlockedTrophies.includes(b) - +this.state.unlockedTrophies.includes(a))
        });
        break;
      case TROPHY_SORT.DIFFICULTY:
        this.setState({
          allTrophies: this.state.allTrophies.sort((a: ITrophy, b: ITrophy) => a.difficulty - b.difficulty)
        });
        break;
    }
  }

  private renderSelect(): JSX.Element {
    const sort = Object.values(TROPHY_SORT);
    return (
      <div className='form'>
        <select className='form__element' onChange={this.handleSelectChange} value={TrophiesTab.SORT_TYPE}>
          {sort.map((option: string, index: number) => (
            <option key={index} value={option}>{translationSvc.translate(`UI.trophies-tab.${option}`)}</option>
          ))}
        </select>
      </div>
    );
  }

}

export default TrophiesTab;
