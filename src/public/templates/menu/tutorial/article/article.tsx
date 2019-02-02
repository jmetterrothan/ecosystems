import React from 'react';
import classNames from 'classnames';

type IArticle = {
  children: any;
  className?: string;
};

const Article: React.SFC<IArticle> = ({ children, className }) => (<article className={classNames('article', className)}>{children}</article>);

export default Article;
