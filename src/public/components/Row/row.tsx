import React from 'react';

import './row.styles';

interface Props {
  children: JSX.Element[] | JSX.Element | string;
  prefix?: string;
  suffix?: string;
  className?: string;
  debug?: boolean;
  style?: React.CSSProperties;
  Tag?: any;
}

const Row = ({ children, prefix, suffix, className, style, debug, Tag = 'div' }: Props) => (
  <Tag className={`${prefix || ''}flexrow${suffix || ''} ${className || ''} ${debug ? 'debug' : ''}`} style={{ style }}>
    {children}
  </Tag>
);

export default Row;
