class MathUtils {

  static rng = null; // current random number generator shared across the app

  static clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
  }

  // https://gist.github.com/RHavar/a6511dea4d4c41aeb1eb
  static randomUint32 = () => {
    if (window && window.crypto && window.crypto.getRandomValues && Uint32Array) {
      const o = new Uint32Array(1);
      window.crypto.getRandomValues(o);
      return o[0];
    }

    console.warn('Falling back to pseudo-random client seed');
    return Math.floor(MathUtils.rng() * Math.pow(2, 32));
  }

  static randomInt = (min: number, max: number): number => {
    return Math.floor(MathUtils.rng() * (max - min + 1)) + min;
  }

  static randomFloat = (min: number, max: number): number => {
    return MathUtils.rng() * (max - min) + min;
  }

  static mapInterval = (t: number, a: number, b: number, c: number, d: number): number => {
    return c + (d - c) / (b - a) * (t - a);
  }

  static lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
}

export default MathUtils;
