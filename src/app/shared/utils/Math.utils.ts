class MathUtils {
  static TWO_PI = Math.PI * 2;
  static rng = null; // current random number generator shared across the app

  /**
   * Clamp a value
   * @param {number} x
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
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

  /**
   * Random integer (inclusive)
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  static randomInt = (min: number, max: number): number => {
    return Math.floor(MathUtils.rng() * (max - min + 1)) + min;
  }

  /**
   * Random float (inclusive)
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  static randomFloat = (min: number, max: number): number => {
    return MathUtils.rng() * (max - min) + min;
  }

  static between = (x: number, min: number, max: number): boolean => {
    return x >= min && x <= max;
  }

  /**
   * Map interval [a, b] => [c, d]
   * @param {number} t
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {number}
   */
  static mapInterval = (t: number, a: number, b: number, c: number, d: number): number => {
    return c + (d - c) / (b - a) * (t - a);
  }

  static percent(a: number, b: number, ceil: boolean = false): number {
    return ceil
      ? Math.ceil((a / b) * 100)
      : (a / b) * 100;
  }

  /**
   * Linear interpolation
   * @param {number} a
   * @param {number} b
   * @param {number} t
   * @return {number}
   */
  static lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  /**
   * @param {array} x
   * @param {number} mean
   * @param {number} std
   * @return {array}
   */
  static normalize(x: any[], mean: number, std: number): any[] {
    return x.map((x: any) => (x - mean) / std);
  }
}

export default MathUtils;
