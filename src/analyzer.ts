import { Container } from './container';

import { Period } from './models/period';
import { analyzeWinSeries } from './utils/win-series-analyzer';

const container = new Container();

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