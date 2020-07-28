'use strict';
import { Candle } from '../models/candle';
import { CandleDbRepository } from './candle-repository';

export type loadCandlesType = {
	name: string;
	code: string;
	period: string;
	file: string;
}

export class CandleCsvRepository {
	private _candleDbRepository: CandleDbRepository;

	constructor(candleDbRepository: CandleDbRepository) {
		this._candleDbRepository = candleDbRepository;
	}

	public finamTxtToCandles(params: loadCandlesType): Candle[] {
		const { code, name, period, file } = params;
		const lines = file.split('\r\n').filter(line => !!line.trim());
		lines.shift();
		return lines.map(line => {
			const parsed = line.split(',');
			const date = this.formatFinamTime(parsed[0], parsed[1]);

			return new Candle({
				open: parsed[2],
				high: parsed[3],
				low: parsed[4],
				close: parsed[5],
				volume: parsed[6],
				time: date.getTime(),
				period,
				code,
				name
			})
		})
	}

	public csvToCandles(params: loadCandlesType): Candle[] {
		const { code, name, period, file } = params;
		const lines = file.split('\n').filter(line => !!line.trim());
		return lines.map(line => {
			const parsed = line.split(';');
			const date = this.formatTimestamp(parsed[0]);

			return new Candle({
				open: parsed[1],
				high: parsed[2],
				low: parsed[3],
				close: parsed[4],
				volume: parsed[5],
				time: date.getTime(),
				period,
				code,
				name
			})
		})
	}

	private formatFinamTime(date: string, time: string): Date {
		return new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6,8)} ${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`)
	}

	private formatTimestamp(ts) {
		const parsed = ts.split('.');
		return (new Date(`${parsed[0]}.${parsed[1]}.${parsed[2]} ${parsed[3]}:${parsed[4]}:${parsed[5]}`));
	}
}