import React from 'react';

import Button from '@components/Button/button';

const Home = () => (
  <>
    <h1>Home page</h1>
    <Button onClick={() => console.log('here')}>le bouton</Button>
  </>
);

export default Home;
