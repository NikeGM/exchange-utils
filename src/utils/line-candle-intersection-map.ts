import { Candle } from '../candle';
import Decimal from 'decimal.js';

export enum IntersectionType {
	UP = 'UP',
	DOWN = 'DOWN',
	DOWN_COVER = 'DOWN_COVER',
	UP_COVER = 'UP_COVER',
	UP_INTERSECTION = 'UP_INTERSECTION',
	DOWN_INTERSECTION = 'DOWN_INTERSECTION'
}

export type Line = { [key: number]: Decimal }
export type IntersectionMap = { [key: number]: { intersection: IntersectionType, distance: Decimal } }

const getIntersectionType = (candle: Candle, linePoint: Decimal) => {
	if (linePoint.greaterThan(candle.high)) return IntersectionType.UP;
	if (linePoint.lessThan(candle.low)) return IntersectionType.DOWN;

	if (linePoint.greaterThan(candle.close) && linePoint.greaterThan(candle.open)) return IntersectionType.UP_COVER;
	if (linePoint.lessThan(candle.close) && linePoint.lessThan(candle.open)) return IntersectionType.DOWN_COVER;

	if (candle.open.greaterThanOrEqualTo(candle.close)) return IntersectionType.DOWN_INTERSECTION;
	if (candle.open.lessThanOrEqualTo(candle.close)) return IntersectionType.UP_INTERSECTION;
	console.log('WTF???', candle, linePoint)
	return null;
}

export const buildLineCandlesIntersectionMap = (candles: Candle[], line: Line) => {
	let currentTime = candles[0].time;
	let intersectionMap: IntersectionMap = {}
	candles.forEach((candle, index) => {
		currentTime = candle.time;
		const pCandle = candles[index - 1];
		if (!pCandle) return;
		const pLine = line[pCandle.time];
		if (!pLine) return;
		intersectionMap[pCandle.time] = {
			distance: Decimal.abs(pCandle.close.minus(pLine)),
			intersection: getIntersectionType(pCandle, pLine)
		}
	})
	return intersectionMap;
}