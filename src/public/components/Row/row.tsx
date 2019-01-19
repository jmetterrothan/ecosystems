import React from 'react';

import './row.styles';

type Justify = 'start' | 'center' | 'between' | 'around';

interface Props {
  children: JSX.Element[] | JSX.Element | string;
  className?: string;
  debug?: boolean;
  style?: React.CSSProperties;
  justify?: Justify;
  Tag?: any;
}

const Row = ({ children, className, style, debug, justify = 'start', Tag = 'div' }: Props) => (
  <Tag className={`flexgrid row fl-${justify} ${className || ''} ${debug ? 'debug' : ''}`} style={{ style }}>
    {children}
  </Tag>
);

export default Row;
