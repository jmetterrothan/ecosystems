import React from 'react';
import classNames from 'classnames';
import { Subscription } from 'rxjs';

import { ICrosshairStatus } from '@app/shared/models/crosshair.model';
import { crosshairSvc } from '@app/ui/services/crosshair.service';

import { CROSSHAIR_STATES } from '@app/ui/enums/CrosshairState.enum';

import './crosshair.styles';

interface ICrosshairProps { }
interface ICrosshairState {
  status: ICrosshairStatus;
}

class Crosshair extends React.Component<ICrosshairProps, ICrosshairState> {
  private subscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      status: crosshairSvc.status
    };
  }

  componentWillMount() {
    this.subscription = crosshairSvc.status$.subscribe((status) => {
      this.setState({ status });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { status } = this.state;

    const showClass = !status.show ? 'crosshair--hide' : null;
    const validClass = this.getStateClass();
    const shakeClass = status.shake ? 'crosshair--shake' : null;

    return (
      <div className={classNames('crosshair crosshair--diamond', showClass, validClass, shakeClass)}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  getStateClass(): string {
    const state = this.state.status.state;
    switch (state) {
      case CROSSHAIR_STATES.CAN_PLACE_OBJECT: return 'crosshair--can-place-object';
      case CROSSHAIR_STATES.CAN_INTERACT_WITH_OBJECT: return 'crosshair--can-interact';
      case CROSSHAIR_STATES.CAN_REMOVE_OBJECT: return 'crosshair--can-remove-object';
      default: return 'crosshair--no-action';
    }
  }
}

export default Crosshair;
