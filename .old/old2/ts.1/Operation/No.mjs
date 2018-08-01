import { Op } from '.'

export default class NoOp extends Op {
	applyTo(value) {
		return value
	}
	mergeWith(previous) {
		return previous
	}
	toJSON() {
		return undefined
	}
}
