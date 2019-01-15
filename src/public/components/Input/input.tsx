import React from 'react';

interface Props extends React.InputHTMLAttributes {
  regex?: string;
}

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      valid: !props.required
    };
  }

  handleChange = ev => {
    this.setState({
      value: this.input.value
    }, () => this.validate());
  }

  validate = () => {
    const { regex, required } = this.props;

    if (regex && regex.length) {
      this.setState({ valid: RegExp(regex).test(this.state.value) && required ? this.state.value.length : true });
    } else if (required) {
      this.setState({ valid: this.state.value.length });
    }
  }

  render() {
    const { className, regex, ...rest } = this.props;

    return (
      <input onChange={this.handleChange} className={className || ''} ref={el => this.input = el} formNoValidate={!this.state.valid} {...rest} />
    );
  }

}

export default Input;
