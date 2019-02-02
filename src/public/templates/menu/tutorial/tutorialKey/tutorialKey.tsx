import React from 'react';
import classNames from 'classnames';

type ITutorialKey = {
  name: string;
  text: string;
  className?: string
};

const TutorialKey: React.SFC<ITutorialKey> = ({ className, name, text }) => (
  <div className={classNames('tutorial-key', className)}>
    <span className='tutorial-key__name'>{name}</span>
    <p className='tutorial-key__text ml-2'>{text}</p>
  </div>
);

export default TutorialKey;
