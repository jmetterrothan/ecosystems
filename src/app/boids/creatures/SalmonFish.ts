import MathUtils from '@utils/Math.utils';
import Creature from '@boids/creatures/Creature';

class SalmonFish extends Creature {
  constructor() {
    super(['fish2'], {
      speed: 6750,
      neighbourRadius: 6000,
      alignmentWeighting: 0.0065,
      cohesionWeighting: 0.01,
      separationWeighting: 0.1,
      viewAngle: 8,
      underwater: true,
      minRepulseDistance: 30000,
      scale: MathUtils.randomFloat(0.25, 0.75)
    });
  }
}

export default SalmonFish;
