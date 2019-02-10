import React from 'react';
import { Transition } from 'react-spring';

import { storageSvc } from '@app/shared/services/storage.service';
import { translationSvc } from '@app/shared/services/translation.service';

import './cookies-consent.styles';

interface ICookiesConsentState {
  show: boolean;
}

class CookiesConsent extends React.Component<any, ICookiesConsentState> {

  static COOKIES_STORAGE_KEY: string = 'COOKIES';

  constructor(props) {
    super(props);

    this.state = {
      show: storageSvc.get(CookiesConsent.COOKIES_STORAGE_KEY) === null
    };
  }

  /**
   * Defines consent 'cookie' value in localStorage
   * @param {boolean} b
   */
  consentCookies = (b: boolean) => {
    storageSvc.set(CookiesConsent.COOKIES_STORAGE_KEY, b);
    this.setState({
      show: false
    });
  }

  render() {
    const { show } = this.state;
    // <a href='#' className='link'>{translationSvc.translate('UI.cookies.more')}</a>

    return (
      <Transition items={show} from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {show => show && (props => <div style={props} className='cookies-consent p-2 pl-3 pr-3'>
          <p className='cookies-consent__text mb-2'>{translationSvc.translate('UI.cookies.message')}</p>
          <div className='cookies-consent__choices'>
            <button onClick={() => this.consentCookies(false)} className='cookies-consent__btn cookies-consent__btn--decline mr-2 ui-click-sound'>{translationSvc.translate('UI.cookies.decline')}</button>
            <button onClick={() => this.consentCookies(true)} className='cookies-consent__btn cookies-consent__btn--accept ui-click-sound'>{translationSvc.translate('UI.cookies.allow')}</button>
          </div>
        </div>)}
      </Transition>
    );
  }
}

export default CookiesConsent;
