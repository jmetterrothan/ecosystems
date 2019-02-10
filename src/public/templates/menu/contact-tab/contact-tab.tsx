import React from 'react';
import classNames from 'classnames';

import Row from '@components/row/row';
import Col from '@components/col/col';
import { H3 } from '@public/components/hx/hx';
import Button from '@public/components/button/button';

import { translationSvc } from '@app/shared/services/translation.service';

import './contact-tab.styles.scss';

class ContactTab extends React.PureComponent<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    const { uiManager } = this.props;

    return (
      <div className='tab contact-tab'>
        <header className='tab__header mb-2'>
          <H3 className='color-theme'>{translationSvc.translate('UI.contact-tab.title')}</H3>
        </header>
        <div className='tab__content'>
          <form className='form' action='https://formspree.io/hello@3d-ecosystems.com' method='POST'>
            <header className='form__header'>
              <p className='paragraph mb-2'>{translationSvc.translate('UI.contact-tab.header')}</p>
            </header>
            <Row className='form__group mb-2'>
              <Col className='flexcol--24'>
                <label className='form__label mb-1' htmlFor='email'>{translationSvc.translate('UI.contact-tab.email')}</label>
                <input className='form__element' name='email' id='email' type='email' required />
              </Col>
            </Row>
            <Row className='form__group mb-2'>
              <Col className='flexcol--24'>
                <label className='form__label mb-1' htmlFor='select'>{translationSvc.translate('UI.contact-tab.subject')}</label>
                <select className='form__element' name='subject' id='select' required>
                  <option value='BUG'>{translationSvc.translate('UI.contact-tab.select.bug')}</option>
                  <option value='IMPROVEMENT'>{translationSvc.translate('UI.contact-tab.select.improvement')}</option>
                  <option value='OTHER'>{translationSvc.translate('UI.contact-tab.select.other')}</option>
                </select>
              </Col>
            </Row>

            <Row className='form__group mb-2'>
              <Col className='flexcol--24'>
                <label className='form__label mb-1' htmlFor='message'>{translationSvc.translate('UI.contact-tab.message')}</label>
                <textarea className='form__element' name='message' id='message' rows={8} required />
              </Col>
            </Row>
            <Row className='form__group mb-2'>
              <Col className='flexcol--24 flex justify-content--end'>
                <input type='hidden' name='seed' value={uiManager.state.parameters.seed} />
                <Button className='btn--theme' type='submit'>{translationSvc.translate('UI.contact-tab.send')}</Button>
              </Col>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}

export default ContactTab;
