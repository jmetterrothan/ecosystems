class Fifo<T>
{
  private list: T[];
  private size: number;

  constructor() {
    this.list = [];
    this.size = 0;
  }

  /**
   * @param {T} item
   */
  push(item: T) {
    this.size++;
    this.list.push(item);
  }

  /**
   * @return {T}
   */
  pop(): T {
    this.size--;
    return this.list.pop();
  }

  /**
   * @return {boolean}
   */
  get empty(): boolean {
    return this.size === 0;
  }
}

export default Fifo;
