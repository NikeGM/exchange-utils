import { Router } from 'express';
import { asyncMiddleware } from '../../utils/async-middleware';
import { IRoute } from '../../api';
import { repositoriesType } from '../../../container';
import { Period } from '../../../period';

export type uploadCandlesCsvType = {
	file: string;
	period: string;
	name: string;
	code: string;
	source?: string;
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
				const { name, code, period, source } = req.query;
				const params: uploadCandlesCsvType = {
					file: req.files.upfile.data.toString(),
					name, code, period, source
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
		let candles;
		if (params.source === 'finam') {
			candles = this._repositories.candleCsvRepository.finamTxtToCandles(params)
		} else {
			candles = this._repositories.candleCsvRepository.csvToCandles(params);
		}
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
