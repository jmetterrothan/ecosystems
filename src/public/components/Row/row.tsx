import React from 'react';

import './row.styles';

type Justify = 'start' | 'center' | 'between' | 'around';

interface Props {
  children: JSX.Element;
  className?: string;
  debug?: boolean;
  Tag?: any;
  justify?: Justify;
}

const Row = ({ children, className, justify = 'start', debug, Tag = 'div' }: Props) => (
  <Tag className={`flexgrid row fl-${justify} ${className || ''} ${debug ? 'debug' : ''}`}>
    {children}
  </Tag>
);

export default Row;
