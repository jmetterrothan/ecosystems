import React from 'react';
import classNames from 'classnames';

import { translationSvc } from '@shared/services/translation.service';
import { achievementSvc } from '@achievements/services/achievement.service';

import { ITrophy } from '@achievements/models/trophy.model';

import { TROPHIES } from '@achievements/constants/trophies.constants';
import { TROPHY_SORT } from '@achievements/enums/trophySort.enum';

import './trophies.styles.scss';
import Row from '@public/components/row/row';
import Col from '@public/components/col/col';

interface ITrophiesProps {

}

interface ITrophiesState {
  allTrophies: ITrophy[];
  unlockedTrophies: ITrophy[];
}

class Trophies extends React.Component<ITrophiesProps, ITrophiesState> {

  static SORT_TYPE: TROPHY_SORT = TROPHY_SORT.TYPE;

  state = {
    allTrophies: TROPHIES,
    unlockedTrophies: achievementSvc.getUnlockedTrophies()
  };

  handleSelectChange = ev => {
    Trophies.SORT_TYPE = ev.target.value;
    this.sortBy();
  }

  render() {
    return (
      <div className='tab tab--trophies'>
        <h3 className='title mb-3'>Trophées</h3>
        {this.renderSelect()}
        <Row Tag='ul'>
          {this.state.allTrophies.map((trophy: ITrophy, index: number) => {
            const unlockedClass = this.state.unlockedTrophies.includes(trophy) ? 'trophy--unlocked' : null;
            const difficultyClass = `trophy--difficulty-${trophy.difficulty}`;

            return (<Col Tag='li' key={index} className='flexcol--12-t flexcol--8-l flexcol--6-d'>
              <div className={classNames('trophy', unlockedClass, difficultyClass, 'mb-3')}>
                <div className='trophy__icon mb-1'><span className='icon-trophy' /></div>
                <h4 className='trophy__name'>{translationSvc.translate(trophy.name.key, trophy.name.options)}</h4>
              </div>
            </Col>);
          })}
        </Row>
      </div>
    );
  }

  private sortBy() {
    switch (Trophies.SORT_TYPE) {
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
      <select onChange={this.handleSelectChange} value={Trophies.SORT_TYPE}>
        {sort.map((option: string, index: number) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    );
  }

}

export default Trophies;
