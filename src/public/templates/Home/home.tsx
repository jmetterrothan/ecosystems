import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import UIManager from '@ui/UIManager';

import { configSvc } from '@app/shared/services/config.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';

import './home.scss';
import worldImg from '@images/world.png';

interface IHomeProps {
  uiManager: UIManager;
}

interface IHomeState {
  seedValue: string;
  selectedQuality: GRAPHICS_QUALITY;
  debugMode: boolean;
  onlineMode: boolean;
  soundMode: boolean;
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
    soundMode: false,
    formValid: true
  };

  handleSubmit = ev => {
    ev.preventDefault();

    const { seedValue, onlineMode, soundMode } = this.state;
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.LOADING, {
      seed: seedValue.length ? seedValue.trim() : undefined,
      online: onlineMode,
      sound: soundMode
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

  handleSoundChange = ev => {
    const soundMode = Number(ev.target.value) === 1;
    this.setState({ soundMode });
  }

  render() {
    const { formValid, selectedQuality, debugMode, onlineMode, soundMode } = this.state;

    return (
      <section className='ui-container home p-2'>
        <header className='home__header mt-2-t mt-4-l mb-2'>
            <h2 className='home__subtitle mb-1'>A journey through audio-visual worlds</h2>
            <h1 className='home__title'>Ecosystem</h1>
        </header>
        <div className='home__preview'>
          <img src={worldImg} alt='world' />
        </div>
        <form id='gameSetup' className='home__form form' onSubmit={this.handleSubmit} ref={el => this.form = el}>
          <Row>
            <Col className='col_24 col_13-t mb-2 mb-0-t'>
              <Row className='form__group mb-2'>
                <Col Tag='h4' className='col col_24 mb-1'>Choose a seed</Col>
                <Col className='col_24'>
                  <input type='text' placeholder='seed' onChange={this.handleChange} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />
                </Col>
              </Row>
              <Row className='form__group test'>
                <Col Tag='h4' className='col col_24 mb-1'>Graphics</Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityLow' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.LOW} checked={selectedQuality === GRAPHICS_QUALITY.LOW} />
                  <label htmlFor='qualityLow' className='mr-2'>Low</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityMedium' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.MEDIUM} checked={selectedQuality === GRAPHICS_QUALITY.MEDIUM} />
                  <label htmlFor='qualityMedium' className='mr-2'>Medium</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityHigh' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.HIGH} checked={selectedQuality === GRAPHICS_QUALITY.HIGH} />
                  <label htmlFor='qualityHigh'>High</label>
                </Col>
              </Row>
            </Col>
            <Col className='col_24 col_11-t'>
              <Row className='form__group mb-2'>
                <Col Tag='h4' className='col col_24 mb-1'>Game mode</Col>
                <Col className='col_12'>
                  <input type='radio' id='onlineModeOff' name='onlineMode' onChange={this.handleOnlineChange} value='0' checked={onlineMode === false} />
                  <label htmlFor='onlineModeOff' className='mr-2'>Solo</label>
                </Col>
                <Col className='col_12'>
                  <input type='radio' id='onlineModeOn' name='onlineMode' onChange={this.handleOnlineChange} value='1' checked={onlineMode !== false} />
                  <label htmlFor='onlineModeOn'>Multiplayer</label>
                </Col>
              </Row>
              <Row className='form__group'>
                <Col Tag='h4' className='col col_24 mb-1'>Sound</Col>
                <Col className='col_12'>
                  <input type='radio' id='soundOff' name='soundMode' onChange={this.handleSoundChange} value='0' checked={soundMode === false} />
                  <label htmlFor='soundOff' className='mr-2'>OFF</label>
                </Col>
                <Col className='col_12'>
                  <input type='radio' id='soundOn' name='soundMode' onChange={this.handleSoundChange} value='1' checked={soundMode !== false} />
                  <label htmlFor='soundOn'>ON</label>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className='form__group mt-2 mb-2'>
            <input type='checkbox' id='debugMode' onChange={this.handleDebugChange} checked={debugMode === true} />
            <label htmlFor='debugMode'>Debug</label>
          </div>
          <footer className='home__footer mb-2-t mb-4-l'>
            <input form='gameSetup' type='submit' value='Play' className='btn btn--magenta' disabled={!formValid} />
          </footer>
        </form>
      </section>
    );
  }
}

export default Home;
