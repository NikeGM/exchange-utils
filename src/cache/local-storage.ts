import { IStorage, StorageKey } from './Storage';

export class LocalStorage implements IStorage {
  private readonly _storage;

  constructor() {
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

  private formKey(keys: StorageKey): string {
    if (typeof keys === 'string' || typeof keys === 'number') return keys.toString();
    return keys.join('__')
  }
}

module.exports = LocalStorage;