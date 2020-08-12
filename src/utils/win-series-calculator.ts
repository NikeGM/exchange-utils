import Decimal from 'decimal.js';

export const calculateSeries = (series: Decimal[]): {[key: number]: number} => {
	let curSeriesLength = 0;
	const result = {}
	series.forEach(win => {
		if (curSeriesLength > 0) {
			if (win.greaterThan(0)) {
				curSeriesLength++;
			} else {
				result[curSeriesLength] = result[curSeriesLength] ? result[curSeriesLength] + 1: 1;
				curSeriesLength = -1;
			}
		} else if (curSeriesLength < 0) {
			if (win.lessThanOrEqualTo(0))  {
			curSeriesLength--;
			} else {
				result[curSeriesLength] = result[curSeriesLength] ? result[curSeriesLength] + 1: 1;
				curSeriesLength = 1;
			}
		} else if (curSeriesLength === 0) {
			curSeriesLength = win.greaterThan(0) ? 1 : -1;
		}
	})
	result[curSeriesLength] = result[curSeriesLength] ? result[curSeriesLength] + 1: 1;
	return result;
}
