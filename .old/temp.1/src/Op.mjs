import PointerSet from './PointerSet'

export class SetOp {
	constructor(value) {
		this._value = value
	}

	applyTo(value) {
		return this._value
	}

	mergeWith(previous) {
		return this
	}

	toJSON() {
		return { op: 'set', value: this._value }
	}
}

export class NoOp {
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

export class UnsetOp {
	constructor() {
		this._value
	}
	applyTo(value) {
		return undefined
	}
	mergeWith() {
		return this
	}
	toJSON() {
		return { op: 'unset' }
	}
}

export class AddOp {
	constructor(value) {
		this._value = new PointerSet(value)
	}

	applyTo(value) {
		if (!value instanceof PointerSet) throw new Error('[ AddOp ] value not PointerSet')
		return new PointerSet().addAll(value).addAll(this._value)
	}

	mergeWith(previous) {
		if (previous instanceof SetOp) {
			if (Symbol.iterator in previous._value) return new SetOp(this._value.addAll(previous._value))
			throw new Error('[ AddOp ] mergeWith : previous value is not iterable')
		}
		if (previous instanceof UnsetOp) return new SetOp(this._value)
		if (previous instanceof AddOp) return new AddOp(previous._value.addAll(this._value))
		if (previous instanceof RemoveOp) return new ArrayOp({ add: this._value, remove: previous._value })
		if (previous instanceof ArrayOp) {
			const add = this._value.addAll(previous.add)
			return compileArrayOp(add, previous.remove)
		}

		throw new Error('[ AddOp ] mergeWith : cannot merge previous value')
	}

	toJSON() {
		return { op: 'add', value: this._value.toJSON() }
	}
}

function compileArrayOp(add, remove) {
	const common = add.common(remove)
	add.deleteAll(common)
	remove.deleteAll(common)
	if (!add.size && !remove.size) return new NoOp()
	if (!add.size && remove.size) return new RemoveOp(remove)
	if (add.size && !remove.size) return new AddOp(add)
	if (add.size && remove.size) return new ArrayOp({ add: add, remove: remove })
	throw new Error('[ CRITICAL ]')
}

export class RemoveOp {
	constructor(value) {
		this._value = new PointerSet(value)
	}

	applyTo(value) {
		if (!value instanceof PointerSet) throw new Error('[ RemoveOp ] value not PointerSet')
		return new PointerSet().addAll(value).deleteAll(this._value)
	}

	mergeWith(previous) {
		if (previous instanceof SetOp) {
			if (Symbol.iterator in previous._value) return new SetOp(this._value.deleteAll(previous._value))
			throw new Error('[ RemoveOp ] mergeWith : previous value is not iterable')
		}
		if (previous instanceof UnsetOp) return new UnsetOp()
		if (previous instanceof AddOp) return new ArrayOp({ add: previous._value, remove: this._value })
		if (previous instanceof RemoveOp) return new RemoveOp(this._value.addAll(this._value))
		if (previous instanceof ArrayOp) {
			const add = previous.add
			const remove = this._value.addAll(previous.remove)
			return compileArrayOp(add, remove)
		}
		throw new Error('[ RemoveOp ] mergeWith : cannot merge previous value')
	}
}

export class ArrayOp {
	constructor({ add, remove }) {
		const common = add.common(remove)
		this.add = add.deleteAll(common)
		this.remove = remove.deleteAll(common)
	}

	applyTo(value) {
		if (!value instanceof PointerSet) throw new Error('[ ArrayOp ] value not PointerSet')
		return new PointerSet()
			.addAll(value)
			.addAll(this.add)
			.deleteAll(this.remove)
	}

	mergeWith(previous) {
		if (previous instanceof SetOp) {
			if (Symbol.iterator in previous._value) return new SetOp(new PointerSet(previous.value).addAll(this.add).deleteAll(this.remove))
			throw new Error('[ ArrayOp ] mergeWith : previous value is not iterable')
		}
		if (previous instanceof UnsetOp) return new SetOp(new PointerSet().addAll(this.add).deleteAll(this.remove))
		if (previous instanceof AddOp) {
			this.add.addAll(previous._value)
			return compileArrayOp(this.add, this.remove)
		}
		if (previous instanceof RemoveOp) {
			this.remove.addAll(previous._value)
			return compileArrayOp(this.add, this.remove)
		}
		if (previous instanceof ArrayOp) {
			this.add.addAll(previous.add)
			this.remove.addAll(previous.remove)
			return compileArrayOp(this.add, this.remove)
		}
	}
}
