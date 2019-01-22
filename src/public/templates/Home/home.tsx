import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';
import UIManager from '@ui/UIManager';
import CommonUtils from '@app/shared/utils/Common.utils';

import { configSvc } from '@app/shared/services/config.service';
import { translationSvc } from '@app/shared/services/translation.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';

import './home.scss';

import previewImage from '@images/previews/world.png';
import previewImage2 from '@images/previews/world2.png';
import previewImage3 from '@images/previews/world3.png';
import previewImage4 from '@images/previews/world4.png';
import previewImage5 from '@images/previews/world5.png';

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
  image: string;
}

const imageList = [previewImage, previewImage2, previewImage3, previewImage4, previewImage5];

class Home extends React.PureComponent<IHomeProps, IHomeState> {
  form: HTMLFormElement;
  seedInput: HTMLInputElement;

  state = {
    seedValue: '',
    selectedQuality: GRAPHICS_QUALITY.HIGH,
    debugMode: configSvc.debug,
    onlineMode: false,
    soundMode: false,
    formValid: true,
    image: imageList[Math.floor(Math.random() * imageList.length)]
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
    const { formValid, selectedQuality, debugMode, onlineMode, soundMode, image } = this.state;

    const debugHtml = (
    <div className='form__group mt-2'>
      <input type='checkbox' id='debugMode' onChange={this.handleDebugChange} checked={debugMode === true} />
      <label htmlFor='debugMode'>{translationSvc.translate('UI.home.debug')}</label>
    </div>
    );

    const debugHtmlFinal = CommonUtils.isDev() ? debugHtml : null;

    return (
      <section className='ui-container home p-2'>
        <header className='home__header mt-2-t mt-4-l mb-2'>
            <h2 className='home__subtitle mb-1'>{translationSvc.translate('UI.home.subtitle')}</h2>
            <h1 className='home__title'>{translationSvc.translate('UI.home.title')}</h1>
        </header>
        <div className='home__preview'>
          <img src={image} alt='world' />
        </div>
        <form id='gameSetup' className='home__form form' onSubmit={this.handleSubmit} ref={el => this.form = el}>
          <Row suffix='-48'>
            <Col className='flexcol--24 flexcol--13-t mb-2 mb-0-t'>
              <Row className='form__group mb-2'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.seed')}</Col>
                <Col className='flexcol--24'>
                  <input type='text' placeholder={translationSvc.translate('UI.home.form.seed_placeholder')} onChange={this.handleChange} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />
                </Col>
              </Row>
              <Row className='form__group test'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.graphics')}</Col>
                <Col className='flexcol--8'>
                  <input type='radio' id='qualityLow' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.LOW} checked={selectedQuality === GRAPHICS_QUALITY.LOW} />
                  <label htmlFor='qualityLow' className='mr-2'>{translationSvc.translate('UI.home.form.low_quality_option')}</label>
                </Col>
                <Col className='flexcol--8'>
                  <input type='radio' id='qualityMedium' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.MEDIUM} checked={selectedQuality === GRAPHICS_QUALITY.MEDIUM} />
                  <label htmlFor='qualityMedium' className='mr-2'>{translationSvc.translate('UI.home.form.medium_quality_option')}</label>
                </Col>
                <Col className='flexcol--8'>
                  <input type='radio' id='qualityHigh' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.HIGH} checked={selectedQuality === GRAPHICS_QUALITY.HIGH} />
                  <label htmlFor='qualityHigh'>{translationSvc.translate('UI.home.form.high_quality_option')}</label>
                </Col>
              </Row>
            </Col>
            <Col className='flexcol--24 flexcol--11-t'>
              <Row className='form__group mb-2'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.gamemode')}</Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='onlineModeOff' name='onlineMode' onChange={this.handleOnlineChange} value='0' checked={onlineMode === false} />
                  <label htmlFor='onlineModeOff' className='mr-2'>{translationSvc.translate('UI.home.form.singleplayer_option')}</label>
                </Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='onlineModeOn' name='onlineMode' onChange={this.handleOnlineChange} value='1' checked={onlineMode !== false} />
                  <label htmlFor='onlineModeOn'>{translationSvc.translate('UI.home.form.multiplayer_option')}</label>
                </Col>
              </Row>
              <Row className='form__group'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.soundmode')}</Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='soundOff' name='soundMode' onChange={this.handleSoundChange} value='0' checked={soundMode === false} />
                  <label htmlFor='soundOff' className='mr-2'>{translationSvc.translate('UI.home.form.sound_off_option')}</label>
                </Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='soundOn' name='soundMode' onChange={this.handleSoundChange} value='1' checked={soundMode !== false} />
                  <label htmlFor='soundOn'>{translationSvc.translate('UI.home.form.sound_on_option')}</label>
                </Col>
              </Row>
            </Col>
          </Row>

          {debugHtmlFinal}

          <footer className='home__footer mt-3 mb-2-t mb-4-l'>
            <input form='gameSetup' type='submit' value={translationSvc.translate('UI.home.form.start_btn')} className='btn btn--magenta' disabled={!formValid} />
          </footer>
        </form>
      </section>
    );
  }
}

export default Home;
