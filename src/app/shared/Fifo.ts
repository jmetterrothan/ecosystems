import Stack from '@shared/Stack';

class Fifo<T> extends Stack<T>
{
  push(item: T) {
    this.size++;
    this.list.push(item);
  }

  pop(): T {
    this.size--;
    return this.list.pop();
  }
}

export default Fifo;
