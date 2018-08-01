import { Op, SetOp, UnsetOp, AddOp, RemoveOp, compileArrayOp } from '.'
import { UniqueSet } from '..'

export default class ArrayOp extends Op {
	constructor(add, remove) {
		super()
		const common = add.common(remove)
		this.add = add.deleteAll(common)
		this.remove = remove.deleteAll(common)
	}

	applyTo(value) {
		if (!value instanceof UniqueSet) throw new Error('[ ArrayOp ] value not UniqueSet')
		return new UniqueSet()
			.addAll(value)
			.addAll(this.add)
			.deleteAll(this.remove)
	}

	mergeWith(previous) {
		if (previous instanceof SetOp) {
			if (Symbol.iterator in previous.value) return new SetOp(new UniqueSet(previous.value).addAll(this.add).deleteAll(this.remove))
			throw new Error('[ ArrayOp ] mergeWith : previous value is not iterable')
		}
		if (previous instanceof UnsetOp) return new SetOp(new UniqueSet().addAll(this.add).deleteAll(this.remove))
		if (previous instanceof AddOp) {
			this.add.addAll(previous.value)
			return compileArrayOp(this.add, this.remove)
		}
		if (previous instanceof RemoveOp) {
			this.remove.addAll(previous.value)
			return compileArrayOp(this.add, this.remove)
		}
		if (previous instanceof ArrayOp) {
			this.add.addAll(previous.add)
			this.remove.addAll(previous.remove)
			return compileArrayOp(this.add, this.remove)
		}
	}

	toJSON() {
		return {
			op: 'array',
			add: this.add.toJSON(),
			remove: this.add.toJSON()
		}
	}

	static fromJSON(core, op) {
		const add = new UniqueSet()
		const remove = new UniqueSet()
		for (const pointer of op.add) add.add(new core.Pointer(pointer))
		for (const pointer of op.remove) remove.add(new core.Pointer(pointer))
		return new ArrayOp(add, remove)
	}
}
