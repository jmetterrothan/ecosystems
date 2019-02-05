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

  static intersectArrays(a: any[], b: any[], key?: string): any[] {
    console.log('b', [...new Set(b)]);
    return [...new Set(a)].filter(x => new Set(b).has(x));
  }

  static getObjectPlacedNameForAchievement(objectName: string): string {
    return `object_${objectName}_placed`;
  }

  static formatNumberWithSpaces(x): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

export default CommonUtils;
