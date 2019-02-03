import React from 'react';
import classNames from 'classnames';

import { H3 } from '@public/components/hx/hx';

import { translationSvc } from '@app/shared/services/translation.service';

import './contact.styles.scss';

class Contact extends React.PureComponent<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    const { uiManager } = this.props;

    return (
      <div className='tab tab--contact'>
        <header className='tab__header mb-2'>
          <H3 className='color-theme'>{translationSvc.translate('UI.contact.title')}</H3>
        </header>
        <div className='tab__content'>

          <form action='https://formspree.io/hello@3d-ecosystems.com' method='POST'>
            <div>
              <label htmlFor='email'>{translationSvc.translate('UI.contact.email')}</label>
              <input name='email' id='email' type='email' required />
            </div>

            <div>
              <label htmlFor='select'>{translationSvc.translate('UI.contact.subject')}</label>
              <select name='subject' id='select' required>
                <option value='BUG'>{translationSvc.translate('UI.contact.select.bug')}</option>
                <option value='IMPROVEMENT'>{translationSvc.translate('UI.contact.select.improvement')}</option>
                <option value='OTHER'>{translationSvc.translate('UI.contact.select.other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor='message'>{translationSvc.translate('UI.contact.message')}</label>
              <textarea name='message' id='message' required />
            </div>

            <input type='hidden' name='seed' value={uiManager.state.parameters.seed} />

            <button type='submit'>{translationSvc.translate('UI.contact.send')}</button>

          </form>
        </div>
      </div>
    );
  }
}

export default Contact;
