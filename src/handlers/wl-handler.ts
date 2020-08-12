import { Position, PositionType } from '../models/position';
import { TemplateEvents } from './oc-template-handler';
import Decimal from 'decimal.js';
import { calculateSeries } from '../utils/win-series-calculator';

export const calculateWinSeries = (eventsArray, diffPercentage: number) => {
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
				const percentage = event.data.price.div(currentPosition.openPrice).mul(100).minus(100);
				const isWin = currentPosition.type === PositionType.LONG ?
					percentage.gt(diffPercentage) :
					percentage.lt(-diffPercentage)
				winSeries.push(isWin ? new Decimal(1) : new Decimal(-1));
				currentPosition.close(event.data.price);
				// winSeries.push(positionResult);
				currentPosition = new Position();
			}
		}
	}
	const res = calculateSeries(winSeries);
	return res
}
