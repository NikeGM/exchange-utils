import { Storage, StorageKey } from './Storage';

export class LocalStorage extends Storage {
  private readonly _storage;

  constructor() {
    super();
    this._storage = {};
  }

  async set(keys: StorageKey, value: object): Promise<boolean> {
      this._storage[this.formKey(keys)] = value;
      return Promise.resolve(true);
  }

  async get(keys: StorageKey): Promise<object> {
    const result = this._storage[this.formKey(keys)]
    return JSON.parse(result);
  }

  async delete(keys: StorageKey): Promise<boolean> {
      delete this._storage[this.formKey(keys)];
      return Promise.resolve(true);
  }

  async has(keys: StorageKey): Promise<boolean> {
      return !!this._storage[this.formKey(keys)];
  }
}

module.exports = LocalStorage;