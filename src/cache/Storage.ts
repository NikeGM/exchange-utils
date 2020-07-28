export type StorageKey = Array<string|number>|string|number;

export abstract class Storage {

	public formKey(keys: StorageKey): string {
		if (typeof keys === 'string' || typeof keys === 'number') return keys.toString();
		return keys.join('__')
	}

	abstract async set(keys: StorageKey, value: object): Promise<boolean>

	abstract async get(keys: StorageKey): Promise<object>

	abstract async delete(keys: StorageKey): Promise<boolean>

	abstract async has(keys: StorageKey): Promise<boolean>
}
