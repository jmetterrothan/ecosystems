import React, { KeyboardEvent } from 'react';
import classNames from 'classnames';

import './tutorial-action.styles';

type ITutorialKey = {
  actionName: string;
  text: string;
  size?: number;
  className?: string
};

// simplier version of TutorialActionKey

const TutorialAction: React.SFC<ITutorialKey> = ({ className, actionName, text, size = 1 }) => (
  <div className={classNames('tutorial-action', className)}>
    <span className={classNames('tutorial-action__name', `tutorial-action__name--size${size}x`)}>{actionName}</span>
    <p className='tutorial-action__text ml-2'>{text}</p>
  </div>
);

export default TutorialAction;
