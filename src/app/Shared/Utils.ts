class Utils {
  static rng = new Math.seedrandom(); // current random number generator shared across the app

  static isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

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
    return Math.floor(Utils.rng() * Math.pow(2, 32));
  }

  static randomInt = (min: number, max: number): number => {
    return Math.floor(Utils.rng() * (max - min + 1)) + min;
  }

  static randomFloat = (min: number, max: number): number => {
    return Utils.rng() * (max - min) + min;
  }

  static degToRad = (deg: number): number => {
    return (deg * Math.PI) / 180;
  }

  static radToDeg = (rad: number): number => {
    return (180 / Math.PI) * rad;
  }
}

export default Utils;
