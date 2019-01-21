import React from 'react';

import Trophies from '@templates/Trophies/trophies';

import UIState from '@ui/UIState';

class UITrophiesState extends UIState {

  init() {
    console.log('INIT TROPHIES');
  }

  process() {

  }

  render() {
    return Trophies;
  }

}

export default UITrophiesState;
