import { Candle } from '../models/candle';
import Decimal from 'decimal.js';

export enum IntersectionType {
	UP = 'UP',
	DOWN = 'DOWN',
}

export type Line = { [key: number]: Decimal }
export type IntersectionMap = { [key: number]: { intersection: IntersectionType, distance: Decimal } }

const getIntersectionType = (candle: Candle, linePoint: Decimal) => {
	if (linePoint.greaterThan(candle.close)) return IntersectionType.UP;
	if (linePoint.lessThan(candle.close)) return IntersectionType.DOWN;
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