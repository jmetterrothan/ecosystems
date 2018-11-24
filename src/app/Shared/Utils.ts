class Utils {

  static isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  static clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
  }
}

export default Utils;
