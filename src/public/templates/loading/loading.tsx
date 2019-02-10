import React from 'react';

import Loader from '@public/components/loader/loader';

import './loading.styles.scss';

const Loading = () => (
  <section className='ui__state loading'>
    <div className='loading__message'><Loader /></div>
  </section>
);

export default Loading;
