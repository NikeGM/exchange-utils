import { Container } from './container';

import { Period } from './models/period';
import { Fibonacci, Field } from './constants';
import { Candle } from './models/candle';
import { MovingAverageFactory } from './indicators';
import { ExponentialMovingAverageFactory } from './indicators/exponential-moving-average/exponential-moving-average-factory';
import { factoryParams } from './indicators/factory';
import { IntersectionType } from './utils/line-candle-intersection-map';
import { analyzeWinSeries } from './utils/win-series-analyzer';

const container = new Container();

const getFactories = (candles: Candle[], params: factoryParams) => {
	return {
		ma: new MovingAverageFactory(candles, params),
		ema: new ExponentialMovingAverageFactory(candles, params)
	}
}

const run = async () => {
	const paramsCandles = { code: 'GAZP', period: new Period('H1'), name: 'GAZP' };
	const candles = await container.repositories.candleDbRepository.getWithCache(paramsCandles);
	const factories = getFactories(candles, paramsCandles)
	for (let field of Object.values(Field)) {
		for (let average of Object.values(Fibonacci).filter(F => typeof F === 'number')) {
			for (let factory of [factories.ma, factories.ema]) {
				for (let openLong of [[IntersectionType.DOWN, IntersectionType.UP, IntersectionType.UP], [IntersectionType.DOWN, IntersectionType.UP]]) {
					for (let closeLong of [[IntersectionType.UP, IntersectionType.DOWN, IntersectionType.DOWN], [IntersectionType.UP, IntersectionType.DOWN]]) {
						for (let diff of [5, 10, 15, 20, 25]) {
							for (let percentageDiff of [0, 2, 5]) {
								const result = await analyzeWinSeries({
									field, average, factory, closeLong, openLong, diff, percentageDiff, candlesParams: paramsCandles
								})
								console.log(result);
							}
						}
					}
				}
			}
		}
	}
}

run().then()