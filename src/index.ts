import { Container } from './container';
import config from 'config';
import { Period } from './period';
import { analyzeTwoLineSeries, analyzeWinSeries, calculateTwoLineSeries } from './utils/win-series-analyzer';
import { calculateSeries } from './utils/win-series-calculator';

const container = new Container();
const { api } = container;
const port = config.api.port;


const run = async () => {
	const paramsCandles = { code: 'GAZP', period: new Period('H1'), name: 'GAZP' }
	// const paramsCandles = { code: 'YNDX', period: new Period('M15'), name: 'YNDX' }
	// const paramsCandles = { code: 'SBER', period: new Period('M15'), name: 'SBER' }
	// const paramsCandles = { code: 'AFLT', period: new Period('M15'), name: 'AFLT' }
	// const paramsCandles = { code: 'ALRS', period: new Period('M15'), name: 'ALRS' }
	// const paramsCandles = { code: 'RTKM', period: new Period('M15'), name: 'RTKM' }
	// const paramsCandles = { code: 'DSKY', period: new Period('M15'), name: 'DSKY' }
	const candles = await container.repositories.candleDbRepository.getCandles(paramsCandles);
	const result = await analyzeWinSeries(candles, paramsCandles);
	console.log(JSON.stringify(result));
	// const result = await analyzeTwoLineSeries(candles, paramsCandles);
	// console.log(JSON.stringify(result));
}

run().then()

api.expressApp.listen(port, () => {
	console.log(`Started on port ${port}`);
});
