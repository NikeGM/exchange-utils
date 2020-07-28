import { Candle } from '../models/candle';
import { IntersectionMap, IntersectionType } from './line-candle-intersection-map';
import { Window } from '../models/window';
import { Position, PositionType } from '../models/position';
import Decimal from 'decimal.js';

export enum TemplateEvents {
	SHORT_OPEN = 'SHORT_OPEN',
	SHORT_CLOSE = 'SHORT_CLOSE',
	LONG_OPEN = 'LONG_OPEN',
	LONG_CLOSE = 'LONG_CLOSE'
}


export type criteriaType = {
	openCriteria: {
		short: {
			isxTemplates: IntersectionType[][],
		},
		long: {
			isxTemplates: IntersectionType[][],
		}
	},
	closeCriteria: {
		short: {
			isxTemplates: IntersectionType[][],
		},
		long: {
			isxTemplates: IntersectionType[][],
		}
	}
}

const up = [IntersectionType.UP, IntersectionType.UP_COVER, IntersectionType.UP_INTERSECTION];
const down = [IntersectionType.DOWN, IntersectionType.DOWN_COVER, IntersectionType.DOWN_INTERSECTION];

const getAllCombinations = (arr1, arr2, arr3) => {
	const combinations = [];
	arr1.forEach(item1 => arr2.forEach(item2 => arr3.forEach(item3 => {
		combinations.push([item1, item2, item3]);
	})))
	return combinations;
}


const defaultCriteria: criteriaType = {
	openCriteria: {
		long: {
			isxTemplates: getAllCombinations(down, up, up),
			// isxTemplates: getAllCombinations(down, up, up),
		},
		short: {
			// isxTemplates: getAllCombinations(up, down, down),
			isxTemplates: getAllCombinations(up, down, down),
		}
	},
	closeCriteria: {
		long: {
			isxTemplates: getAllCombinations(up, down, down),
			// isxTemplates: getAllCombinations(up, down, down),
		},
		short: {
			isxTemplates: getAllCombinations(down, up, up),
			// isxTemplates: getAllCombinations(down, up, up),
		}
	}
}

export const templateWaiter = (template: IntersectionType[], event: TemplateEvents) => {
	const executor = (items) => {
		return items.every((item, index) => item === template[index])
	}
	const window = new Window(template.length, executor)
	return <T>(iMapPoint: IntersectionType, data: T): { event: TemplateEvents, data: T } => {
		const matched = window.execute(iMapPoint);
		return matched ? { event, data } : null
	}
}

export const calculatePositionEvents = (candles: Candle[], iMap: IntersectionMap, criteria: criteriaType = defaultCriteria) => {
	let eventsArray = [];
	const templateWaiters = [
		...criteria.closeCriteria.long.isxTemplates.map(template => templateWaiter(template, TemplateEvents.LONG_CLOSE)),
		...criteria.closeCriteria.short.isxTemplates.map(template => templateWaiter(template, TemplateEvents.SHORT_CLOSE)),
		...criteria.openCriteria.long.isxTemplates.map(template => templateWaiter(template, TemplateEvents.LONG_OPEN)),
		...criteria.openCriteria.short.isxTemplates.map(template => templateWaiter(template, TemplateEvents.SHORT_OPEN))
	];

	candles.forEach((candle, index) => {
		const pCandle = candles[index - 1];
		const cCandle = candles[index];
		if (!pCandle) return;
		const pIMap = iMap[pCandle.time];
		if (!pIMap) return;
		const events = templateWaiters.map(waiter =>
			waiter(pIMap.intersection, {
				time: pCandle.time,
				price: cCandle.close
			})
		).filter(event => !!event);
		if (events.length) {
			eventsArray.push(...events);
		}
	})
	return eventsArray;
}

export const calculateSeries = (series: Decimal[]): {[key: number]: number} => {
	let curSeriesLength = 0;
	const result = {}
	series.forEach(win => {
		if (curSeriesLength > 0) {
			if (win.greaterThan(0)) {
				curSeriesLength++;
			} else {
				result[curSeriesLength] = result[curSeriesLength] ? result[curSeriesLength] + 1: 1;
				curSeriesLength = -1;
			}
		} else if (curSeriesLength < 0) {
			if (win.lessThanOrEqualTo(0))  {
			curSeriesLength--;
			} else {
				result[curSeriesLength] = result[curSeriesLength] ? result[curSeriesLength] + 1: 1;
				curSeriesLength = 1;
			}
		} else if (curSeriesLength === 0) {
			curSeriesLength = win.greaterThan(0) ? 1 : -1;
		}
	})
	result[curSeriesLength] = result[curSeriesLength] ? result[curSeriesLength] + 1: 1;
	return result;
}

export const calculateWinSeries = eventsArray => {
	const winSeries = [];
	let currentPosition = new Position();
	for (let event of eventsArray) {
		if (!currentPosition.isOpened()) {
			if (event.event === TemplateEvents.LONG_OPEN || event.event === TemplateEvents.SHORT_OPEN) {
				const type = TemplateEvents.LONG_OPEN ? PositionType.LONG : PositionType.SHORT;
				currentPosition.open(type, event.data.price);
				continue;
			}
		}
		if (currentPosition.isOpened() && !currentPosition.isClosed()) {
			if (event.event === TemplateEvents.LONG_CLOSE || event.event === TemplateEvents.SHORT_CLOSE) {
				const positionResult = currentPosition.close(event.data.price);
				winSeries.push(positionResult.greaterThan(0) ? new Decimal(1) : new Decimal(-1));
				// winSeries.push(positionResult);
				currentPosition = new Position();
			}
		}
	}
	const res = calculateSeries(winSeries);
	return res
}
