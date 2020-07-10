import { Candle } from '../candle';
import { Period } from '../period';

export type candleTypeKeys = {
	code: string;
	period: Period;
}

export type dbCandleType = {
	name: string;
	code: string;
	time: string;
	date: string;
	period: string;

	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	median: number;
	typical: number;
	weighted_close: number;
}

export type getCandlesType = {
	from?: string;
	to?: string;
	period: Period|string;
	name?: string;
	code?: string;
	limit?: number;
	order?: string;
}

export class CandleDbRepository {
	private _client;
	private _table = 'candles';
	private _batchSize = 5000;

	constructor(client) {
		this._client = client;
	}

	public async saveCandles(candles: Candle[]) {
		const batch = [];
		while (candles.length) {
			while (batch.length < this._batchSize && candles.length) {
				batch.push(candles.pop())
			}
			const result = await this._saveCandlesBatch(batch);
			batch.length = 0;
			console.log(result.length);
		}
		return true;
	};

	public deleteCandleType(keys: candleTypeKeys) {
		console.log('DELETE', keys)
		return this._client(this._table)
			.where('period', keys.period.symbol)
			.andWhere('code', keys.code)
			.delete();
	}

	private _saveCandlesBatch(candles: Candle[]) {
		const prepared = candles.map(this._prepareCandle);
		return this._client.insert(prepared, ['id']).into(this._table).catch(console.log)
		// return Promise.resolve([]);
	};

	public async getCandles(params: getCandlesType): Promise<Candle[]> {
		const { from, to, period, name, code, limit, order } = params;
		const periodSymbol = new Period(period).symbol;
		const query = this._client.select('*').from(this._table)
			.where('period', periodSymbol)
			.orderBy('time', 'asc');
		if (name) query.andWhere('name', name);
		if (code) query.andWhere('code', code);
		if (from) query.andWhere('time', '>=', from);
		if (to) query.andWhere('time', '<', to);
		if (limit) query.limit(limit);
		if (order) query.orderBy('time', order);
		const dbCandles = await query;
		console.log(
			`Candles loaded from db. Name: ${name}, code: ${code} period: ${periodSymbol}, from: ${from}, to ${to}, count: ${dbCandles.length}`
		)

		return dbCandles.map(dbCandle => new Candle(dbCandle));
	}

	private _prepareCandle(candle: Candle): dbCandleType {
		const { name, code, time, date, open, high, low, close, volume, median, typical, weightedClose, period } = candle;
		return {
			name, code, date,
			time: time.toString(),
			open: +open,
			high: +high,
			low: +low,
			close: +close,
			volume: +volume,
			median: +median,
			typical: +typical,
			weighted_close: +weightedClose,
			period: period.symbol
		}
	}
}