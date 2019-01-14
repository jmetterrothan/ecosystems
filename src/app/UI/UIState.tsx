import React from 'react';

abstract class UIState extends React.PureComponent<void, void> {
  abstract init();
}

export default UIState;
