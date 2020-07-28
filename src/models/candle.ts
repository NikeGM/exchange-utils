import { Decimal } from 'decimal.js';
import { Period } from './period';

export type CandleData = {
	high: string|Decimal;
	volume: string|Decimal;
	open: string|Decimal;
	close: string|Decimal;
	low: string|Decimal;
	typical?: string|Decimal;
	weightedClose?: string|Decimal;
	median?: string|Decimal;
	time: string|number;
	period: string|Period;
	name: string;
	code: string;
}

export class Candle {
	private readonly _high: Decimal;
	private readonly _open: Decimal;
	private readonly _close: Decimal;
	private readonly _low: Decimal;
	private readonly _volume: Decimal;
	private readonly _time: number;
	private readonly _period: Period;
	private readonly _typical: Decimal;
	private readonly _weightedClose: Decimal;
	private readonly _median: Decimal;
	private readonly _name: string;
	private readonly _code: string;

	constructor(candleData: CandleData) {
		const { high, open, low, close, volume, period, typical, median, weightedClose, name, code, time } = candleData;
		this._high = new Decimal(high);
		this._open = new Decimal(open);
		this._close = new Decimal(close);
		this._low = new Decimal(low);
		this._volume = new Decimal(volume);
		this._period = new Period(period);
		this._time = +time;
		this._typical = typical ? new Decimal(typical) : this._high.plus(this._low).plus(this._close).div(3);
		this._median = median ? new Decimal(median) : this._high.plus(this._low).div(2);
		this._weightedClose = weightedClose ? new Decimal(weightedClose) :
			this._high.plus(this._low).plus(this._close.mul(2)).div(4);
		this._name = name;
		this._code = code
	}

	get high(): Decimal {
		return this._high;
	}

	get low(): Decimal {
		return this._low;
	}

	get close(): Decimal {
		return this._close;
	}

	get open(): Decimal {
		return this._open;
	}

	get volume(): Decimal {
		return this._volume;
	}

	get typical(): Decimal {
		return this._typical;
	}

	get median(): Decimal {
		return this._median;
	}

	get weightedClose(): Decimal {
		return this._weightedClose;
	}

	get weighted_close(): Decimal {
		return this._weightedClose;
	}

	get time(): number {
		return this._time;
	}

	get date(): string {
		return new Date(this._time).toLocaleString();
	}

	get name(): string {
		return this._name;
	}

	get code(): string {
		return this._code;
	}

	get period(): Period {
		return this._period;
	}

	get mills(): number {
		const literal = this.period.symbol.slice(0, 1);
		const map = {
			M: 60000,
			H: 3600000,
			D: 86400000
		}
		const duration = +this.period.symbol.slice(1);
		return map[literal] * duration;
	}
}