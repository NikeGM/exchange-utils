export type StorageKey = Array<string|number>|string|number;

export interface IStorage {
	
	set(keys: StorageKey, value: object): Promise<boolean>

	get(keys: StorageKey): Promise<object>

	delete(keys: StorageKey): Promise<boolean>

	has(keys: StorageKey): Promise<boolean>
}
