'use strict';
import { CandleDbRepository } from './candle-repository';
import { uploadCandlesCsvType } from '../api/routes/upload-candles-csv/upload-candles-csv';
import * as http from 'http';
import { Period } from '../models/period';

export type loadCandlesParams = {
	start: number;
	end: number;
	code: string;
	finamCode: number;
	period: Period;
}

export type finamUrlParametersList = {
	code: string;
	e: string;
	market: number;
	em: number;
	p: number;
	dtf: number;
	tmf: number;
	MSOR: number;
	mstimever: number;
	sep: number;
	sep2: number;
	datf: number;
	at: number;
	df: number;
	mf: number;
	yf: number;
	dt: number;
	mt: number;
	yt: number;
	day_start: string;
	month_start: string;
	year_start: string;
	day_end: string;
	month_end: string
	year_end: string
}

export class CandleCsvRepository {
	private _candleDbRepository: CandleDbRepository;

	constructor(candleDbRepository: CandleDbRepository) {
		this._candleDbRepository = candleDbRepository;
	}

	public loadFinamCandles(params: uploadCandlesCsvType) {
		const finamUrlParameters = this.getLoadCandlesParams(params);
	}

	private loadCandles(params): Promise<string> {
			const {
				code, e, market, em, p, yf, yt, month_start, day_start, month_end, day_end, dtf, tmf, MSOR, mstimever, sep, sep2,
				datf, at, year_start, year_end, mf, mt, df, dt,
			} = options;
			http.get(
				`http://export.finam.ru/${code}_${year_start}${month_start}${day_start}_${day_start}${month_end}${day_end}${e}?market=${market}&em=${em}&code=${code}&apply=0&df=${df}&mf=${mf}&yf=${yf}&from=${day_start}.${month_start}.${yf}&dt=${dt}&mt=${mt}&yt=${yt}&to=${day_end}.${month_end}.${yt}&p=${p}&f=${code}_${year_start}${month_start}${day_start}_${year_end}${month_end}${day_end}&e=${e}&cn=${code}&dtf=${dtf}&tmf=${tmf}&MSOR=${MSOR}&mstimever=${mstimever}&sep=${sep}&sep2=${sep2}&datf=${datf}&at=${at}`,
				response => {
					response.on('data', (chunk) => console.log(chunk.toString()));
					response.on('end', () => console.log('end'));
				}
			)
	}

	private getLoadCandlesParams(params: loadCandlesParams): finamUrlParametersList {
		const { start, end, code, period, finamCode } = params;
		const dateStart = new Date(start);
		const dateEnd = new Date(end);
		const defaultOptions =
			{
				e: '.txt',
				market: 1,
				dtf: 4,
				tmf: 3,
				MSOR: 0,
				mstimever: 0,
				sep: 1,
				sep2: 0,
				datf: 1,
				at: 0,
				p: this.finamPeriodMap(period),
				em: finamCode,
			}
		return {
			...defaultOptions,
			yf: dateStart.getFullYear(),
			yt: dateEnd.getFullYear(),
			mf: dateStart.getMonth(),
			mt: dateEnd.getMonth(),
			df: dateStart.getDate() - 1,
			dt: dateEnd.getDate() - 1,
			year_start: dateStart.getFullYear().toString().slice(2),
			year_end: dateEnd.getFullYear().toString().slice(2),
			month_start: (dateStart.getMonth() + 1).toString().padStart(2, '0'),
			month_end: (dateEnd.getMonth() + 1).toString().padStart(2, '0'),
			day_start: dateStart.getDate().toString().padStart(2, '0'),
			day_end: dateEnd.getDate().toString().padStart(2, '0'),
			code
		}
	}

	private finamPeriodMap(period: Period) {
		const map = {
			M1: 1,
			M5: 2,
			M10: 3,
			M15: 4,
			M30: 5,
			H1: 6,
			D1: 7
		}
		return map[period.symbol];
	}
}