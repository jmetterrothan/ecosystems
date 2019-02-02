import React from 'react';

import Row from '@components/row/row';
import Col from '@components/col/col';
import UIManager from '@ui/UIManager';
import CookiesConsent from '@public/components/cookies/cookies-consent';
import ImageWithLoading from '@components/imageWithLoading/ImageWithLoading';
import SoundManager from '@app/shared/SoundManager';
import MathUtils from '@shared/utils/Math.utils';
import CommonUtils from '@shared/utils/Common.utils';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Button from '@public/components/button/button';

import { coreSvc } from '@shared/services/core.service';
import { configSvc } from '@app/shared/services/config.service';
import { translationSvc } from '@app/shared/services/translation.service';
import { storageSvc } from '@shared/services/storage.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { GraphicsQuality } from '@shared/enums/graphicsQuality.enum';
import { UIStates } from '@app/ui/enums/UIStates.enum';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

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
  selectedQuality: GraphicsQuality;
  debugMode: boolean;
  onlineMode: boolean;
  soundMode: boolean;
  formValid: boolean;
  image: string;
  ready: boolean;
  busy: boolean;
}

interface IHomeParametersStorage {
  quality: GraphicsQuality;
  debug: boolean;
  online: boolean;
  sound: boolean;
}

const imageList = [previewImage, previewImage2, previewImage3, previewImage4, previewImage5];

class Home extends React.PureComponent<IHomeProps, IHomeState> {
  form: HTMLFormElement;
  seedInput: HTMLInputElement;
  storage: IHomeParametersStorage;

  constructor(props) {
    super(props);

    this.storage = Object.assign({
      quality: GraphicsQuality.HIGH,
      debug: configSvc.debug,
      online: false,
      sound: false
    }, storageSvc.get<IHomeParametersStorage>(STORAGES_KEY.ui) || {});

    this.state = {
      seedValue: MathUtils.randomUint32().toString(),
      selectedQuality: this.storage.quality,
      debugMode: this.storage.debug,
      onlineMode: this.storage.online,
      soundMode: this.storage.sound,
      formValid: true,
      image: imageList[Math.floor(Math.random() * imageList.length)],
      ready: false,
      busy: false
    };
  }

  /**
   * Dispatch all UI changes to the storage or used services
   */
  dispatchChanges() {
    this.storage = {
      quality: this.state.selectedQuality,
      online: this.state.onlineMode,
      sound: this.state.soundMode,
      debug: this.state.debugMode
    };

    configSvc.quality = this.state.selectedQuality;
    configSvc.debug = this.state.debugMode;
    configSvc.soundEnabled = this.state.soundMode;

    storageSvc.set<IHomeParametersStorage>(STORAGES_KEY.ui, this.storage);
  }

  componentWillMount() {
    this.dispatchChanges();

    coreSvc.init().then(() => {
      this.setState({ ready: true });
    });
  }

  componentDidUpdate() {
    this.dispatchChanges();
  }

  handleSubmit = ev => {
    ev.preventDefault();

    const { busy, ready, formValid, seedValue, onlineMode, soundMode } = this.state;
    const { uiManager } = this.props;

    if (busy || !ready || !formValid) {
      return;
    }

    // load world
    this.setState({
      busy: true
    }, () => {
      SoundManager.playWithPromise('click').then(() => {
        // change state after sound has been played
        uiManager.switchState(UIStates.LOADING, {
          seed: seedValue.length ? seedValue.trim() : undefined,
          online: onlineMode,
          sound: soundMode
        } as IUIManagerParameters);
      });
    });
  }

  handleChange = (e) => {
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
    const quality = Number(ev.target.value | 0);
    this.setState({ selectedQuality: quality });
  }

  handleDebugChange = () => {
    const debug = !configSvc.debug;
    this.setState({ debugMode: debug });
  }

  handleOnlineChange = ev => {
    const onlineMode = Number(ev.target.value) === 1;
    this.setState({ onlineMode });
  }

  handleSoundChange = ev => {
    const soundMode = Number(ev.target.value) === 1;
    this.setState({ soundMode });
  }

  /**
   * Get submit button html element
   * @return {JSX.Element}
   */
  getSubmitHTML(): JSX.Element {
    const { busy, ready, formValid } = this.state;
    const coreSvcIsInitialized = ready && formValid;

    return coreSvcIsInitialized
      ? (
        <Button form='gameSetup' type='submit' className='btn--theme btn--expand-mobile btn--big' disabled={busy}>
          {translationSvc.translate('UI.home.form.start_btn')}
        </Button>
      )
      : (
        <span className='loading-text'>chargement...</span>
      );
  }

  render() {
    const { seedValue, selectedQuality, onlineMode, soundMode, image } = this.state;

    return (
      <>
        <CookiesConsent />
        <section className='ui__state home p-2 pt-4 pb-4 pt-2-t pb-2-t'>
          <header className='home__header mt-2-t mt-4-l mb-2'>
            <H2 className='home__subtitle mb-1'>{translationSvc.translate('UI.home.subtitle')}</H2>
            <H1 className='home__title'>{translationSvc.translate('UI.home.title')}</H1>
          </header>
          <div className='home__preview'>
            <ImageWithLoading src={image} alt='world preview' />
          </div>
          <form id='gameSetup' className='home__form form' onSubmit={this.handleSubmit} ref={el => this.form = el}>
            <Row suffix='-48'>
              <Col className='flexcol--24 flexcol--13-t mb-2 mb-0-t'>
                <Row className='form__group mb-2'>
                  <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.seed')}</Col>
                  <Col className='flexcol--24'>
                    <div className='tooltip'>
                      <input type='text' name='seed' placeholder={translationSvc.translate('UI.home.form.seed_placeholder')} onChange={this.handleChange} value={seedValue} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />
                      <div className='tooltip__content'>
                        ?
                        <div className='tooltip__text p-2'>
                          <H4 className='mb-1'>{translationSvc.translate('UI.home.form.seed_tooltip_title')}</H4>
                          <p>{translationSvc.translate('UI.home.form.seed_tooltip_text')}</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className='form__group test'>
                  <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.graphics')}</Col>
                  <Col className='flexcol--8'>
                    <input type='radio' id='qualityLow' name='selectedQuality' onChange={this.handleQualityChange} value={GraphicsQuality.LOW} checked={selectedQuality === GraphicsQuality.LOW} />
                    <label htmlFor='qualityLow' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.low_quality_option')}</label>
                  </Col>
                  <Col className='flexcol--8'>
                    <input type='radio' id='qualityMedium' name='selectedQuality' onChange={this.handleQualityChange} value={GraphicsQuality.MEDIUM} checked={selectedQuality === GraphicsQuality.MEDIUM} />
                    <label htmlFor='qualityMedium' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.medium_quality_option')}</label>
                  </Col>
                  <Col className='flexcol--8'>
                    <input type='radio' id='qualityHigh' name='selectedQuality' onChange={this.handleQualityChange} value={GraphicsQuality.HIGH} checked={selectedQuality === GraphicsQuality.HIGH} />
                    <label htmlFor='qualityHigh' className='ui-click-sound'>{translationSvc.translate('UI.home.form.high_quality_option')}</label>
                  </Col>
                </Row>
              </Col>
              <Col className='flexcol--24 flexcol--11-t'>
                <Row className='form__group mb-2'>
                  <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.gamemode')}</Col>
                  <Col className='flexcol--12'>
                    <input type='radio' id='onlineModeOff' name='onlineMode' onChange={this.handleOnlineChange} value='0' checked={onlineMode === false} />
                    <label htmlFor='onlineModeOff' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.singleplayer_option')}</label>
                  </Col>
                  <Col className='flexcol--12'>
                    <input type='radio' disabled={true} id='onlineModeOn' name='onlineMode' onChange={this.handleOnlineChange} value='1' checked={onlineMode !== false} />
                    <label htmlFor='onlineModeOn' className='ui-click-sound'>{translationSvc.translate('UI.home.form.multiplayer_option')}</label>
                  </Col>
                </Row>
                <Row className='form__group'>
                  <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.soundmode')}</Col>
                  <Col className='flexcol--12'>
                    <input type='radio' id='soundOff' name='soundMode' onChange={this.handleSoundChange} value='0' checked={soundMode === false} />
                    <label htmlFor='soundOff' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.sound_off_option')}</label>
                  </Col>
                  <Col className='flexcol--12'>
                    <input type='radio' id='soundOn' name='soundMode' onChange={this.handleSoundChange} value='1' checked={soundMode !== false} />
                    <label htmlFor='soundOn' className='ui-click-sound'>{translationSvc.translate('UI.home.form.sound_on_option')}</label>
                  </Col>
                </Row>
              </Col>
            </Row>

            {this.renderDebugHtmlFinal()}

            <footer className='home__footer mt-3 mb-2-t mb-4-l'>
              {this.getSubmitHTML()}
            </footer>
          </form>
        </section>
      </>
    );
  }

  /**
   * Get debug html element
   * @return {JSX.Element}
   */
  private renderDebugHtmlFinal(): JSX.Element {
    const { debugMode } = this.state;

    const debugHtml = (
      <div className='form__group mt-2'>
        <input type='checkbox' id='debugMode' onChange={this.handleDebugChange} checked={debugMode === true} />
        <label htmlFor='debugMode'>{translationSvc.translate('UI.home.debug')}</label>
      </div>
    );

    return CommonUtils.isDev() ? debugHtml : null;
  }
}

export default Home;
