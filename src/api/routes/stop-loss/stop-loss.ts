import { Router } from 'express';
import { asyncMiddleware } from '../../utils/async-middleware';
import { IRoute } from '../../api';
import Decimal from 'decimal.js';
import { getOrderSize, getStopResult, getStopSize } from '../../../utils/get-order-size';

export type getStopLossParamsType = {
	averageCandleSize: number;
	turnPrice: number;
	openPrice: number;
}

export class StopLossSizeRoute implements IRoute {
	private readonly _route: Router;

	constructor() {
		this._route = Router();

		this._route.get(
			'/',
			asyncMiddleware(async (req, res) => {
				const params: getStopLossParamsType = req.query;

				const result = this.controller(params);
				res.status(200).json(result);
			})
		);
	}

	public controller(params: getStopLossParamsType): getStopResult  {
		const { turnPrice, openPrice, averageCandleSize } = params;
		return getStopSize({
			turnPrice: new Decimal(turnPrice),
			openPrice: new Decimal(openPrice),
			averageCandleSize: new Decimal(averageCandleSize)
		});
	}

	public get router(): Router {
		return this._route;
	}
}
