import React from 'react';
import { Transition } from 'react-spring';

interface IImageWithLoadingProps {
  src: string;
  alt: string;
}

interface IImageWithLoadingState {
  loaded: boolean;
}

class ImageWithLoading extends React.Component<IImageWithLoadingProps, IImageWithLoadingState> {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  onLoad = () => {
    this.setState({
      loaded: true
    });
  }

  render() {
    const { loaded } = this.state;
    const { src, alt } = this.props;

    return (<img onLoad={this.onLoad} style={{ visibility: (loaded ? 'visible' : 'hidden') }} src={src} alt={alt} />);
  }
}

export default ImageWithLoading;
