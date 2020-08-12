import { Storage, StorageKey } from './Storage';

const redis = require('redis');
const { promisify } = require('util');


export type RedisOptions = {
  host?: string;
  port?: number;
}

export class RedisStorage extends Storage {
  private readonly _client;

  constructor(options) {
    super();
    this._client = redis.createClient(options);
  }

  async set(keys: StorageKey, value: object): Promise<boolean> {
    return this._setAsync(this.formKey(keys), JSON.stringify(value));
  }

  async get(keys: StorageKey): Promise<object> {
    const result = await this._getAsync(this.formKey(keys))
    return JSON.parse(result);
  }

  async delete(keys: StorageKey): Promise<boolean> {
    return this._delAsync(this.formKey(keys));
  }

  async has(keys: StorageKey): Promise<boolean> {
    return this._existAsync(this.formKey(keys));
  }

  private get _getAsync() {
    return promisify(this._client.get).bind(this._client);
  }

  private get _setAsync() {
    return promisify(this._client.set).bind(this._client);
  }

  private get _delAsync () {
    return promisify(this._client.del).bind(this._client);
  }

  private get _existAsync() {
    return promisify(this._client.exists).bind(this._client);
  }
}

module.exports = RedisStorage;