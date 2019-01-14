import React from 'react';

import Button from '@components/Button/button';

const Home = () => (
  <>
    <h1>Home page</h1>
    <div className="flexgrid">
      <div className="col col_12">
        1
        <Button onClick={() => console.log('here')}>le bouton</Button>
      </div>
      <div className="col col_12">2</div>
    </div>
  </>
);

export default Home;
