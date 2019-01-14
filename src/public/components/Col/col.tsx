import React from 'react';

import './col.styles';

type textAlign = 'left' | 'center' | 'right' | 'justify';

interface Props {
  children: JSX.Element;
  className?: string;
  debug?: boolean;
  textAlign?: textAlign;
  Tag?: any;
}

const Col = ({ children, className, debug, textAlign = 'left', Tag = 'div' }: Props) => {

  return (
    <Tag className={`col ${className || ''} ${debug ? 'debug' : ''}`} style={{ textAlign }}>
      {children}
    </Tag>
  );

};

export default Col;
