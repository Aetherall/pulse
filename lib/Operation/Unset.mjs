import { Op } from '.'

export default class UnsetOp extends Op {
	constructor() {
		super()
	}
	applyTo() {
		return undefined
	}
	mergeWith() {
		return this
	}
	toJSON() {
		return { op: 'unset' }
	}
}
