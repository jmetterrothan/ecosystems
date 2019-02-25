import MathUtils from '@utils/Math.utils';
import Creature from '@boids/creatures/Creature';

class Bee extends Creature {
  constructor() {
    super(['bee'], {
      speed: 17500,
      neighbourRadius: 6000,
      alignmentWeighting: 0.005,
      cohesionWeighting: 0.075,
      separationWeighting: 0.1,
      viewAngle: 12,
      underwater: false,
      minRepulseDistance: 30000,
      scale: MathUtils.randomFloat(0.85, 1.15)
    });
  }
}

export default Bee;
