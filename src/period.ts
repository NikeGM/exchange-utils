export class Period {
	private readonly _symbol = null;

	constructor(periodInput: string|Period) {
		switch (true) {
			case periodInput instanceof Period:
				this._symbol = (periodInput as Period).symbol
				break;
			default:
				this._symbol = (periodInput as string).toUpperCase();
		}
	}

	get symbol(): string {
		return this._symbol;
	}
}