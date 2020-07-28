import { Container } from './container';
import config from 'config';

const container = new Container();
const { api } = container;
const port = config.api.port;

api.expressApp.listen(port, () => {
	console.log(`Started on port ${port}`);
});
