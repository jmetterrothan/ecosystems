class Stack<T>
{
  private list: T[];
  private size: number;

  constructor() {
    this.list = [];
    this.size = 0;
  }

  push(item: T) {
    this.size++;
    this.list.push(item);
  }

  pop(): T {
    this.size--;
    return this.list.pop();
  }

  get empty(): boolean {
    return this.size === 0;
  }
}

export default Stack;
