import { Field } from '../../constants';
import { Period } from '../../period';
import { Indicator } from '../indicator';

export type MovingAverageParams = {
	field: Field,
	average: number
}

export class MovingAverageIndicator extends Indicator<MovingAverageParams>{
	constructor(period: Period, params: MovingAverageParams) {
		super(period, params)
	}
}
