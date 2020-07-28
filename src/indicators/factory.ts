import { Candle } from '../models/candle';
import { Period } from '../models/period';

export type factoryParams = {
	period: Period;
	name: string;
	code: string;
}

export interface IFactory<T1, T2> {
	candles: Candle[];
	signature: string;
	calculate(params: T1): T2
}