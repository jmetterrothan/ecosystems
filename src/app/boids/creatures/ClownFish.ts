import MathUtils from '@utils/Math.utils';
import Creature from '@boids/creatures/Creature';

class ClownFish extends Creature {
  constructor() {
    super(['fish5'], {
      speed: 8500,
      neighbourRadius: 4000,
      alignmentWeighting: 0.0065,
      cohesionWeighting: 0.01,
      separationWeighting: 0.075,
      viewAngle: 8,
      underwater: true,
      minRepulseDistance: 30000,
      scale: MathUtils.randomFloat(0.5, 1.0)
    });
  }
}

export default ClownFish;
