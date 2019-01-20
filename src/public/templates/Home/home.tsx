import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import UIManager from '@ui/UIManager';

import { notificationSvc } from '@app/shared/services/notification.service';
import { configSvc } from '@app/shared/services/config.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';

interface IHomeProps {
  uiManager: UIManager;
}

interface IHomeState {
  seedValue: string;
  selectedQuality: GRAPHICS_QUALITY;
  debugMode: boolean;
  onlineMode: boolean;
  formValid: boolean;
}

class Home extends React.PureComponent<IHomeProps, IHomeState> {
  form: HTMLFormElement;
  seedInput: HTMLInputElement;

  state = {
    seedValue: '',
    selectedQuality: GRAPHICS_QUALITY.HIGH,
    debugMode: configSvc.debug,
    onlineMode: false,
    formValid: true
  };

  handleSubmit = ev => {
    ev.preventDefault();

    const { seedValue, onlineMode } = this.state;
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.LOADING, {
      seed: seedValue.length ? seedValue.trim() : undefined,
      online: onlineMode
    } as IUIManagerParameters);
  }

  handleChange = () => {
    let valid;
    if (this.seedInput.value.length) {
      this.seedInput.required = true;
      valid = this.seedInput.checkValidity();
    } else {
      this.seedInput.required = false;
      valid = true;
    }

    this.setState({
      seedValue: this.seedInput.value,
      formValid: valid
    });
  }

  handleQualityChange = ev => {
    configSvc.quality = Number(ev.target.value | 0);

    this.setState({ selectedQuality: configSvc.quality });
  }

  handleDebugChange = () => {
    configSvc.debug = !configSvc.debug;
    this.setState({ debugMode: configSvc.debug });
  }

  handleOnlineChange = ev => {
    const onlineMode = Number(ev.target.value) === 1;
    this.setState({ onlineMode });
  }

  render() {
    const { formValid, selectedQuality, debugMode, onlineMode } = this.state;

    return (
      <>
        <Row justify='center'>
          <Col className='col_24' textAlign='center' style={{ margin: '60px 0' }}>Ecosystem</Col>
        </Row>
        <Row justify='center'>
          <Col className='col_8'>
            <form onSubmit={this.handleSubmit} ref={el => this.form = el}>
              <Row>
                <Col className='col_8'>
                  <input type='radio' id='onlineModeOff' name='onlineMode' onChange={this.handleOnlineChange} value='0' checked={onlineMode === false} />
                  <label htmlFor='onlineModeOff'>Solo</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='onlineModeOn' name='onlineMode' onChange={this.handleOnlineChange} value='1' checked={onlineMode !== false} />
                  <label htmlFor='onlineModeOn'>Multiplayer</label>
                </Col>
              </Row>

              <input type='text' className='full' placeholder='seed' onChange={this.handleChange} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />

              <input type='checkbox' id='debugMode' onChange={this.handleDebugChange} checked={debugMode === true} />
              <label htmlFor='debugMode'>Debug</label>

              <Row>
                <Col className='col_8'>
                  <input type='radio' id='qualityLow' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.LOW} checked={selectedQuality === GRAPHICS_QUALITY.LOW} />
                  <label htmlFor='qualityLow'>Low</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityMedium' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.MEDIUM} checked={selectedQuality === GRAPHICS_QUALITY.MEDIUM} />
                  <label htmlFor='qualityMedium'>Medium</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityHigh' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.HIGH} checked={selectedQuality === GRAPHICS_QUALITY.HIGH} />
                  <label htmlFor='qualityHigh'>High</label>
                </Col>
              </Row>
              <input type='submit' value='jouer' className='full' disabled={!formValid} />
            </form>
          </Col>
        </Row>
      </>
    );
  }
}

export default Home;
