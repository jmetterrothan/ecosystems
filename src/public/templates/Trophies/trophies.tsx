import React from 'react';

import { IUIServices } from '@ui/models/services.model';
import StorageService from '@app/shared/services/storage.service';
import { translationSvc } from '@app/shared/services/translation.service';

const Trophies = ({ storageSvc, translationSvc }) => (
  <h1>{translationSvc.translate('UI.trophies')}</h1>
);

export default Trophies;
