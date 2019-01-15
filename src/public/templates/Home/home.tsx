import React from 'react';

import UIManager from '@app/ui/UIManager';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import Button from '@components/Button/button';

import { UI_STATES } from '@ui/enums/UIStates.enum';

interface Props {
  uiManager: UIManager;
}

const Home = ({ uiManager }: Props) => (
  <>
    <Row justify='center'>
      <Col className='col_24' textAlign='center' style={{ margin: '60px 0' }}>Ecosystem</Col>
    </Row>
    <Row justify='center'>
      <Col className='col_6' textAlign='center' style={{ margin: 20 }}>
        <Button className='full' onClick={() => uiManager.switchState(UI_STATES.PLAY)}>Jouer</Button>
      </Col>
    </Row>
  </>
);

export default Home;