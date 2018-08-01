import { Op, SetOp, UnsetOp, RemoveOp, ArrayOp, compileArrayOp } from '.'
import { UniqueSet } from '..'

export default class AddOp extends Op {
	constructor(value) {
		super()
		this.value = new UniqueSet(value)
	}

	applyTo(value) {
		if (!value instanceof UniqueSet) throw new Error('[ AddOp ] value not UniqueSet')
		return new UniqueSet().addAll(value).addAll(this.value)
	}

	mergeWith(previous) {
		if (previous instanceof SetOp) {
			if (Symbol.iterator in previous.value) return new SetOp(this.value.addAll(previous.value))
			throw new Error('[ AddOp ] mergeWith : previous value is not iterable')
		}
		if (previous instanceof UnsetOp) return new SetOp(this.value)
		if (previous instanceof AddOp) return new AddOp(previous.value.addAll(this.value))
		if (previous instanceof RemoveOp) return new ArrayOp(this.value, previous.value)
		if (previous instanceof ArrayOp) {
			const add = this.value.addAll(previous.add)
			return compileArrayOp(add, previous.remove)
		}

		throw new Error('[ AddOp ] mergeWith : cannot merge previous value')
	}

	toJSON() {
		return { op: 'add', value: this.value.toJSON() }
	}

	static fromJSON(core, op) {
		const value = new UniqueSet()
		for (const pointer of op.value) value.add(new core.Pointer(pointer))
		return new AddOp(value)
	}
}
