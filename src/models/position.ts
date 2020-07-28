import Decimal from 'decimal.js';

export enum PositionType {
	'LONG' = 'LONG',
	'SHORT' = 'SHORT'
}

export class Position {
	private _type: PositionType;
	private _openPrice: Decimal;
	private _closePrice: Decimal;
	private _size: number;

	public open(type: PositionType, price: Decimal, size: number = 1) {
		this._openPrice = price;
		this._type = type;
		this._size = size;
		this._closePrice = null;
	}

	public close(price: Decimal): Decimal {
		this._closePrice = price;
		return this._type === PositionType.LONG ?
			new Decimal(this._size).mul(this._closePrice.minus(this._openPrice)) :
			new Decimal(this._size).mul(this._openPrice.minus(this._closePrice));
	}

	public isClosed(): boolean {
		return !!this._closePrice;
	}

	public isOpened(): boolean {
		return !!this._openPrice;
	}

	get type(): PositionType {
		return this._type;
	}

}