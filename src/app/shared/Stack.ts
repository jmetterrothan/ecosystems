abstract class Stack<T> {
  protected list: T[];
  protected size: number;

  constructor() {
    this.list = [];
    this.size = 0;
  }

  /**
   * @param {T} item
   */
  abstract push(item: T);

  /**
   * @return {T}
   */
  abstract pop(): T;

  /**
   * @return {boolean}
   */
  isEmpty(): boolean {
    return this.size === 0;
  }
}

export default Stack;
