import React from 'react';
import ReactDOM from 'react-dom';

import Main from '@app/Main';
import UIManager from '@ui/UIManager';

const app = new Main();

const run = async () => {
  await app.init();
  app.run();
};

run();

ReactDOM.render(<UIManager />, document.getElementById('root'));
