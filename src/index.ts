import { Container } from './container';
import config from 'config';
import { run } from './analyzer';

const container = new Container();
const { api } = container;
const port = config.api.port;

api.expressApp.listen(port, () => {
	console.log(`Started on port ${port}`);
	run().then()
});
