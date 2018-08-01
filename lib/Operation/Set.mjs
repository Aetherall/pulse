import { Op } from '.'
import { Pointer } from '..'

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
		const value = this.value instanceof Pointer ? this.value.toJSON() : this.value
		return { op: 'set', value }
	}

	static fromJSON(core, op) {
		const value = op.value.__type === 'pointer' ? new core.Pointer(op.value) : op.value
		return new SetOp(value)
	}
}
