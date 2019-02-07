import React from 'react';
import classNames from 'classnames';

import './tutorial-key.styles';

type ITutorialKey = {
  name: string;
  text: string;
  className?: string
  canEdit?: boolean;
};

const TutorialKey: React.SFC<ITutorialKey> = ({ className, name, text, canEdit }) => (
  <div className={classNames('tutorial-key', className)}>
    <span className='tutorial-key__name'>{name}</span>
    <p className='tutorial-key__text ml-2'>{text}</p>
  </div>
);

export default TutorialKey;
