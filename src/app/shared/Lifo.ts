import Stack from '@shared/Stack';

class Lifo<T> extends Stack<T>
{
  push(item: T) {
    this.size++;
    this.list.push(item);
  }

  pop(): T {
    this.size--;
    return this.list.shift();
  }
}

export default Lifo;
