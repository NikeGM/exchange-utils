import { buildLineCandlesIntersectionMap, IntersectionType } from '../utils/line-candle-intersection-map';
import { Window } from '../models/window';
import { Candle } from '../models/candle';
import { Indicator } from '../indicators/indicator';
import Decimal from 'decimal.js';
import { IFactory } from '../indicators/factory';

export enum TemplateEvents {
	SHORT_OPEN = 'SHORT_OPEN',
	SHORT_CLOSE = 'SHORT_CLOSE',
	LONG_OPEN = 'LONG_OPEN',
	LONG_CLOSE = 'LONG_CLOSE'
}


export type criteriaType = {
	openCriteria: {
		short: {
			isxTemplate: IntersectionType[],
		},
		long: {
			isxTemplate: IntersectionType[],
		}
	},
	closeCriteria: {
		short: {
			isxTemplate: IntersectionType[],
		},
		long: {
			isxTemplate: IntersectionType[],
		}
	}
}

const invertTemplate = template => template.map(intersection =>
	intersection === IntersectionType.UP ?
		IntersectionType.DOWN :
		IntersectionType.UP
)

const formCriteria = ({ openLong, closeLong }: ocTemplateHandlerParams): criteriaType => ({
	openCriteria: {
		long: {
			isxTemplate: openLong,
		},
		short: {
			isxTemplate: invertTemplate(openLong),
		}
	},
	closeCriteria: {
		long: {
			isxTemplate: closeLong,
		},
		short: {
			isxTemplate: invertTemplate(closeLong),
		}
	}
})

export const templateWaiter = (template: IntersectionType[], event: TemplateEvents, diff: number) => {
	const executor = (items) => {
		return items.every((item, index) => item === template[index])
	}
	const window = new Window(template.length, executor)
	return <T>(iMapPoint: {distance: Decimal, intersection: IntersectionType}, data: T): { event: TemplateEvents, data: T } => {
		const matched = window.execute(iMapPoint.intersection);
		return matched && iMapPoint.distance.gte(Decimal.abs(diff)) ? { event, data } : null
	}
}

export type ocTemplateHandlerParams = {
	openLong: IntersectionType[];
	closeLong: IntersectionType[];
	factory: IFactory<any, any>;
	diff: number;
}

export const oneLineTemplateHandler = (params: ocTemplateHandlerParams) => {
	const { factory, diff } = params;
	const { candles } = factory;
	const indicator = factory.calculate(params);
	const iMap = buildLineCandlesIntersectionMap(candles, indicator.line);
	const criteria = formCriteria(params);
	const eventsArray = [];
	const templateWaiters = [
		templateWaiter(criteria.closeCriteria.long.isxTemplate, TemplateEvents.LONG_CLOSE, diff),
		templateWaiter(criteria.closeCriteria.short.isxTemplate, TemplateEvents.SHORT_CLOSE, diff),
		templateWaiter(criteria.openCriteria.long.isxTemplate, TemplateEvents.LONG_OPEN, diff),
		templateWaiter(criteria.openCriteria.short.isxTemplate, TemplateEvents.SHORT_OPEN, diff)
	];
	candles.forEach((candle, index) => {
		const pCandle = candles[index - 1];
		const cCandle = candles[index];
		if (!pCandle) return;
		const pIMap = iMap[pCandle.time];
		if (!pIMap) return;
		const events = templateWaiters.map(waiter =>
			waiter(pIMap, {
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