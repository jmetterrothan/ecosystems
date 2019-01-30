import Stack from '@shared/Stack';

class Lifo<T> extends Stack<T>
{
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
    return this.list.shift();
  }
}

export default Lifo;
