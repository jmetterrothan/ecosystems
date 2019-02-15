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

  static createBubbleTexture = (color: string) => {
    const width = 1024;
    const height = 1024;
    const radius = 128;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(width / 2 - radius, height / 2 - radius, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  static createStarTexture = (color: string) => {
    const cw = 512;
    const ch = 512;
    const ox = cw / 2;
    const oy = ch / 2;
    const w = 256;
    const h = 256;

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.translate(ox, oy);
    ctx.rotate(45 * Math.PI / 180);
    ctx.translate(-ox, -oy);
    ctx.fillRect(ox - w / 2, oy - h / 2, w, h);
    ctx.closePath();

    return new THREE.CanvasTexture(canvas);
  }

  static createSnowFlakeTexture = (color: string) => {
    return CommonUtils.createStarTexture(color);
  }

  static createRainDropTexture = (color: string) => {
    const cw = 512;
    const ch = 512;
    const ox = cw / 2;
    const oy = ch / 2;
    const w = 128;
    const h = 512;

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(ox - w / 2, oy - h / 2, w, h);
    ctx.closePath();

    return new THREE.CanvasTexture(canvas);
  }
}

export default CommonUtils;
