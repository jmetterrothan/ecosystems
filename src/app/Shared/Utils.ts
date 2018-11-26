class Utils {

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
    return Math.floor(Math.random() * Math.pow(2, 32));
  }
}

export default Utils;
