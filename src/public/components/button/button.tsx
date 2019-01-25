import React from 'react';

interface Props {
  children: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({ children, onClick, className }: Props) => {

  return (
    <button className={className || ''} onClick={onClick}>
      {children}
    </button >
  );

};

export default Button;
