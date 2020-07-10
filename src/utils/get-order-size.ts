import Decimal from 'decimal.js';

export type getStopSizeParamsType = {
	openPrice: Decimal;
	turnPrice: Decimal;
	averageCandleSize: Decimal;
}


export type orderSizeParamsType = {
	capital: Decimal;
	defeatRate: Decimal;
	stopLoss: Decimal;
	lotSize: number;
	maxLossCount: number;
	price: Decimal;
}

export type getStopResult = {
	shortStop: Decimal;
	longStop: Decimal;
}

export const getOrderSize = (params: orderSizeParamsType) => {
	const { defeatRate, capital, stopLoss, lotSize, maxLossCount, price } = params;
	const maxSingleLoss = new Decimal(1).minus(defeatRate.pow(new Decimal(1).div(maxLossCount)));
	const count = Decimal.floor(maxSingleLoss.mul(capital).div(Decimal.abs(price.minus(stopLoss))));
	const orderSize = Decimal.floor(count.div(lotSize)).mul(lotSize);
	const orderPrice = orderSize.mul(price);
	return { size: orderSize, price: orderPrice }
}

export const getStopSize = (params: getStopSizeParamsType): getStopResult => {
	const { turnPrice, openPrice, averageCandleSize } = params;
	const diff = Decimal.abs(turnPrice.minus(openPrice));
	const phi = diff.lt(averageCandleSize.mul(5)) ? new Decimal(0.9) : new Decimal(1.5);
	return { shortStop: openPrice.plus(phi.mul(diff)), longStop: openPrice.minus(phi.mul(diff))}
}