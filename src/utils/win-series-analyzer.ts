import { factoryParams, IFactory } from '../indicators/factory';
import { IntersectionType } from './line-candle-intersection-map';
import { Field } from '../constants';
import { calculateWinSeries } from '../handlers/wl-handler';
import { oneLineTemplateHandler } from '../handlers/oc-template-handler';

const calculateWinSeriesByFactoryAndIndicator = async (params: analyzeParams) => {
	const eventsArray = oneLineTemplateHandler(params);
	return calculateWinSeries(eventsArray, params.percentageDiff);
}

export type analyzeParams = {
	field: Field;
	average: number | string;
	candlesParams: factoryParams;
	factory: IFactory<any, any>;
	openLong: IntersectionType[];
	closeLong: IntersectionType[];
	diff: number;
	percentageDiff: number;
}

export const analyzeWinSeries = async (params: analyzeParams) => {
	const { average, field, candlesParams, factory, openLong, closeLong, diff, percentageDiff } = params;
	const result = [];
	const winSeries = await calculateWinSeriesByFactoryAndIndicator(params);
	const analyzed = calculatePositionsCount(winSeries, factory.candles);
	analyzed['signature'] = {
		field, average, candlesParams, factory: factory.signature, openLong, closeLong, diff, percentageDiff
	}
	console.log('Signature', analyzed['signature']);
	result.push(analyzed)
	return result;
}

const calculatePositionsCount = (series, candles) => {
	const candlesInDay = 31560000 / candles[0].mills;
	const days = candles.length / candlesInDay;
	const win = Object.keys(series).filter(key => Number(key) > 0).reduce((sum, key) => sum + +key * series[key], 0);
	const loose = Object.keys(series).filter(key => Number(key) < 0).reduce((sum, key) => sum + Math.abs(+key) * series[key], 0);
	const winRate = win / (win + loose);
	const maxLoss = Object.keys(series).sort((a, b) => +a - +b)[0];
	const positionPerDay = (win + loose) / days;
	return { win, loose, winRate, maxLoss, positionPerDay }
}

// export const calculateTwoLineSeries = (factory1, factory2, params1, params2) => {
// 	const indicator1 = factory1.calculate(params1).line;
// 	const indicatorIMap1 = buildLineCandlesIntersectionMap(factory1.candles, indicator1);
// 	const eventsArray1 = calculatePositionEvents(factory1.candles, indicatorIMap1);
// 	const indicator2 = factory2.calculate(params2).line;
// 	const indicatorIMap2 = buildLineCandlesIntersectionMap(factory2.candles, indicator2);
// 	const eventsArray2 = calculatePositionEvents(factory2.candles, indicatorIMap2);
// 	const openEvents = eventsArray1.filter(event =>
// 		event.event !== TemplateEvents.SHORT_CLOSE && event.event !== TemplateEvents.LONG_CLOSE
// 	)
// 	const closeEvents = eventsArray2.filter(event =>
// 		event.event !== TemplateEvents.SHORT_OPEN && event.event !== TemplateEvents.LONG_OPEN
// 	)
// 	const eventsArray = [].concat(openEvents).concat(closeEvents).sort((e1, e2) => e1.data.time - e2.data.time);
// 	return eventsArray
// }
//
// export const analyzeTwoLineSeries = async (candles, candlesParams: factoryParams) => {
// 	const results = [];
// 	const factories = await getFactories(candles, candlesParams);
// 	// for (let average1 of [89, 100, 130, 150, 200, 233, 250, 300]) {
// 	// 	for (let average2 of [2, 3, 5, 10, 20, 50, 75]) {
// 	// 		for (let field1 of Object.values(Field)) {
// 	// 			for (let field2 of Object.values(Field)) {
// 	// 				for (let factory1 of [factories.ema, factories.ma]) {
// 	// 					for (let factory2 of [factories.ema, factories.ma]) {
// 	// 						const param1 = { average: average1, field: field1 };
// 	// 						const param2 = { average: average2, field: field2 };
// 	for (let average1 of [89, 100, 144, 200, 233]) {
// 		for (let average2 of [2, 3]) {
// 			for (let field1 of Object.values(Field)) {
// 				for (let field2 of [Field.High]) {
// 					for (let factory1 of [factories.ema, factories.ma]) {
// 						for (let factory2 of [factories.ema, factories.ma]) {
// 							const param1 = { average: average1, field: field1 };
// 							const param2 = { average: average2, field: field2 };
// 							console.log(param1, param2, factory1.signature, factory2.signature)
// 							const eventsArray = calculateTwoLineSeries(factory1, factory2, param1, param2);
// 							const winSeries = calculateWinSeries(eventsArray);
// 							const analyzed = calculatePositionsCount(winSeries, candles);
// 							analyzed['signature'] = {
// 								param1, param2, f1: factory1.signature, f2: factory2.signature
// 							}
// 							results.push(analyzed)
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	return results
// }
