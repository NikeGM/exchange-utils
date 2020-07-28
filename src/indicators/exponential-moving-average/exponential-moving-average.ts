import { Field } from '../../constants';
import { Period } from '../../models/period';
import { Indicator } from '../indicator';

export type ExponentialMovingAverageParams = {
	field: Field,
	average: number
}

export class ExponentialMovingAverageIndicator extends Indicator<ExponentialMovingAverageParams>{
	constructor(period: Period, params: ExponentialMovingAverageParams) {
		super(period, params)
	}
}
