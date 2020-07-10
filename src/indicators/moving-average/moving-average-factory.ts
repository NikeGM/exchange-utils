import { Decimal } from 'decimal.js';
import { MovingAverageIndicator, MovingAverageParams } from './moving-average';
import { Period } from '../../period';
import { Candle } from '../../candle';
import { Window } from '../../window';
import { factoryParams, IFactory } from '../factory';

export type MovingAverageFactoryParams = {
	period: Period;
	name: string;
	code: string;
}

export class MovingAverageFactory implements IFactory<MovingAverageParams, MovingAverageIndicator> {
	private readonly _period: Period;
	private readonly _name?: string;
	private readonly _code: string;
	private readonly _candles: Candle[];

	constructor(candles: Candle[], params: factoryParams) {
		const { period, name, code } = params;
		this._period = new Period(period);
		this._name = name;
		this._code = code;
		this._candles = candles;
	}

	public calculate(params: MovingAverageParams): MovingAverageIndicator {
		const { average, field } = params
		const window = new Window(average, this._executor);
		const indicator = {};
		this._candles.forEach(candle => {
			const indicatorData = window.execute({ time: candle.time, value: candle[field] });
			indicator[candle.time] = indicatorData ? indicatorData.value : null;
		});
		const ma = new MovingAverageIndicator(this._period, params);
		ma.addValues(indicator)
		return ma;
	}

	get candles(): Candle[] {
		return this._candles;
	}

	private _executor(
		items: { time: number, value: Decimal }[],
		previousResult: { time: number, value: Decimal },
		deletedValue: { time: number, value: Decimal },
		addedValue: { time: number, value: Decimal },
		size
	): { time: number, value: Decimal } {
		return {
			time: items[0].time,
			value: previousResult ?
				previousResult.value.minus(deletedValue.value.div(size)).plus(addedValue.value.div(size)) :
				items.reduce((res, cur) => res.plus(cur.value), new Decimal(0)).div(items.length)
		}
	}
}