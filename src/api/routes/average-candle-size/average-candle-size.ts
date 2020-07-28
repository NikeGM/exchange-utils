import { Router } from 'express';
import { asyncMiddleware } from '../../utils/async-middleware';
import { IRoute } from '../../api';
import { CandleDbRepository } from '../../../repositories/candle-repository';
import { averageCandle } from '../../../utils/average-candle';

const defaultParams = {
	period: 'H1',
	name: null,
	code: 'gazp'
};

export type averageCandleSizeParamsType = {
	period: string,
	name: string,
	code: string
}


export class AverageCandleSizeRoute implements IRoute {
	private readonly _repository: CandleDbRepository;
	private readonly _route: Router;

	constructor(client, repository) {
		this._repository = repository;
		this._route = Router();

		this._route.get(
			'/',
			asyncMiddleware(async (req, res) => {
				const params: averageCandleSizeParamsType = req.query;
				const result = await this.controller({...defaultParams, ...params});

				res.status(200).json(result);
			})
		);
	}

	public async controller(params: averageCandleSizeParamsType): Promise<number> {
		const queryParams = {...params, limit: 2500, orderBy: 'asc'};
		const candles = await this._repository.getCandles(queryParams);
		return averageCandle(candles);
	}

	public get router(): Router {
		return this._route;
	}
}
