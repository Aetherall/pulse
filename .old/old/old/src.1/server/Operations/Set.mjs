class Op {}

class SetOp {
	constructor(value) {}

	applyTo(value) {
		return this.value
	}

	mergeWith(previous) {
		return new SetOp(this.value)
	}

	toJSON() {
		return
	}
}

export class UnsetOp extends Op {
	applyTo(value) {
		return undefined
	}

	mergeWith(previous) {
		return new UnsetOp()
	}

	toJSON() {
		return { __op: 'Delete' }
	}
}
