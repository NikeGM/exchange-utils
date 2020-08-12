// @ts-ignore
import knex from 'knex';
import config from 'config';
import { CandleCsvRepository } from './repositories/candle-csv-repository';
import { CandleDbRepository } from './repositories/candle-repository';
import { Api, RouteOptionsType } from './api/api';
import { AverageCandleSizeRoute, UploadCandlesCsvRoute } from './api/routes';
import { OrderSizeRoute } from './api/routes/order-size/order-size';
import { StopLossSizeRoute } from './api/routes/stop-loss/stop-loss';
import { Storage } from './cache/Storage';
import { RedisStorage } from './cache/redis-storage';

export type repositoriesType = {
	candleDbRepository: CandleDbRepository;
	candleCsvRepository: CandleCsvRepository;
}

export class Container {
	private _connection;
	private _repositories: repositoriesType;
	private _api: Api;
	private _routes: RouteOptionsType[];
	private _storage: Storage;

	get repositories(): repositoriesType {
		if (!this._repositories) {
			const candleDbRepository = new CandleDbRepository(this.dbClient, this.storage);
			const candleCsvRepository = new CandleCsvRepository(candleDbRepository);
			this._repositories = {
				candleCsvRepository,
				candleDbRepository,
			}
		}
		return this._repositories;
	}

	get dbClient() {
		if (!this._connection) {
			const options = {
				client: 'pg',
				connection: config.db.postgres,
			};
			this._connection = knex(options);
		}
		return this._connection
	}

	get storage() {
		if (!this._storage) {
				this._storage = new RedisStorage({host: 'http://redis'});
		}
		return this._storage
	}

	get routes() {
		if (!this._routes) {
			this._routes = [
				{
					path: '/average-candle-size',
					route: new AverageCandleSizeRoute(this.dbClient, this.repositories.candleDbRepository)
				},
				{
					path: '/upload-candles-csv',
					route: new UploadCandlesCsvRoute(this.dbClient, this.repositories)
				},
				{
					path: '/stop-size',
					route: new StopLossSizeRoute()
				},
				{
					path: '/order-size',
					route: new OrderSizeRoute()
				}
			]
		}
		return this._routes;
	}

	get api(): Api {
		if (!this._api) {
			this._api = new Api(this.routes);
		}
		return this._api;
	}

}