import DiscusFish from '@boids/creatures/DiscusFish';
import TropicalFish from '@app/boids/creatures/TropicalFish';
import ClownFish from '@app/boids/creatures/ClownFish';
import BandedButterflyFish from '@app/boids/creatures/BandedButterflyFish';

class Fish
{
  static getFishClass(m: number) {
    // fish type based on temperature
    let fishClass;

    if (m > 0.75) {
      fishClass = TropicalFish;
    } else if (m > 0.50) {
      fishClass = ClownFish;
    } else if (m > 0.25) {
      fishClass = BandedButterflyFish;
    } else {
      fishClass = DiscusFish;
    }

    return fishClass;
  }
}

export default Fish;
