import * as THREE from 'three';

class CommonUtils {
  static isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * A linear interpolator for hexadecimal colors
   * https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
   * @param {string} a
   * @param {string} b
   * @param {number} amount
   * @returns {string}
   */
  static lerpColor(a: string, b: string, amount: number): string {
    const ah = parseInt(String(a).replace(/#/g, ''), 16);
    const ar = ah >> 16;
    const ag = ah >> 8 & 0xff;
    const ab = ah & 0xff;
    const bh = parseInt(String(b).replace(/#/g, ''), 16);
    const br = bh >> 16;
    const bg = bh >> 8 & 0xff;
    const bb = bh & 0xff;
    const rr = ar + amount * (br - ar);
    const rg = ag + amount * (bg - ag);
    const rb = ab + amount * (bb - ab);

    /* tslint:disable */
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    /* tslint:enable */
  }

  /**
   * Convert array of string to object and init all keys with value
   * @param {string[]} array
   * @param {any} default value
   * @returns {Object}
   */
  static arrayToObject(array: string[], value: any): Object {
    return array.reduce((obj, item) => {
      obj[item] = value;
      return obj;
    }, {});
  }

  static objectToArray(obj: Object): any[] {
    return Object.values(obj);
  }

  static valueIsInObject(obj: Object, value: string | number): boolean {
    return Object.values(obj).includes(value);
  }

  static shuffleArray(arr: any[]): any[] {
    return arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  static getObjectPlacedNameForAchievement(objectName: string): string {
    return `object_${objectName}_placed`;
  }

  static formatNumberWithSpaces(x): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  static createStarTexture = (color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.translate(16, 16);
    ctx.rotate(45 * Math.PI / 180);
    ctx.translate(-16, -16);
    ctx.fillRect(16 - 8, 16 - 8, 16, 16);
    return new THREE.CanvasTexture(canvas);
  }

  static createSnowFlakeTexture = (color: string) => {
    return CommonUtils.createStarTexture(color);
  }

  static createRainDropTexture = (color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(16 - 4, 0, 8, 32);
    return new THREE.CanvasTexture(canvas);
  }
}

export default CommonUtils;
