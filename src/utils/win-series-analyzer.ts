import { factoryParams, IFactory } from '../indicators/factory';
import { buildLineCandlesIntersectionMap } from './line-candle-intersection-map';
import { calculatePositionEvents, calculateWinSeries, TemplateEvents } from './win-series-calculator';
import { MovingAverageFactory } from '../indicators';
import { ExponentialMovingAverageFactory } from '../indicators/exponential-moving-average/exponential-moving-average-factory';
import { Fibonacci, Field } from '../constants';
import { Candle } from '../candle';

const getFactories = async (candles: Candle[], factoryParams: factoryParams) => {
	return {
		ma: new MovingAverageFactory(candles, factoryParams),
		ema: new ExponentialMovingAverageFactory(candles, factoryParams)
	}
}

const calculateWinSeriesByFactoryAndIndicator = async (factory: IFactory<any, any>, paramsIndicator) => {
	const indicator = factory.calculate(paramsIndicator).line;
	const indicatorIMap = buildLineCandlesIntersectionMap(factory.candles, indicator);
	const eventsArray = calculatePositionEvents(factory.candles, indicatorIMap);
	return calculateWinSeries(eventsArray);
}

export const analyzeWinSeries = async (candles, candlesParams: factoryParams) => {
	const factories = await getFactories(candles, candlesParams);
	const maParamsList = {
		average: [50, Fibonacci.F89, 100, Fibonacci.F144, Fibonacci.F233],
		// average: Object.values(Fibonacci).filter(F => typeof F === 'number'),
		// average: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90 , 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
		field: Object.values(Field),
	}
	const allSeries = {
		ma: {},
		ema: {}
	};

	for (let field of maParamsList.field) {
		for (let average of maParamsList.average) {
			const paramsIndicator = { average, field }
			const key = `${field}__${average}__${candlesParams.period.symbol}`;
			console.log('Start calculate', key)
			const maSeries = await calculateWinSeriesByFactoryAndIndicator(factories.ma, paramsIndicator);
			const emaSeries = await calculateWinSeriesByFactoryAndIndicator(factories.ema, paramsIndicator);
			allSeries.ma[key] = {
				series: maSeries,
				positionsCount: calculatePositionsCount(maSeries, candles)
			};
			allSeries.ema[key] = {
				series: emaSeries,
				positionsCount: calculatePositionsCount(emaSeries, candles)
			};
		}
	}
	return allSeries;
}

const calculatePositionsCount = (series, candles) => {
	const candlesInDay = 31560000 / candles[0].mills;
	const days  = candles.length / candlesInDay;
	const win = Object.keys(series).filter(key => Number(key) > 0).reduce((sum, key) => sum + +key * series[key], 0);
	const loose = Object.keys(series).filter(key => Number(key) < 0).reduce((sum, key) => sum + Math.abs(+key) * series[key], 0);
	const winRate = win / (win + loose);
	const maxLoss = Object.keys(series).sort((a, b) => +a - +b)[0];
	const positionPerDay = (win + loose) / days;
	return { win, loose, winRate, maxLoss, positionPerDay }
}

export const calculateTwoLineSeries = (factory, params1, params2) => {
	const indicator1 = factory.calculate(params1).line;
	const indicatorIMap1 = buildLineCandlesIntersectionMap(factory.candles, indicator1);
	const eventsArray1 = calculatePositionEvents(factory.candles, indicatorIMap1);
	const indicator2 = factory.calculate(params2).line;
	const indicatorIMap2 = buildLineCandlesIntersectionMap(factory.candles, indicator2);
	const eventsArray2 = calculatePositionEvents(factory.candles, indicatorIMap2);
	const openEvents = eventsArray1.filter(event =>
		event.event !== TemplateEvents.SHORT_CLOSE && event.event !== TemplateEvents.LONG_CLOSE
	)
	const closeEvents = eventsArray2.filter(event =>
		event.event !== TemplateEvents.SHORT_OPEN && event.event !== TemplateEvents.LONG_OPEN
	)
	const eventsArray = [].concat(openEvents).concat(closeEvents).sort((e1, e2) => e1.data.time - e2.data.time);
	return eventsArray
}

export const analyzeTwoLineSeries = async (candles, candlesParams: factoryParams) => {
	const factories = await getFactories(candles, candlesParams);
	const param1 = { average: Fibonacci.F233, field: Field.Close };
	const param2 = { average: 50, field: Field.Close };
	const eventsArray = calculateTwoLineSeries(factories.ema, param1, param2);
	const winSeries = calculateWinSeries(eventsArray);
	console.log(winSeries);
	return winSeries
}
