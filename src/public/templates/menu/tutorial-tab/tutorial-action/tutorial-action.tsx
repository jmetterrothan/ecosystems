import React, { KeyboardEvent } from 'react';
import classNames from 'classnames';

import './tutorial-action.styles';

type ITutorialKey = {
  actionName: string;
  text: string;
  className?: string
};

// simplier version of TutorialActionKey

const TutorialAction: React.SFC<ITutorialKey> = ({ className, actionName, text }) => (
  <div className={classNames('tutorial-action', className)}>
    <span className={classNames('tutorial-action__name', `tutorial-action__name--size${Math.min(Math.max(actionName.length, 1), 3)}x`)}>{actionName}</span>
    <p className='tutorial-action__text'>{text}</p>
  </div>
);

export default TutorialAction;
