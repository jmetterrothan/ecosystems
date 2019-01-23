import React from 'react';

import { translationSvc } from '@shared/services/translation.service';
import { achievementSvc } from '@achievements/services/achievement.service';

import { ITrophy } from '@achievements/models/trophy.model';

import { TROPHIES } from '@achievements/constants/trophies.constants';

import { TROPHY_SORT } from '@achievements/enums/trophySort.enum';

interface ITrophiesProps {

}

interface ITrophiesState {
  allTrophies: ITrophy[];
  unlockedTrophies: ITrophy[];
}

class Trophies extends React.Component<ITrophiesProps, ITrophiesState> {

  state = {
    allTrophies: TROPHIES,
    unlockedTrophies: achievementSvc.getUnlockedTrophies()
  };

  handleSelectChange = ev => {
    const value = ev.target.value;
    this.sortBy(value);
  }

  render() {
    return (
      <>
        {this.renderSelect()}
        <ul>
          {this.state.allTrophies.map((trophy: ITrophy, index: number) => (
            <li key={index} style={{ color: this.state.unlockedTrophies.includes(trophy) ? 'red' : 'black' }}>{translationSvc.translate(trophy.name.key, trophy.name.options)} - {trophy.difficulty}</li>
          ))}
        </ul>
      </>
    );
  }

  private sortBy(type: TROPHY_SORT) {
    switch (type) {
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
      <select onChange={this.handleSelectChange}>
        {sort.map((option: string, index: number) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    );
  }

}

export default Trophies;
