import Op from './Op'

export default class SetOp extends Op {
	constructor(core, value) {
		super()
		this._value = value
	}

	applyTo(value) {
		return this._value
	}

	mergeWith() {
		return new SetOp(core, this._value)
	}
}
