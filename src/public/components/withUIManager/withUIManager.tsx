import React from 'react';

import UIManager from '@ui/UIManager';

const withUIManager = (BaseComponent) => (uiManager: UIManager) => (
  <BaseComponent uiManager={uiManager} />
);

export default withUIManager;
