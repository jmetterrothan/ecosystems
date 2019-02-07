import React, { KeyboardEvent } from 'react';
import classNames from 'classnames';

import { translationSvc } from '@app/shared/services/translation.service';

import { Keys, KeyAction } from '@app/shared/constants/keys.constants';

import './tutorial-action-key.styles';

enum TutorialActionKeyMode {
  VIEW, EDIT
}

type ITutorialActionKeyProps = {
  action: KeyAction,
  size?: number;
  className?: string
  canEdit?: boolean;
};

type ITutorialActionKeyState = {
  mode: TutorialActionKeyMode;
};

class TutorialActionKey extends React.Component<ITutorialActionKeyProps, ITutorialActionKeyState> {
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);

    this.state = {
      mode: TutorialActionKeyMode.VIEW
    };

    this.inputRef = React.createRef();
  }

  changeMode = (mode: TutorialActionKeyMode) => {
    if (this.props.canEdit) {
      this.setState({
        mode
      }, () => {
        if (mode === TutorialActionKeyMode.EDIT) {
          this.inputRef.current.focus();
        }
      });
    }
  }

  changeKey = (e: KeyboardEvent) => {
    e.preventDefault();
    const { action } = this.props;

    this.setState({ key: e.key });
    Keys[action] = e.key;
    return false;
  }

  render() {
    const { className, action, size = 1, canEdit } = this.props;
    const { mode } = this.state;

    const name = Keys[action];
    const text = translationSvc.translate(`UI.tutorial-tab.actionkey.${action.toLowerCase()}`);

    const viewMode = <span onClick={() => this.changeMode(TutorialActionKeyMode.EDIT)} className={classNames('tutorial-action__name', `tutorial-action__name--size${size}x`)}>{name}</span>;
    const editMode = <input
      autoComplete='off'
      autoCorrect='off'
      spellCheck='off'
      className={classNames('tutorial-action__input', `tutorial-action__input--size${size}x`)}
      ref={this.inputRef}
      onKeyDown={this.changeKey}
      onChange={e => e.preventDefault()}
      onBlur={() => this.changeMode(TutorialActionKeyMode.VIEW)}
      type='text'
      value={this.state.key || name} />;

    return (
      <div className={classNames('tutorial-action', canEdit && 'tutorial-action--can-edit', className)}>
        {mode === TutorialActionKeyMode.EDIT ? editMode : viewMode}
        <p className='tutorial-action__text ml-2'>{text}</p>
      </div>
    );
  }
}

export default TutorialActionKey;
