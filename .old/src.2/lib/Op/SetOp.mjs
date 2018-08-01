export default class SetOp {
	constructor(core, value) {
		this._value = value
	}

	mergeWith() {
		return new SetOp(core, this._value)
	}
}
