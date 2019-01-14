import React from 'react';

import './col.styles';

type textAlign = 'left' | 'center' | 'right' | 'justify';

interface Props {
  children: JSX.Element | string;
  className?: string;
  debug?: boolean;
  textAlign?: textAlign;
  style?: React.CSSProperties;
  Tag?: any;
}

const Col = ({ children, className, debug, style, textAlign = 'left', Tag = 'div' }: Props) => {

  return (
    <Tag className={`col ${className || ''} ${debug ? 'debug' : ''}`} style={{ ...style, textAlign }}>
      {children}
    </Tag>
  );

};

export default Col;
