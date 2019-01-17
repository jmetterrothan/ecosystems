import React from 'react';

import Row from '@components/Row/row';
import Col from '@components/Col/col';

import { IUIServices, IManager } from '@ui/models/services.model';
import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';

class Home extends React.PureComponent {

  form: HTMLFormElement;
  seedInput: HTMLInputElement;

  state = {
    seedValue: '',
    formValid: true
  };

  handleSubmit = ev => {
    const { uiManager } = this.props;
    ev.preventDefault();

    uiManager.switchState(UI_STATES.LOADING, { seed: this.state.seedValue.length ? this.state.seedValue.trim() : undefined } as IUIManagerParameters);
  }

  handleChange = ev => {

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

  render() {
    return (
      <>
        <Row justify='center'>
          <Col className='col_24' textAlign='center' style={{ margin: '60px 0' }}>Ecosystem</Col>
        </Row>
        <Row justify='center'>
          <Col className='col_6'>
            <form onSubmit={this.handleSubmit} ref={el => this.form = el}>
              <input type='text' className='full' placeholder='seed' onChange={this.handleChange} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />
              <input type='submit' value='jouer' className='full' disabled={!this.state.formValid} />
            </form>
          </Col>
        </Row>
      </>
    );
  }

}

export default Home;
