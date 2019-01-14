import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import Button from '@components/Button/button';

import UIService from '@ui/services/ui.service';
import { UI_STATES } from '@ui/enums/UIStates.enum';

interface Props {
  uiSvc: UIService;
}

const Home = ({ uiSvc }: Props) => (
  <>
    <Row justify='center'>
      <Col className='col_24' textAlign='center' style={{ margin: '60px 0' }}>Ecosystem</Col>
    </Row>
    <Row justify='center'>
      <Col className='col_6' textAlign='center' style={{ margin: 20 }}>
        <Button className='full' onClick={() => uiSvc.switchState(UI_STATES.PLAY)}>Jouer</Button>
      </Col>
    </Row>
  </>
);

export default Home;
