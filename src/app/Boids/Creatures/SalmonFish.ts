import MathUtils from '@utils/Math.utils';
import Creature from '@boids/Creatures/Creature';

class SalmonFish extends Creature {
  constructor() {
    super(['fish2'], {
      speed: 6750,
      neighbourRadius: 10000,
      alignmentWeighting: 0.0065,
      cohesionWeighting: 0.01,
      separationWeighting: 0.35,
      viewAngle: 12,
      underwater: true,
      minRepulseDistance: 30000,
      scale: MathUtils.randomFloat(0.75, 1.25)
    });
  }
}

export default SalmonFish;
