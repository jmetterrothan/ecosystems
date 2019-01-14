import React from 'react';

import UIManager from '@ui/UIManager';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import Button from '@components/Button/button';

import { UI_STATES } from '@app/ui/enums/UIStates.enum';

interface Props {
  uiManager: UIManager;
}

const Game = ({ uiManager }: Props) => (
  <Row>
    <Col>
      <Button onClick={() => uiManager.switchState(UI_STATES.HOME)}>le bouton</Button>
    </Col>
  </Row>
);

export default Game;
