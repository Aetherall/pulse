class SetOp {
	constructor(value) {
		this._value = value
	}

	applyTo(value) {
		return this._value
	}

	mergeWith(previous) {
		return new SetOp(this._value)
	}
}

class UnsetOp {
	applyTo(value) {
		return undefined
	}

	mergeWith(previous) {
		return new UnsetOp()
	}
}

export class AddOp extends Op {
	constructor(value) {
		super()
		this._value = Array.isArray(value) ? value : [value]
	}

	applyTo(value) {
		if (value == null) {
			return this._value
		}
		if (Array.isArray(value)) {
			return value.concat(this._value)
		}
		throw new Error('Cannot add elements to a non-array value')
	}

	mergeWith(previous) {
		if (!previous) {
			return this
		}
		if (previous instanceof SetOp) {
			return new SetOp(this.applyTo(previous._value))
		}
		if (previous instanceof UnsetOp) {
			return new SetOp(this._value)
		}
		if (previous instanceof AddOp) {
			return new AddOp(this.applyTo(previous._value))
		}
		throw new Error('Cannot merge Add Op with the previous Op')
	}
}
