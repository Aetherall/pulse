import PulseSet from '../PulseSet'

export default class ManyOp {
	constructor(core, { add, remove } = {}) {
		this.core = core
		this.relation = true
		this.add = new PulseSet()
		this.remove = new PulseSet()
		if (add) add.forEach(item => this.add.add(new this.core.Pointer(item)))
		if (remove) remove.forEach(item => this.remove.add(new this.core.Pointer(item)))
	}

	getLocalPointers(diff) {
		const pointers = new PulseSet()
		if (this.add) for (const item of this.add) if (!item.exists && !(diff && diff.has(item))) pointers.add(item)
		if (this.remove) for (const item of this.remove) if (!item.exists && !(diff && diff.has(item))) pointers.add(item)
		return pointers
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
}
