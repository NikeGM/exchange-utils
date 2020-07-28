import { Decimal } from 'decimal.js';
import { Period } from '../models/period';
import { Line } from '../utils/line-candle-intersection-map';


export class Indicator<T> {
	private _period: Period;
	private _indicator: { [key: string]: Decimal } = {}
	private _timeSeries: string[] = [];
	private readonly _params: T

	constructor(period: Period, params: T) {
		this._period = new Period(period)
		this._params = params;
	}

	public addValues(items: { [time: string]: string|number|Decimal }) {
		Object.keys(items).forEach(key => {
			this._indicator[key] = items[key] ? new Decimal(items[key]) : null;
			this._timeSeries.push(key);
		});
		this._timeSeries.sort();
	}

	public value(time: string|number): Decimal {
		return this._indicator[time];
	}

	public next(time: string|number): Decimal {
		const index = this._timeSeries.indexOf(time.toString());
		const nextTime = this._timeSeries[index + 1];
		return index > 0 && !!nextTime ? this._indicator[nextTime] : null;
	}

	public previous(time: string|number): Decimal {
		const index = this._timeSeries.indexOf(time.toString());
		const previousTime = this._timeSeries[index - 1]
		return index > 0 && !!previousTime ? this._indicator[previousTime] : null;
	}

	get first(): { time: string, value: Decimal } {
		const time = this._timeSeries[0]
		return { time, value: this._indicator[time] };
	}

	get last(): { time: string, value: Decimal } {
		const time = this._timeSeries[this._timeSeries.length - 1];
		return { time, value: this._indicator[time] };
	}

	get line(): Line {
		return this._indicator;
	}

	get params(): T {
		return this._params;
	}
}
