import React from 'react';
import Slider from 'react-slick';

import './tutorial.styles';

class Tutorial extends React.Component {

  render() {
    return (
      <Slider style={{ width: '80%' }} dots={true} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
        <div>Page 1</div>
        <div>Page 2</div>
        <div>Page 3</div>
        <div>Page 4</div>
      </Slider>
    );
  }

}

export default Tutorial;
