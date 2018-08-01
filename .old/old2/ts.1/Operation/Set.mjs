import { Op } from '.'

export default class SetOp extends Op {
	constructor(value) {
		super()
		this.value = value
	}

	applyTo(value) {
		return this.value
	}

	mergeWith(previous) {
		return this
	}

	toJSON() {
		return { op: 'set', value: this.value }
	}

	static fromJSON(core, op) {
		const value = new core.Pointer(op.value)
		return new SetOp(value)
	}
}
