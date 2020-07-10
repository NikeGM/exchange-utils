import Decimal from 'decimal.js';
import { Candle } from '../candle';

export const averageCandle = (candles: Candle[])=> {
	let sum = new Decimal(0);
	candles.forEach(candle => {
		sum = sum.plus(Decimal.abs(candle.high.minus(candle.low)));
	})
	return +sum.div(candles.length);
}