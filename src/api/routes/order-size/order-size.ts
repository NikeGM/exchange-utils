import { Router } from 'express';
import { asyncMiddleware } from '../../utils/async-middleware';
import { IRoute } from '../../api';
import Decimal from 'decimal.js';
import { getOrderSize } from '../../../utils/get-order-size';

const defaultParams = {
	defeatRate: 0.7,
	maxLossCount: 10,
};

export type getOrderSizeParamsType = {
	capital: number;
	defeatRate: number;
	stopLoss: number;
	lotSize: number;
	maxLossCount: number;
	price: number;
}


export class OrderSizeRoute implements IRoute {
	private readonly _route: Router;

	constructor() {
		this._route = Router();

		this._route.get(
			'/',
			asyncMiddleware(async (req, res) => {
				const params: getOrderSizeParamsType = req.query;

				const result = this.controller({ ...defaultParams, ...params });
				res.status(200).json(result);
			})
		);
	}

	public controller(params: getOrderSizeParamsType) {
		const { capital, price, defeatRate, lotSize, maxLossCount, stopLoss } = params;
		const convertedParams = {
			lotSize: +lotSize,
			maxLossCount: +maxLossCount,
			capital: new Decimal(capital),
			price: new Decimal(price),
			defeatRate: new Decimal(defeatRate),
			stopLoss: new Decimal(stopLoss)
		}
		return getOrderSize(convertedParams);
	}

	public get router(): Router {
		return this._route;
	}
}
