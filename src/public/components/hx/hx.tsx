import React from 'react';
import classNames from 'classnames';

type IHProps = {
  children: any;
  className?: string;
};

export const H1: React.SFC<IHProps> = ({ children, className }) => (<h1 className={classNames('title', className)}>{children}</h1>);
export const H2: React.SFC<IHProps> = ({ children, className }) => (<h2 className={classNames('title', className)}>{children}</h2>);
export const H3: React.SFC<IHProps> = ({ children, className }) => (<h3 className={classNames('title', className)}>{children}</h3>);
export const H4: React.SFC<IHProps> = ({ children, className }) => (<h4 className={classNames('title', className)}>{children}</h4>);
export const H5: React.SFC<IHProps> = ({ children, className }) => (<h5 className={classNames('title', className)}>{children}</h5>);
