import React from 'react';
import ReactDOM from 'react-dom';

import Main from '@app/Main';
import UIManager from '@ui/UIManager';

const app = new Main();

ReactDOM.render(<UIManager />, document.getElementById('root'));

(async () => {
  await app.init();

  app.run();
  app.load('302725644');
})();
