import { Decimal } from 'decimal.js';
import { Period } from '../../period';
import { Candle } from '../../candle';
import { ExponentialMovingAverageIndicator, ExponentialMovingAverageParams } from './exponential-moving-average';
import { factoryParams, IFactory } from '../factory';


export class ExponentialMovingAverageFactory implements IFactory<ExponentialMovingAverageParams, ExponentialMovingAverageIndicator>{
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

	public calculate(params: ExponentialMovingAverageParams): ExponentialMovingAverageIndicator {
		const { average, field } = params;
		let previous = new Decimal(0);
		const indicator = {};
		this.candles.forEach(candle => {
			const alpha = new Decimal(1).div(new Decimal(1).plus(average));
			indicator[candle.time] = alpha.mul(candle[field]).plus(new Decimal(1).minus(alpha).mul(previous));
			previous = indicator[candle.time];
		});

		const ma = new ExponentialMovingAverageIndicator(this._period, params);
		ma.addValues(indicator)
		return ma;
	}

	get candles(): Candle[] {
		return this._candles;
	}
}