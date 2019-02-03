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
    return (
      <div className='tab tab--contact'>
        <header className='tab__header mb-2'>
          <H3 className='color-theme'>{translationSvc.translate('UI.contact.title')}</H3>
        </header>
        <div className='tab__content'>
          <p className='paragraph'>
            <a className='link' href='mailto:hello@3d-ecosystems.com'>hello@3d-ecosystems.com</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Contact;
