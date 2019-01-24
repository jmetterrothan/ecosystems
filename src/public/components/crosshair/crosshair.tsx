import React from 'react';
import classNames from 'classnames';
import { Subscription } from 'rxjs';

import { ICrosshairStatus } from '@app/shared/models/crosshair.model';
import { crosshairSvc } from '@app/ui/services/crosshair.service';

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
    const validClass = status.valid ? 'crosshair--valid' : 'crosshair--invalid';
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
}

export default Crosshair;
