import React from 'react';

import './row.styles';

interface Props {
  children: JSX.Element;
  className?: string;
  debug?: boolean;
  Tag?: any;
}

const Row = ({ children, className, debug, Tag = 'div' }: Props) => (
  <Tag className={`flexgrid row ${className || ''} ${debug ? 'debug' : ''}`}>
    {children}
  </Tag>
);

export default Row;
