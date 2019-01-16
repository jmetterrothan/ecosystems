import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';

import { IServices } from '@ui/models/services.model';
import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';

const Home = ({ uiManager }) => {

  let form: HTMLFormElement;
  let seed: HTMLInputElement;

  const handleSubmit = ev => {
    ev.preventDefault();

    let seedValid = false;
    if (seed.value.length) {
      seed.required = true;
      seedValid = seed.checkValidity();
    }

    uiManager.switchState(UI_STATES.LOADING, { seed: seedValid ? seed.value.trim() : null } as IUIManagerParameters);
  };

  return (
    <>
      <Row justify='center'>
        <Col className='col_24' textAlign='center' style={{ margin: '60px 0' }}>Ecosystem</Col>
      </Row>
      <Row justify='center'>
        <Col className='col_6'>
          <form onSubmit={handleSubmit} ref={el => form = el}>
            <input type='text' className='full' placeholder='seed' pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => seed = el} />
            <input type='submit' value='jouer' className='full' />
          </form>
        </Col>
      </Row>
      {/* <Row justify='center'>
        <Col className='col_6' textAlign='center' style={{ margin: 20 }}>
          <Button className='full' onClick={() => uiManager.switchState(UI_STATES.PLAY)}>Jouer</Button>
        </Col>
      </Row> */}
    </>
  );

};

export default Home;
