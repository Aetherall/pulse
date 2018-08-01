import Op from './Op'

export default class ManyOp extends Op {
	constructor(core, { add, remove } = {}) {
		super()
		this.core = core
		this.relation = true
		this.add = new this.core.PointerSet()
		this.remove = new this.core.PointerSet()
		if (add) add.forEach(item => this.add.add(new this.core.Pointer(item)))
		if (remove) remove.forEach(item => this.remove.add(new this.core.Pointer(item)))
		this.compile()
	}

	compile() {
		for (const toRemove of this.remove) {
			if (this.add.has(toRemove)) {
				this.add.delete(toRemove)
				this.remove.delete(toRemove)
			}
		}
	}

	getLocalPointers(diff) {
		const pointers = new this.core.PointerSet()
		if (this.add) for (const item of this.add) if (!item.exists && !(diff && diff.has(item))) pointers.add(item)
		if (this.remove) for (const item of this.remove) if (!item.exists && !(diff && diff.has(item))) pointers.add(item)
		return pointers
	}

	applyTo(value) {
		if (typeof value !== 'undefined' && typeof value !== 'array') throw new Error('[ Relation - Many ] The previous value should be an array or undefined')
		const res = new this.core.PointerSet()
		if (value) for (const item of value) res.add(item)
		for (const toAdd of this.add) res.add(toAdd)
		for (const toRemove of this.remove) res.delete(toRemove)
		return res
	}

	split() {
		const local = new this.core.ManyOp()
		for (const item of this.add) {
			if (!item.exists) {
				local.add.add(item)
				this.add.delete(item)
			}
		}
		for (const item of this.remove) {
			if (!item.exists) {
				local.remove.add(item)
				this.remove.delete(item)
			}
		}
		if (local.add.size || local.remove.size) return local
		return undefined
	}

	mergeWith(previous) {
		if (typeof previous === 'undefined') return this
		if (typeof previous === 'array') return new this.core.ManyOp({ add: this.add.addAll(previous), delete: this.delete })
	}
}
