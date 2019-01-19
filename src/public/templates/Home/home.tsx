import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import UIManager from '@ui/UIManager';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';
import { configSvc } from '@app/shared/services/graphicsConfig.service';

interface IHomeProps {
  uiManager: UIManager;
}

interface IHomeState {
  seedValue: string;
  selectedQuality: GRAPHICS_QUALITY;
  formValid: boolean;
}

class Home extends React.PureComponent<IHomeProps, IHomeState> {
  form: HTMLFormElement;
  seedInput: HTMLInputElement;

  state = {
    seedValue: '',
    selectedQuality: GRAPHICS_QUALITY.HIGH,
    formValid: true
  };

  handleSubmit = ev => {
    ev.preventDefault();

    const { seedValue } = this.state;
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.LOADING, {
      seed: seedValue.length ? seedValue.trim() : undefined
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

  handleRadioChange = ev => {
    const value : GRAPHICS_QUALITY  = Number(ev.target.value | 0);
    configSvc.quality = value;

    this.setState({
      selectedQuality: value
    });
  }

  render() {
    const { formValid, selectedQuality } = this.state;

    return (
      <>
        <Row justify='center'>
          <Col className='col_24' textAlign='center' style={{ margin: '60px 0' }}>Ecosystem</Col>
        </Row>
        <Row justify='center'>
          <Col className='col_8'>
            <form onSubmit={this.handleSubmit} ref={el => this.form = el}>
              <input type='text' className='full' placeholder='seed' onChange={this.handleChange} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />
              <Row>
                <Col className='col_8'>
                  <input type='radio' id='qualityLow' name='selectedQuality' onChange={this.handleRadioChange} value={GRAPHICS_QUALITY.LOW} checked={selectedQuality === GRAPHICS_QUALITY.LOW} />
                  <label htmlFor='qualityLow'>Low</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityMedium' name='selectedQuality' onChange={this.handleRadioChange} value={GRAPHICS_QUALITY.MEDIUM} checked={selectedQuality === GRAPHICS_QUALITY.MEDIUM} />
                  <label htmlFor='qualityMedium'>Medium</label>
                </Col>
                <Col className='col_8'>
                  <input type='radio' id='qualityHigh' name='selectedQuality' onChange={this.handleRadioChange} value={GRAPHICS_QUALITY.HIGH} checked={selectedQuality === GRAPHICS_QUALITY.HIGH} />
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
