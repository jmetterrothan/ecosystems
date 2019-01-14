import React from 'react';

interface Props {
  children: JSX.Element;
  className?: string;
  Tag?: any;
}

const Col = ({ children, className, Tag = 'div' }: Props) => {

  return (
    <Tag className={`col ${className || ''}`}>
      {children}
    </Tag>
  );

};

export default Col;
