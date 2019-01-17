import React from 'react';

import Trophies from '@templates/Trophies/trophies';

import { storageSvc } from '@shared/services/storage.service';

import { IUIServices } from '@ui/models/services.model';

import UIState from '@ui/UIState';

class UITrophiesState extends UIState {

  services: IUIServices = {
    storageSvc
  };

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
