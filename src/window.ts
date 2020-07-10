export class Window {
  private readonly _size: number = null;
  private readonly _executor: Function = null;
  private _items: any[] = [];
  private _previousResult = null;
  private _addedValue = null;
  private _deletedValue = null ;

  constructor(size: number, executor: Function) {
    this._size = size;
    this._executor = executor;
  }

  add(item) {
    this._addedValue = item;
    this._items.unshift(item);
    if (this._items.length > this._size) {
      this._deletedValue = this._items.pop();
    }
  }

  execute(item) {
    this.add(item);
    const result = this._items.length === this._size ?
      this._executor(this._items, this._previousResult, this._deletedValue, this._addedValue, this._size) :
      null;
    this._previousResult = result;
    return result;
  }
}