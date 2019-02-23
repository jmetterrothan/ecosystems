import MathUtils from '@utils/Math.utils';
import Creature from '@boids/creatures/Creature';

class Butterfly extends Creature {
  static VARIANTS: string[] = ['butterfly', 'butterfly2', 'butterfly3', 'butterfly4'];

  constructor(names: string | string[]) {
    super([].concat(names), {
      speed: 7500,
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

  static getButterflyVariant() {
    return Butterfly.VARIANTS[MathUtils.randomInt(0, Butterfly.VARIANTS.length - 1)];
  }
}

export default Butterfly;
