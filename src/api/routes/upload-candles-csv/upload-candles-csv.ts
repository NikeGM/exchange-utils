import { Router } from 'express';
import { asyncMiddleware } from '../../utils/async-middleware';
import { IRoute } from '../../api';
import { repositoriesType } from '../../../container';
import { Period } from '../../../models/period';

export type uploadCandlesCsvType = {
	em: string;
	period: string;
	name: string;
	code: string;
	startTime: number;
}


export class UploadCandlesCsvRoute implements IRoute {
	private readonly _repositories: repositoriesType;
	private readonly _route: Router;

	constructor(client, repositories: repositoriesType) {
		this._repositories = repositories;
		this._route = Router();

		this._route.post(
			'/',
			asyncMiddleware(async (req, res) => {
				const { name, code, period, em, startTime } = req.query;
				const params: uploadCandlesCsvType = {
					name, code, period, em, startTime
				};
				if (!period || !code) {
					console.log('ERROR', params);
					res.status(200).json(0)
					return;
				}
				const result = await this.controller({ ...params });

				res.status(200).json(result);
			})
		);
	}

	public async controller(params: uploadCandlesCsvType): Promise<boolean> {
		const candles = await this._repositories.candleCsvRepository.loadFinamCandles(params)
		await this._repositories.candleDbRepository.deleteCandleType(
			{
				period: new Period(params.period),
				code: params.code
			})
		return this._repositories.candleDbRepository.saveCandles(candles);
	}

	public get router(): Router {
		return this._route;
	}
}
