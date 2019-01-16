import React from 'react';
import ReactDOM from 'react-dom';

import Main from '@app/Main';
import UIManager from '@ui/UIManager';

if (UIManager.ENABLED) {
  ReactDOM.render(
    <UIManager />,
    document.getElementById('root')
  );
} else {
  (async () => {
    const app = new Main();
    await app.init(new UIManager(null, null));
    await app.load();
    app.run();
  })();
}
