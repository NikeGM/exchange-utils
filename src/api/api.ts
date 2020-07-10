import express, { Express } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Router } from 'express';

export interface IRoute {
	router: Router;
	controller: Function;
}

export type RouteOptionsType = {
	path: string;
	route: IRoute;
}

export class Api {
	private readonly _routes: RouteOptionsType[];
	private _app;
	private readonly _api: express.Router;
	private readonly _options;

	constructor(routes: RouteOptionsType[]) {
		this._routes = routes;
		this._api = express.Router();
		this._routes.forEach(({route, path}) => {
			this._api.use(path, route.router)
		})

		this._options = {
			swaggerDefinition: {
				info: {
					title: 'Api',
					version: '0.0.1',
				},
			},
			apis: ['src/api/routes/*/*.yml'],
		};
	}

	get expressApp(): Express {
		if (!this._app) {
			this._app = express();

			// logger
			this._app.use(morgan('dev'));
			const specs = swaggerJsdoc(this._options);
			this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

			// this._app.use(bodyParser.urlencoded({ extended: false }));
			this._app.use(bodyParser.json());

			this._app.use(fileUpload({
				limits: { fileSize: 50 * 1024 * 1024 },
			}));

			// api router
			this._app.use('/api', this._api);
		}
		return this._app;
	}
}
