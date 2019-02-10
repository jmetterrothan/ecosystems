import React from 'react';
import classNames from 'classnames';

import './button.scss';

interface Props {
  children: string;
  onClick?: () => void;
  className?: string;
  form?: string;
  type?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, className, ...rest }: Props) => {

  return (
    <button className={classNames('btn', className || '')} onClick={onClick} {...rest}>
      {children}
    </button >
  );

};

export default Button;
