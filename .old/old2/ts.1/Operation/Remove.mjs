import { Op, SetOp, UnsetOp, AddOp, ArrayOp, compileArrayOp } from '.'
import { UniqueSet } from '..'

export default class RemoveOp extends Op {
	constructor(value) {
		super()
		this.value = new UniqueSet(value)
	}

	applyTo(value) {
		if (!value instanceof UniqueSet) throw new Error('[ RemoveOp ] value not UniqueSet')
		return new UniqueSet().addAll(value).deleteAll(this.value)
	}

	mergeWith(previous) {
		if (previous instanceof SetOp) {
			if (Symbol.iterator in previous.value) return new SetOp(this.value.deleteAll(previous.value))
			throw new Error('[ RemoveOp ] mergeWith : previous value is not iterable')
		}
		if (previous instanceof UnsetOp) return new UnsetOp()
		if (previous instanceof AddOp) return new ArrayOp(previous.value, this.value)
		if (previous instanceof RemoveOp) return new RemoveOp(this.value.addAll(this.value))
		if (previous instanceof ArrayOp) return compileArrayOp(previous.add, this.value.addAll(previous.remove))
		throw new Error('[ RemoveOp ] mergeWith : cannot merge previous value')
	}

	static fromJSON(core, op) {
		const value = new UniqueSet()
		for (const pointer of op.value) value.add(new core.Pointer(pointer))
		return new RemoveOp(value)
	}
}
